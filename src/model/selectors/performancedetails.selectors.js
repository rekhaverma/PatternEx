import { createSelector } from 'reselect';
import moment from 'moment';
import { remove } from 'lodash';
import pipelineToName from 'lib/decorators/pipeline-to-name';
import jsLib from 'lib/js-native-functions';

/* Get performance details items */
const getItems = state => state.data.performancedetails.toJS().items;

/* Function that get the state and return an array with pipeline names */
const getPipelinesList = (state) => {
  const items = Object.values(state.data.performancedetails.toJS().items);
  if (items.length > 0) {
    // remove system because is not a pipeline
    // under system property is aggregated info per day
    return remove(Object.keys(items[0]), item => item !== 'system');
  }
  return items;
};

/* Function that get the list of tags/labels and a list of current tra
 */

const getNumberOfLabelTypes = labels => (
  Object.keys(labels).reduce((acc, value) => {
    let newAcc = acc;
    if (labels[value].total_label > 0 && value !== 'total') {
      newAcc += 1;
    }
    return newAcc;
  }, 0)
);

/**
 * Build a new object of objects with UNIX time transformed date as main keys
 * and total_label and total_precision as info in
 *
 * Example:
 * {
    '1590100101': {
      'precision': 0.83,
      'topLabel': 1231,
      },
    }
 * }
 *
 * @return {Object} Filtered data
 */

export const getSystemInfo = createSelector(
  getItems,
  (items) => {
    let systemInfo = null;
    if (items) {
      systemInfo = Object.keys(items).reduce((acc, value) => {
        acc[moment(value).format('x')] = {
          'precision': jsLib.toFixed(items[value].system.trailing_precision),
          'topLabel': items[value].system.total_label,
        };
        return acc;
      }, {});
    }

    return systemInfo;
  },
);

/**
 * function that get an array of dates and sort by a specified type
 * @return {Array} Sorted dates
 */

const sortDates = (dates = [], type = 'ascending') => {
  const lessThan = type === 'ascending' ? -1 : 1;
  const greaterThan = type === 'ascending' ? 1 : -1;

  return dates.sort((a, b) => {
    if (moment(a).isBefore(b)) {
      return lessThan;
    }
    if (!(moment(a).isBefore(b))) {
      return greaterThan;
    }
    return 0;
  });
};

/**
 * Function return information of latest date
 * after gets all items and sort them descending
 * @return {Object} Latest date information
 */

const getLatestDayInfo = createSelector(
  getItems,
  (items) => {
    const mostRecentDate = sortDates(Object.keys(items) || [], 'descending')[0];
    return items[mostRecentDate];
  },
);

/**
 * Function return the latest date from performance details items
 * @return {String} Latest date
 */

export const getLatestDayDate = createSelector(
  getItems,
  (items) => {
    const mostRecentDate = sortDates(Object.keys(items) || [], 'descending')[0];
    return moment(mostRecentDate).format('MM-DD-YYYY');
  },
);

/**
 * Build a new object of objects with pipeline names as keys
 * and calculate accuracy and total labels of a pipeline for specified interval
 *
 * Example:
 * {
    'domanin': {
      'name': 'Domain',
      'accuracy': '29%',
      'label': '12 Labels | 4 Types',
      },
    }
 * }
 *
 * @return {Object} Filtered data
 */

export const filterByPipeline = createSelector(
  getLatestDayInfo,
  getPipelinesList,
  (items, pipelines) => {
    let rowsData = {};
    pipelines.forEach((pipeline) => {
      const totalPrecision = +items[pipeline].total.trailing_precision.toFixed(2);
      const totalLabels = +items[pipeline].total.total_label;
      const totalTypes = getNumberOfLabelTypes(items[pipeline]);

      if (totalLabels > 0) {
        rowsData = {
          ...rowsData,
          [pipeline]: {
            'name': `${totalLabels} ${pipelineToName(pipeline)}s`,
            'accuracy': totalPrecision,
            'labels': {
              'total': totalLabels,
              'types': totalTypes,
            },
          },
        };
      }
    });

    return rowsData;
  },
);

/* Function that get the pipelines list and calculate the sum
 * of all labels from every pipeline
 *
 * @return {Number} Total labels
 */

export const getTotalLabels = createSelector(
  getLatestDayInfo,
  (item) => {
    if (item) {
      return item.system.total_label;
    }
    return 0;
  },
);

/* Function that get the items list and calculate the average
 * of all precisions from system field
 *
 * @return {Number} Average precision
 */

export const getTotalPrecision = createSelector(
  getLatestDayInfo,
  (item) => {
    if (item) {
      return +(item.system.trailing_precision.toFixed(2));
    }
    return 0;
  },
);
