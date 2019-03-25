import { pick } from 'lodash';
import { objectToArray } from 'lib/decorators';
import moment from 'moment';

import { ENVS, zeppelinConfig } from 'config';
import { ptrxZeppelin, polling } from 'lib/rest';
import { createURL } from 'lib';

const defaultpickKeys = [
  'id',
  'jobName',
  'status',
  'title',
  'dateCreated',
  'dateUpdated',
  'dateStarted',
  'dateFinished',
  'progressUpdateIntervalMs',
  'config',
  'results',
];

/**
 * Create a Map with types { type -> index }
 * @param {Array} types config array with mapping
 * @return {Map}
 */
const createEntityTypeGroup = (types = zeppelinConfig.entityTypesGroups) => {
  const output = new Map();
  types.map((type, index) => output.set(type, index));
  return output;
};

/**
 * Check if there is any paragraphs that are not finished.
 *
 * @param {Array} paragraphs    Paragraphs array
 * @returns {Boolean}
 */
const isRunFinished = (paragraphs) => {
  let done = true;
  let index = 0;
  const firstStartTime = Date(paragraphs[0].started);
  const statusesToCheck = ['RUNNING', 'PENDING'];

  while (done === true && index < paragraphs.length) {
    const startedTime = Date(paragraphs[index].started);
    if (moment(startedTime).isSameOrAfter(moment(firstStartTime))) {
      if (statusesToCheck.includes(paragraphs[index].status)) {
        done = false;
      }
    }

    index += 1;
  }
  return done;
};

/**
 * Find the Patternex notebook ID so we can fetch the info about it
 *
 * If the notebook name is not found in array throw a warning
 * (only in DEV mode - for debugging purpose) and return an empty string.
 *
 * @param {Object} notebooks    All notebooks returned by Zeppelin API
 * @param {String} name         Patternex notebook that we need to find
 * @return {Object}
 */
const findGraphAnalysisNotebook = (notebooks, name = zeppelinConfig.notebookName) => {
  const result = objectToArray(notebooks).filter(note =>
    note.name.toLowerCase() === name.toLowerCase());

  if (result.length === 1) {
    if (Object.keys(result[0]).includes('name')) {
      return result[0].id;
    }
  }

  if (process.env.NODE_ENV === ENVS.DEV) {
    console.warn(result.length === 0  // eslint-disable-line
      ? `[Zeppelin] No ${zeppelinConfig.notebookName} notebook`
      : `[Zeppelin] Multiple ${zeppelinConfig.notebookName} notebooks`);
  }

  return '';
};

/**
 * Eliminate unnecessary informations about paragraphs
 *
 * @param {Object} paragraph  Notebook paragraph
 * @param {Array} keys        Keys that will be picked
 * @return {Object}
 */
const trimParagraph = (paragraph = {}, keys = defaultpickKeys) => pick(paragraph, keys);

/**
 * /api/notebook/<id> returns also the paragraphs, but we need additional
 * informations about paragraphs so we will fetch them one by one based on
 * the ids we found in [/api/notebook/<id>] response.
 *
 * For example, paragraph title is not returned by [/api/notebook/<id>].
 *
 *
 * @param {String} notebookId  The ID of the notebook
 * @param {Array} arr           Array of paragraphs inside the notebook
 * @return {Object}
 */
const getParagraphsById = async (notebookId, arr = []) => {
  try {
    return await Promise.all(arr.map(async (el) => {
      const response = await ptrxZeppelin(`/notebook/${notebookId}/paragraph/${el.id}`);
      return trimParagraph(response.data.body);
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * Get the content of a notebook.
 *
 * @param {String} id   Id of notebook
 */
const getNotebookById = async (id, params = {}) => {
  try {
    let paramsURL = '';
    if (Object.keys(params).length > 0) {
      paramsURL = createURL('/', params);
    }
    const response = await ptrxZeppelin(`/notebook/${id}${paramsURL}`);
    return response.data.body;
  } catch (error) {
    if (process.env.NODE_ENV === ENVS.DEV) {
      console.warn(`[Zeppelin] ${error}`); // eslint-disable-line
    }
    return error;
  }
};


/**
 * Check the status of each paragraph that runned after <startTime>. If
 * There is any that is 'ERROR', the run failed.
 *
 * @param {Moment} startTime
 * @param {Array} list
 * @return {Boolean}
 */
const isRunFailed = (startTime, list) => {
  let failed = false;
  let index = 0;
  const statusesToCheck = ['ERROR'];

  while (failed === false && index < list.length) {
    const finishedTime = moment(list[index].finished, 'ddd MMM DD hh:mm:ss ZZ YYYY');
    if (startTime.isBefore(finishedTime)) {
      if (statusesToCheck.includes(list[index].status)) {
        failed = true;
      }
    }

    index += 1;
  }
  return failed;
};

/**
 * Use a long polling to get the status of paragraphs until all
 * are finished.
 *
 * @param {String} notebookId       ID of notebook
 * @param {Function} success        Success callback
 * @param {Function} fail           Fail callback
 * @param {Function} everyStep      After every call callback
 */
const watchStatus = (
  notebookId,
  success = () => null,
  fail = () => null,
  everyStep = () => null,
) => {
  // Polling function that will get paragraphs status
  const fn = async () => {
    try {
      const response = await ptrxZeppelin.get(`notebook/job/${notebookId}`);
      // At every GET we will have to update the status in our state
      everyStep(response.data.body);

      // Return the paragraphs and also if the run finished (condition to stop the
      // long polling)
      return {
        'status': isRunFinished(response.data.body),
        'payload': response.data.body,
      };
    } catch (error) {
      throw (error);
    }
  };

  // Save the date when start the long polling. This time will be used to
  // filter out paragraphs that didn't run in that in the current polling.
  const pollingStartTime = moment();
  try {
    polling(
      fn,
      zeppelinConfig.timeoutPolling,
      zeppelinConfig.intervalPolling,
    ).then((response) => {
      // If the run is finished but we have paragraphs that failed in current
      // polling, call the fail() function.
      if (isRunFailed(pollingStartTime, response.payload)) {
        return fail(response);
      }
      return success(response);
    }).catch(fail);
  } catch (error) {
    throw error;
  }
};

/**
 * Clean the output and parse it to JSON.
 *
 * @param {Object} data   Paragraph output data
 * @return {Object}
 */
const outputToJson = (data) => {
  const withoutNewLines = data
    .replace(/\r?\n|\r/g, '') // Remove new lines from string
    .replace(/\\"/g, '"') // Replace \\" with "
    .replace(/List\(/g, '[') // Replace List( with [ from Array
    .replace(/]\)/g, ']]') // Replace ) from list with ] from Array
    .replace(/"{/g, '{') // Replace "{ from items: "{}" with {
    .replace(/}"/g, '}'); // Replace }" from items: "{}" with }
  const onlyJsonString = withoutNewLines.slice(withoutNewLines.lastIndexOf('{"data"'));

  return JSON.parse(onlyJsonString);
};


/**
 * First clean the ouput from zeppelin by removing some escapes and
 * Scala List() etc.
 *
 * After that, transform the JSON into Spider chart model.
 *
 * Model: {
 *    'nodes': [],
 *    'links': [],
 * }
 *
 * @param {String} data
 * @return {Object}
 */
const outputToSpiderExpanded = (data) => {
  const jsonData = outputToJson(data).data;
  const output = {
    'nodes': [],
    'links': [],
  };
  const groupMap = createEntityTypeGroup();
  const trimEntityName = str => (str.indexOf('/?') >= 0
    ? `${str.slice(0, str.indexOf('\\/?'))}?...`
    : str);

  if (Object.keys(jsonData).includes('items')) {
    output.nodes = Object.keys(jsonData.items)
      .map(key => ({
        'behavior': jsonData.items[key].behavior,
        'id': jsonData.items[key].entity_name,
        'group': groupMap.get(jsonData.items[key].entity_type),
        'entity_name': trimEntityName(key),
      }));
  }

  if (Object.keys(jsonData).includes('relations')) {
    output.links = jsonData.relations.map(relation => ({
      'source': relation[0],
      'target': relation[1],
      'value': 1,
    }));
  }

  return output;
};

/**
 * First clean the ouput from zeppelin by removing some escapes and
 * Scala List() etc.
 *
 * After that, transform the JSON into Spider chart model.
 *
 * Model: {
 *    'nodes': [],
 *    'links': [],
 * }
 *
 * @param {String} data
 * @param {String} centralEntity
 * @return {Object}
 */
const outputToSpider = (data, centralEntity) => {
  const jsonData = outputToJson(data).data;
  const output = {
    'nodes': [],
    'links': [],
  };
  const groupMap = createEntityTypeGroup();
  const centralEntityObj = jsonData.items[centralEntity];
  const itemHasLink = (id, links) => {
    let boolOutput = false;
    let itr = 0;

    while (boolOutput === false && itr < links.length) {
      if (links[itr]
        && Object.keys(links[itr]).includes('source')
        && Object.keys(links[itr]).includes('target')
      ) {
        if (links[itr].source === id || links[itr].target === id) {
          boolOutput = true;
        }
      }
      itr += 1;
    }

    return boolOutput;
  };

  const trimEntityName = str => (str.indexOf('/?') >= 0
    ? `${str.slice(0, str.indexOf('\\/?'))}?...`
    : str);

  if (Object.keys(jsonData).includes('relations')) {
    output.links = jsonData.relations
      .filter(relation => relation.includes(parseInt(centralEntityObj.entity_name, 10)))
      .map(relation => ({
        'source': relation[0],
        'target': relation[1],
        'value': 1,
      }));
  }

  if (Object.keys(jsonData).includes('items')) {
    output.nodes = Object.keys(jsonData.items)
      .map(key => ({
        'behavior': jsonData.items[key].behavior,
        'id': jsonData.items[key].entity_name,
        'group': groupMap.get(jsonData.items[key].entity_type),
        'entity_name': trimEntityName(key),
      }))
      .filter(el => itemHasLink(parseInt(el.id, 10), output.links));
  }

  return output;
};

export default {
  'findGraphAnalysisNotebook': findGraphAnalysisNotebook,
  'trimParagraph': trimParagraph,
  'getParagraphsById': getParagraphsById,
  'getNotebookById': getNotebookById,
  'watchStatus': watchStatus,
  'outputToJson': outputToJson,
  'outputToSpider': outputToSpider,
  'outputToSpiderExpanded': outputToSpiderExpanded,
};
