import { createSelector } from 'reselect';
import moment from 'moment';
import { isPlainObject } from 'lodash';
import { mapTagToColor } from 'lib';
import Tags from 'model/classes/tags.class';

const getResultSummaryItems = state => (
  state.data.models.toJS().resultSummaryData.items
);

const getResultHourSummaryItems = state => (
  state.data.models.toJS().resultSummaryHoursData.items
);

const getResultRTDaySummaryItems = state => (
  state.data.models.toJS().resultSummaryRTDayData.items
);

/**
 * Return the available dates for date picker.
 *
 * A date is available (enabled) if it's count is greater than 0. In order
 * to get the enabled dates we will first filter the items and after that,
 * we're preparing the array by setting the tsMoment
 *
 * @param {Array}  items  result summary items
 */
export const getAvailableDatesFromResultSummary = createSelector(
  getResultSummaryItems,
  (items = []) => items
    .filter(day => day.count > 0)
    .reduce((acc, day) => [].concat(acc, { ...day, 'tsMoment': moment.utc(day.ts) }), []) || [],
);

export const getAvailableHoursFromResultHoursSummary = createSelector(
  getResultHourSummaryItems,
  (items = []) => items
    .filter(day => day.count > 0)
    .map(day => parseInt(moment(day.ts).format('H'), 10)),
);

export const getAvailableRTDaysFromResultSummary = createSelector(
  getResultRTDaySummaryItems,
  (items = []) => items
    .filter(day => day.count > 0)
    .reduce((acc, day) => [].concat(acc, { ...day, 'tsMoment': moment.utc(day.ts) }), []) || [],
);

/**
 * Return the timestamp set in props
 *
 * @param {Object} state
 * @param {Object} props
 */
export const getTimestamp = (state, props) => {
  const mode = props.query.mode;
  const timestamp = props.query.timestamp;

  if (mode === 'realtime') {
    return {
      'isrealtime': true,
      'startTime': parseInt(timestamp, 10),
    };
  }
  return parseInt(timestamp, 10);
};

/**
 * Search in array of results the one with the date equal to the day from props
 * Parse the result tags object and for each tag push to the return array an object like:
 * {
 *    label: tag name
 *    count: tag count
 *    color: color associated to tag name
 * }
 *
 * @param {Array} items
 * @param {Number} timestamp
 * @return {Array}
 */
export const getPieChartData = createSelector(
  getResultSummaryItems,
  getTimestamp,
  (items, timestamp) => {
    let results = [];

    const isRealTime = isPlainObject(timestamp) && timestamp.isrealtime;
    const startDate = isRealTime
      ? moment.utc(timestamp.startTime, 'X')
      : moment(timestamp, 'X').startOf('day');
    const endDate = isRealTime
      ? moment(timestamp.startTime, 'X').add(2, 'hours')
      : moment(timestamp, 'X').endOf('day');

    if (items !== undefined) {
      if (isRealTime) {
        results = items
          .filter(item => moment(item.ts).isSameOrBefore(endDate)
          && moment(item.ts).isSameOrAfter(startDate));
        // indexes.forEach(index => results.push(items[index]));
      } else {
        results = items.filter(item => moment(item.ts).isSameOrBefore(endDate, 'day')
        && moment(item.ts).isSameOrAfter(startDate, 'day'));
        // indexes.forEach(index => results.push(items[index]));
      }
    }
    const tags = [];
    let totalCount = 0;
    if (results.length > 0) {
      results.forEach((result) => {
        totalCount += result.count;
        if (result.tag_count && result.tag_count !== 0) {
          const tagsInstance = new Tags(Object.keys(result.tag_count));
          const tagsFromCache = tagsInstance.constructor.getFromCache();
          const tagCount = Object.keys(result.tag_count).reduce((acc, key) => {
            const label = (tagsFromCache[key] && tagsFromCache[key].name) || 'Others';
            if (label.toLowerCase() !== 'benign') {
              return [...acc, {
                'label': label,
                'count': result.tag_count[key],
                'color': mapTagToColor(label),
              }];
            }
            return [...acc];
          }, []);
          if (tagCount.length > 0) {
            tagCount.forEach((item) => {
              let tagIndex;
              tags.forEach((tag, index) => {
                tagIndex = tag.label === item.label ? index : -1;
              });
              if (tagIndex > -1) {
                tags[tagIndex].count += item.count;
              } else {
                tags.push({
                  'label': item.label,
                  'count': item.count,
                  'color': item.color,
                });
              }
            });
            // tags = tags.concat(tagCount);
          }
        }
      });
    }
    return { tags, totalCount };
  },
);

/**
 * Search in array of results those with date between day from props
 * and 7 days before it
 * For each result parse it's tags and return an object like:
 * {
 *    date: day ts
 *    tag_name_i: tag count(tag_name_i)
 * }
 *
 * @param {Array} items
 * @param {Number} timestamp
 * @return {Array}
 */
export const getBarchartData = createSelector(
  getResultSummaryItems,
  getTimestamp,
  (items, timestamp) => {
    const results = [];

    const isRealTime = isPlainObject(timestamp) && timestamp.isrealtime;
    const startDate = isRealTime
      ? moment(timestamp.startTime, 'X').subtract(22, 'hours').format()
      : moment(timestamp, 'X').subtract(6, 'days').format();
    const endDate = isRealTime
      ? moment(timestamp.startTime, 'X').add(2, 'hours').format()
      : moment(timestamp, 'X').format();

    if (items !== undefined) {
      const indexes = Object.keys(items).filter(key => moment(items[key].ts).isSameOrBefore(endDate, 'day')
        && moment(items[key].ts).isSameOrAfter(startDate, 'day'));
      indexes.forEach(index => results.push(items[index]));
    }

    const tags = [];

    if (results.length > 0) {
      if (isRealTime) {
        let resultData;
        results.forEach((result, index) => {
          if (index % 2 === 0) {
            resultData = { 'date': moment(result.ts) };
          }
          if (result.tag_count && Object.keys(result.tag_count).length !== 0) {
            const tagsInstance = new Tags(Object.keys(result.tag_count));
            const tagsFromCache = tagsInstance.constructor.getFromCache();
            Object.keys(result.tag_count).forEach((key) => {
              const label = (tagsFromCache[key] && tagsFromCache[key].name) || 'Others';
              if (label.toLowerCase() !== 'benign') {
                if (resultData[label]) {
                  resultData[label] += result.tag_count[key];
                } else {
                  resultData[label] = result.tag_count[key];
                }
              }
            });
            /* Checking keys.length > 1 as date is already present */
            if (Object.keys(resultData).length > 1 && index % 2 === 0) {
              tags.push(resultData);
            }
          }
        });
      } else {
        results.forEach((result) => {
          const resultData = { 'date': moment(result.ts) };
          if (result.tag_count && Object.keys(result.tag_count).length !== 0) {
            const tagsInstance = new Tags(Object.keys(result.tag_count));
            const tagsFromCache = tagsInstance.constructor.getFromCache();
            Object.keys(result.tag_count).forEach((key) => {
              const label = (tagsFromCache[key] && tagsFromCache[key].name) || 'Others';
              if (label.toLowerCase() !== 'benign') {
                resultData[label] = result.tag_count[key];
              }
            });
            /* Checking keys.length > 1 as date is already present */
            if (Object.keys(resultData).length > 1) {
              tags.push(resultData);
            }
          }
        });
      }
    }
    return tags;
  },
);

/**
 * Get main models list
 * @return {Array} models list
 */

export const getMainModelsList = createSelector(
  getResultSummaryItems,
  (items) => {
    if (items) {
      const mainModels = items.reduce((acc, value) => {
        if (!acc.includes(value.main_model)) {
          return [...acc, value.main_model];
        }

        return acc;
      }, []);
      return mainModels;
    }

    return [];
  },
);

export const getMode = (state, props) => props.query.mode;

/**
 * Get main model and secondary models data
 * @return {Array} models with aliases
 */

export const getModelsList = createSelector(
  getResultSummaryItems,
  getResultHourSummaryItems,
  getTimestamp,
  getMode,
  (batchitems, rtItems, timestamp, mode) => {
    const items = mode === 'realtime' ? rtItems : batchitems;
    if (items) {
      // Filter items by timestamp
      const filteredItems = items
        .filter((item) => {
          if (mode === 'realtime' && timestamp.isrealtime) {
            return moment.utc(item.ts).isBetween(moment.utc(timestamp.startTime, 'X'), moment.utc(timestamp.startTime, 'X').add(2, 'h'), null, []);
          }
          // in case of batch, timestamp will be at start of day and in UTC
          return timestamp === parseInt(moment.utc(item.ts).startOf('day').format('X'), 10);
        });

      const modelsList = filteredItems
        .reduce((acc, item) => {
          let newAcc = acc;
          if (item.main_model && !newAcc.includes(item.main_model)) {
            newAcc = [...newAcc, item.main_model];
          }

          if (item.secondary_models && item.secondary_models.length > 0) {
            item.secondary_models.forEach((secondaryModel) => {
              if (!newAcc.includes(secondaryModel)) {
                newAcc = [...newAcc, secondaryModel];
              }
            });
          }

          return newAcc;
        }, [])
        // Create a placeholder object for models
        .reduce((acc, model) => ({
          ...acc,
          [model]: {
            'aliases': [],
          },
        }), {});

      const modelAliases = filteredItems.reduce((acc, item) => {
        let newAcc = acc;
        // Get main model aliases
        if (item.main_model_alias && item.main_model_alias[item.main_model]) {
          newAcc = {
            ...newAcc,
            [item.main_model]: {
              'aliases': [
                item.main_model_alias[item.main_model],
              ],
            },
          };
        }

        // Interate thru secondary models and update object with their aliases
        if (item.secondary_models_alias && Object.keys(item.secondary_models_alias).length > 0) {
          Object.keys(item.secondary_models_alias).forEach((secondaryModel) => {
            if (item.secondary_models_alias[secondaryModel]) {
              newAcc = {
                ...newAcc,
                [secondaryModel]: {
                  'aliases': [
                    item.secondary_models_alias[secondaryModel],
                  ],
                },
              };
            }
          });
        }

        return newAcc;
      }, modelsList);

      return Object.keys(modelAliases).reduce((acc, option) => {
        let alias = option;

        if (modelAliases[option].aliases.length > 0) {
          alias = modelAliases[option].aliases.join(',');
        }

        return [...acc, {
          'id': option,
          'content': alias,
        }];
      }, []);
    }
    return [];
  },
);
