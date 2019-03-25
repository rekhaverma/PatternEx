import { createSelector } from 'reselect';
import moment from 'moment';

import { pipelineToName } from 'lib/decorators';

const rawTags = state => state.raw.toJS().tags;
const allLabels = state => state.data.labels.toJS().items;
const labels = label => label;
const pipelines = state => state.raw.toJS().pipelines;
const getEntityLabels = state => state.raw.toJS().explodedView.labelsHistory;
const labelsToBeFiltered = label => label.allLabels;
const inputValue = input => input.inputValue;


/**
 * Add tactic and pipelinv2 (Formated name of pipeline) properties
 * using rawtags and the pipeline respectively.
 *
 * @param {Array} allLabels
 * @param {Object} rawTags
 * @return {Array} Formatted labels
 */
export const formatLabelsData = createSelector(
  allLabels,
  rawTags,
  (label, tags) => label
    && tags
    && label.reduce((acc, item) => acc.concat([{
      ...item,
      'tactic': tags[item.tag_id] && tags[item.tag_id].name,
      'pipelinev2': pipelineToName(item.pipeline),
      'start_time_x': moment.utc(item.time_start).format('X'),
      'start_time_moment': moment.utc(item.time_start),
      'end_time_moment': moment.utc(item.time_end),
    }]), []),
);

/**
 * Returns the count of labels in the past 7 days
 *
 * @param {Array} items
 * @return {Number} lastSevenDayCount
 */
export const getSevenDayCount = createSelector(
  labels,
  (items) => {
    let lastSevenDayCount = 0;
    const fromDate = moment().utc().subtract(7, 'd').startOf('day');
    items.forEach((label) => {
      const labelDate = moment.utc(label.create_time, 'ddd, DD MMM YYYY hh:mm:ss ZZ');
      if (labelDate.isAfter(fromDate) || labelDate.isSame(fromDate)) {
        lastSevenDayCount += 1;
      }
    });

    return lastSevenDayCount;
  },
);

/**
 * Returns the array of active pipelines.
 *
 * @param {Object} pipelines
 * @return {Array}
 */
export const filterEnabledPipelines = createSelector(
  pipelines,
  pipeline => Object.keys(pipeline)
    .filter(key => pipeline[key].enabled)
    .map(item => ({
      'id': pipelineToName(item).toLowerCase(),
      'content': pipelineToName(item) !== 'HPA' ? pipelineToName(item) : 'Login',
    })),
);

/**
 * Filter out the labels based on the searched text
 *
 * @param {Array} labels
 * @return {Array}
 */
export const filterLabels = createSelector(
  labelsToBeFiltered,
  inputValue,
  (label, input) => label.filter(el => (
    el.entity_name.includes(input)
  )),
);

/**
 * Get labels history for EVP page
 * @param {Array} labels
 * @param {Object} tags
 * @return {Array}
 */

export const getLabelsHistory = createSelector(
  getEntityLabels,
  rawTags,
  (history = [], labelsInfo) => history.reduce((acc, value) => {
    if (labelsInfo[value.tag_id]) {
      return [...acc, {
        'name': labelsInfo[value.tag_id].name,
        'create_time': value.time_end,
        'severity': labelsInfo[value.tag_id].severity,
        'description': labelsInfo[value.tag_id].description,
        'type': labelsInfo[value.tag_id].type,
        'id': value.id,
      }];
    }
    return [];
  }, []),
);
