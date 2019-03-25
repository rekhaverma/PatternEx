import { createSelector } from 'reselect';
import { isEmpty } from 'lodash';
import { objectToArray } from 'lib/decorators';
import moment from 'moment';

import filterByKey from 'lib/filter';
import Tags from '../classes/tags.class';

import { tagsMap, dateFormats } from '../../config';

export const filtersFromState = state => state.app.maliciousActivity.toJS();

const rawSelector = state => state.raw;

export const maliciousActivityData = state => state.raw.toJS().maliciousBehavior;
const suspiciousActivityData = state => state.raw.toJS().suspiciousBehavior;
export const tagsFromState = state => state.raw.toJS().tags;

/**
 * Filter data with active filters. The only filter that
 * affect the data is "filterByEntity". Other filters will just
 * highlight filtered data in heat map.
 *
 * This functions is used only for Heat Map. The data table should
 * be filtered with all filters.
 *
 * @return {Array} Filtered data
 */
export const filterData = createSelector(
  maliciousActivityData,
  filtersFromState,
  (data, filtersObj) => {
    const { filterByEntity, timelineRange } = filtersObj;
    let filteredData = data;

    if (!isEmpty(timelineRange.start) && !isEmpty(timelineRange.end)) {
      const startMoment = moment(timelineRange.start);
      const endMoment = moment(timelineRange.end);

      filteredData = filteredData.filter(item =>
        moment(item.create_time).utc().isBetween(startMoment, endMoment));
    }

    if (filterByEntity !== '') {
      return filterByKey(filteredData, 'pipeline', filterByEntity);
    }

    return data;
  },
);


// const identifyEntityRelation = (relations, entityName = '') => {
//   const cluster = relations.filter(relation =>
//     relation.get('cluster_entities').includes(entityName));
//   const firstCluster = cluster.valueSeq().toArray()[0];
//   if (firstCluster !== undefined) {
//     return firstCluster.toJS();
//   }
//   return {};
// };

export const filterListData = createSelector(
  rawSelector,
  maliciousActivityData,
  filtersFromState,
  tagsFromState,
  (raw, data, filters, tags) => {
    const tagsInstance = new Tags(tags);
    // const relations = raw.get('relations').get('items');
    const decorator = (item) => {
      // const cluster = identifyEntityRelation(relations, item.entity_name);

      const formatedDateForAnalytics = moment(item.start_time).format('MM/DD/YYYY hh:mm A');
      const modeType = moment.utc(item.start_time).format('HH:mm:ss') === '00:00:00' ? 'batch' : 'realtime';
      const startTimeMoment = moment.utc(item.start_time);
      const startTimeFormatted = modeType === 'batch' ?
        startTimeMoment.format('MM - DD - YYYY') :
        startTimeMoment.format(dateFormats.displayFormatUS);
      return {
        'create_time': moment.utc(item.create_time).format('MM - DD - YYYY'),
        'start_time': item.start_time,
        'end_time': item.end_time,
        'threat': tagsInstance.getTagById(item.tag_id).name,
        'entity_name': item.entity_name,
        'entity_type': item.entity_type,
        'tag_id': item.tag_id,
        'pipeline': item.pipeline,
        'score': item.score ? Number(item.score.toPrecision(3)) : 0,
        'id': item.id,
        'hash': `${item.id}-${item.entity_type}-${item.tag_id}`,
        'start_time_moment': startTimeMoment,
        'end_time_moment': moment.utc(item.end_time),
        // 'cluster': identifyEntityRelation(relations, item.entity_name),
        'metas': [
          {
            'key': 'Log Source:',
            'value': (Array.isArray(item.log_source) && item.log_source.length > 0)
              ? item.log_source[0]
              : 'Palo Alto Networks',
          },
          {
            'key': 'Related Predictions:',
            'value': item.related_entities === null
              ? 'None'
              : `${item.related_entities.length} Entities`,
          },
        ],
        'actions': [
          {
            'label': 'View Analytics',
            'click': () => window.location = `${window.location.origin}/analytics/#/notebook/EntityDetailAnalytics?customer_name=&entity_name=${item.entity_name}&entity_type=${item.entity_type}&pipeline=${item.pipeline}&date=${formatedDateForAnalytics}`,
          },
          // { 'label': 'View Main Details', 'click': () => null },
        ],
        'handlers': {
          'onInspect': () => {},
          'onConfirm': () => {},
          'onDeny': () => {},
        },
        'start_time_formatted': startTimeFormatted,
        'modeType': modeType,
        'model_name': item.model_name,
        'user_tag': item.user_tag,
      };
    };
    let filteredData = (data && data.map(decorator)) || [];

    if (filters.filterByEntity !== '') {
      filteredData = filterByKey(data, 'pipeline', filters.filterByEntity).map(decorator);
    }
    if (Object.keys(filters.active).length > 0) {
      filteredData = data
        .filter((el => el.pipeline === Object.keys(filters.active)[0]))
        .filter((el) => {
          const activeTagObj = tagsInstance.getTagById(Object.values(filters.active)[0]);
          const currentTagObj = tagsInstance.getTagById(el.tag_id);
          return tagsMap[activeTagObj.name.toLowerCase()]
            .includes(currentTagObj.name.toLowerCase());
        })
        .map(decorator);
    }
    if (filters.highlighted !== '') {
      filteredData = data
        .filter((el) => {
          const utcDate = moment(el.create_time).utc().format('MM - DD - YYYY');
          return filters.highlighted.format('MM - DD - YYYY') === utcDate;
        })
        .map(decorator);
    }

    return filteredData;
  },
);

const behaviorSummary = state => state.raw.toJS().behaviorSummary;
const dates = state => ({
  'start': state.raw.toJS().behaviorSummaryStart,
  'end': state.raw.toJS().behaviorSummaryEnd,
});

const clusterDaysAvailable = (state) => {
  const items = objectToArray(state.raw.get('relations').get('items').toJS());
  const daysWithClusters = [];
  items.forEach(value => daysWithClusters.push({
    'date': moment.utc(value.ts).format('x'),
    'count': 1,
  }));
  return daysWithClusters;
};

const aggregateBehaviorSummaryData = createSelector(
  behaviorSummary,
  summary => summary.reduce((acc, el) => {
    const accCopy = acc;
    const item = el;
    if (item.total_malicious_behavior > 0) {
      accCopy.days_with_malicious.push({
        'date': parseInt(el.day_ts, 10) * 1000,
        'count': item.total_malicious_behavior,
      });
    }

    if (item.total_suspicious_behavior > 0) {
      accCopy.days_with_suspicious.push({
        'date': parseInt(el.day_ts, 10) * 1000,
        'count': item.total_suspicious_behavior,
      });
    }

    accCopy.total_malicious_behavior += item.total_malicious_behavior || 0;
    accCopy.total_suspicious_behavior += item.total_suspicious_behavior || 0;
    ['method_wise_suspicious_behavior', 'pipeline_wise_suspicious_behavior'].forEach((outerKey) => {
      if (item[outerKey]) {
        Object.keys(item[outerKey]).forEach((innerKey) => {
          accCopy[outerKey][innerKey] = accCopy[outerKey][innerKey] || 0;
          accCopy[outerKey][innerKey] += item[outerKey][innerKey] || 0;
        });
      }
    });

    return accCopy;
  }, {
    'method_wise_suspicious_behavior': {},
    'pipeline_wise_suspicious_behavior': {},
    'total_malicious_behavior': 0,
    'total_suspicious_behavior': 0,
    'days_with_malicious': [],
    'days_with_suspicious': [],
  }),
);

export const activityTimeline = createSelector(
  aggregateBehaviorSummaryData,
  clusterDaysAvailable,
  dates,
  (summary, clustersDays, summaryDates) => {
    /* eslint-disable camelcase */
    const {
      days_with_malicious,
      days_with_suspicious,
    } = summary;

    const generateDefaultRange = (start, end) => {
      const range = {};
      const day = moment(start);

      while (day.isBefore(moment(end))) {
        range[day.format('x')] = { 'malicious': 0, 'suspicious': 0, 'clusters': 0 };
        day.add(1, 'day');
      }

      return range;
    };
    let output = generateDefaultRange(summaryDates.start, summaryDates.end) || {};

    const decorator = (arr, type, obj) => arr.reduce(
      (acc, day) => {
        const currentEl = acc[day.date] || { 'malicious': 0, 'suspicious': 0, 'clusters': 0 };
        currentEl[type] += day.count;
        return {
          ...acc,
          [day.date]: currentEl,
        };
      },
      obj,
    );

    if (days_with_malicious && days_with_malicious.length > 0) {
      output = decorator(days_with_malicious, 'malicious', output);
    }

    if (days_with_suspicious && days_with_suspicious.length > 0) {
      output = decorator(days_with_suspicious, 'suspicious', output);
    }

    if (clustersDays && clustersDays.length > 0) {
      output = decorator(clustersDays, 'clusters', output);
    }

    return Object.keys(output)
      .reduce((acc, key) => {
        if (Object.keys(output[key]).includes('suspicious')
          && Object.keys(output[key]).includes('malicious') && Object.keys(output[key]).includes('clusters')) {
          if (output[key].suspicious > 0 || output[key].malicious > 0 || output[key].clusters > 0) {
            return {
              ...acc,
              [key]: output[key],
            };
          }
        }
        return acc;
      }, {});
  },
  /* eslint-enable */
);


export const suspiciousList = createSelector(
  suspiciousActivityData,
  (data = []) => data.map((item) => {
    const modeType = moment.utc(item.start_time).format('HH:mm:ss') === '00:00:00' ? 'batch' : 'realtime';
    const startTimeMoment = moment.utc(item.start_time);
    const startTimeFormatted = modeType === 'batch' ?
      startTimeMoment.format('MM - DD - YYYY') :
      startTimeMoment.format(dateFormats.displayFormatUS);
    return {
      'create_time': moment.utc(item.create_time).format('MM - DD - YYYY'),
      'entity_name': item.entity_name,
      'entity_type': item.entity_type,
      'start_time': item.start_time,
      'end_time': item.end_time,
      'pipeline': item.pipeline,
      'id': item.id,
      'global_rank': Number.parseInt(item.global_rank, 10),
      'method_score': Number(Number.parseFloat(item.method_score).toFixed(2)),
      'start_time_moment': startTimeMoment,
      'end_time_moment': moment.utc(item.end_time),
      'method_name': item.method_name,
      'handlers': {
        'onInspect': () => {},
      },
      'start_time_formatted': startTimeFormatted,
      'modeType': modeType,
      'model_name': item.model_name,
      'user_tag': item.user_tag,
    };
  }),
);


export const isListFiltered = createSelector(
  filtersFromState,
  (filters) => {
    let listIsFiltered = false;

    Object.keys(filters).map((key) => {
      if (!isEmpty(filters[key])) {
        listIsFiltered = true;
      }
      return key;
    });

    return listIsFiltered;
  },
);

export const getLastTimeUpdated = createSelector(
  behaviorSummary,
  /**
   *    Concats the days_with_malicious and days_with_suspicious from
   * behavior summary and returns the maximum (most distant future)
   * of the given moment instances.
   *
   *    If keys 'days_with_malicious' and 'days_with_suspicious' are not
   * in summary object, return empty string.
   *
   * @see https://momentjs.com/docs/#/get-set/max/
   *
   * @param {Object} behaviorSummary redux state
   * @return {String} Date in "MMM Do YYYY" format or empty string
   *
   * @example
   *  Given days_with_malicious and days_with_suspicious:
   *   days_with_malicious = [
   *    { 'date': 1507075200000, ...},
   *    { 'date': 1507161600000, ...},
   *   ],
   *   days_with_suspicious = [
   *    { 'date': 1507161600000, ...},
   *   ],
   *
   *  Return: 1507161600000 formated as "Oct 5th 2017"
   */
  (summary) => {
    if (!Object.keys(summary).includes('days_with_malicious')
      && !Object.keys(summary).includes('days_with_suspicious')) {
      return '';
    }
    const arrOfDates = [].concat(summary.days_with_malicious, summary.days_with_suspicious);
    const buildMomentDates = day => moment.utc(day.date);
    return arrOfDates.length > 0
      ? moment.max(arrOfDates.map(buildMomentDates)).format('MMM Do YYYY')
      : '';
  },
);

const relationsRedux = state => state.raw.get('relations').get('items');
const maliciousRedux = state => state.raw.get('maliciousBehavior');
const suspiciousRedux = state => state.raw.get('suspiciousBehavior');
export const summaryStats = createSelector(
  maliciousRedux,
  suspiciousRedux,
  relationsRedux,
  (malicious, suspicious, relations) => ({
    'malicious': malicious.length || 0,
    'suspicious': suspicious.length || 0,
    'correlations': relations.size,
  }),
);

const getModelAlias = (item) => {
  if (item.model_alias && item.model_alias[item.model_name]) {
    return item.model_alias[item.model_name].join(', ');
  }

  return item.model_name;
};

export const getMaliciousBehaviorWithAlias = createSelector(
  maliciousActivityData,
  items => items.reduce((acc, value) => [...acc, {
    ...value,
    'alias_name': getModelAlias(value),
  }], []),
);

export const getSuspiciousBehaviorWithAlias = createSelector(
  suspiciousActivityData,
  items => items.reduce((acc, value) => [...acc, {
    ...value,
    'alias_name': getModelAlias(value),
  }], []),
);
