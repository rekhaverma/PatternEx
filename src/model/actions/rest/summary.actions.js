import ptrxREST from 'lib/rest';
import moment from 'moment';
import { omit, isEqual } from 'lodash';
import { isSameArray } from 'lib';

import { dateToRange } from 'lib/decorators';

import { addNotification } from '../ui.actions';

const createHash = (start, end, type, paramsArr) => `${moment(parseInt(start, 10) * 1000).format('YYYYMMDD')}/${moment(parseInt(end, 10) * 1000).format('YYYYMMDD')}#${type}${''.concat(...paramsArr)}`;

export const FETCH_MALICIOUS_BEHAVIOR = '@@rest/FETCH_MALICIOUS_BEHAVIOR';
export const FETCH_MALICIOUS_BEHAVIOR_COMPLETE = '@@rest/FETCH_MALICIOUS_BEHAVIOR_COMPLETE';
export const FETCH_MALICIOUS_BEHAVIOR_FAILED = '@@rest/FETCH_MALICIOUS_BEHAVIOR_FAILED';
export const REFRESH_MALICIOUS_BEHAVIOR = '@@rest/REFRESH_MALICIOUS_BEHAVIOR';
export const REFRESH_MALICIOUS_BEHAVIOR_COMPLETE = '@@rest/REFRESH_MALICIOUS_BEHAVIOR_COMPLETE';
export const REFRESH_MALICIOUS_BEHAVIOR_FAILED = '@@rest/REFRESH_MALICIOUS_BEHAVIOR_FAILED';

const dateRangePagination = async (href, settings, totalCount) => {
  const urls = [];
  const othersParams = omit(settings, ['start', 'limit']);
  const paramsArr = Object.keys(othersParams).map(el => (`&${el}=${settings[el]}`));
  let start = settings.start;

  while (start < totalCount) {
    const limit = settings.limit ? `&limit=${settings.limit}` : '';
    urls.push(`${href}&start=${start}${limit}${''.concat(...paramsArr)}`);
    if ((start + settings.limit) > totalCount) {
      start += totalCount - settings.limit;
    } else {
      start += settings.limit;
    }
  }

  try {
    return await Promise.all(urls.map(async (req) => {
      const response = await ptrxREST.get(req);
      return response.data.items;
    }));
  } catch (error) {
    throw error;
  }
};

export const fetchMaliciousBehavior = (startTime, endTime, pagination = { 'limit': 1000, 'start': 0 }, force = false) =>
  async (dispatch, getState) => {
    const hash = getState().raw.toJS().maliciousBehaviorHash;
    const reduxItems = getState().raw.toJS().maliciousBehavior;
    const paramsArr = Object.keys(pagination).map(el => (`&${el}=${pagination[el]}`));
    const currentHash = createHash(startTime, endTime, 'malicious', paramsArr);
    if ((hash === currentHash && reduxItems.length > 0) && !force) {
      return;
    }
    try {
      dispatch({ 'type': FETCH_MALICIOUS_BEHAVIOR });
      const response = await ptrxREST.get(`maliciousbehavior?start_time=${startTime}&end_time=${endTime}${''.concat(...paramsArr)}`);
      let items = response.data.items;

      if (response.data.totalCount >= response.data.limit) {
        const paginationResponse = await dateRangePagination(
          `maliciousbehavior?start_time=${startTime}&end_time=${endTime}${pagination.pipeline
            ? (`&pipeline=${pagination.pipeline}`) : ''}`,
          { 'limit': 1000, 'start': response.data.limit },
          response.data.totalCount,
        );
        items = paginationResponse.reduce((acc, arr) => acc.concat(arr), items);
      }

      dispatch({
        'type': FETCH_MALICIOUS_BEHAVIOR_COMPLETE,
        'payload': { 'items': items, 'hash': currentHash },
      });
    } catch (error) {
      dispatch({ 'type': FETCH_MALICIOUS_BEHAVIOR_FAILED, 'payload': error });
      dispatch(addNotification('error', 'Fetch malicious behavior failed'));
      throw (error);
    }
  };

export const refreshMaliciousBehavior = (startTime, endTime, pagination = { 'limit': 1000, 'start': 0 }, force = false) =>
  async (dispatch, getState) => {
    const hash = getState().raw.toJS().maliciousBehaviorHash;
    const reduxItems = getState().raw.toJS().maliciousBehavior;
    const paramsArr = Object.keys(pagination).map(el => (`&${el}=${pagination[el]}`));
    const currentHash = createHash(startTime, endTime, 'malicious', paramsArr);
    if ((hash === currentHash && reduxItems.length > 0) && !force) {
      return;
    }
    try {
      dispatch({ 'type': REFRESH_MALICIOUS_BEHAVIOR });
      const response = await ptrxREST.get(`maliciousbehavior?start_time=${startTime}&end_time=${endTime}${''.concat(...paramsArr)}`);
      let items = response.data.items;
      if (response.data.totalCount >= response.data.limit) {
        const paginationResponse = await dateRangePagination(
          `maliciousbehavior?start_time=${startTime}&end_time=${endTime}${pagination.pipeline
            ? (`&pipeline=${pagination.pipeline}`) : ''}`,
          { 'limit': 1000, 'start': response.data.limit },
          response.data.totalCount,
        );
        items = paginationResponse.reduce((acc, arr) => acc.concat(arr), items);
      }

      if (!isSameArray(reduxItems, items)) {
        dispatch({
          'type': REFRESH_MALICIOUS_BEHAVIOR_COMPLETE,
          'payload': { 'items': items, 'hash': currentHash },
        });
        dispatch(addNotification('success', 'Malicious data is refreshed'));
      } else {
        dispatch({
          'type': REFRESH_MALICIOUS_BEHAVIOR_COMPLETE,
          'payload': {},
        });
        dispatch(addNotification('success', 'No new Malicious data is available'));
      }
    } catch (error) {
      dispatch({ 'type': REFRESH_MALICIOUS_BEHAVIOR_FAILED, 'payload': error });
      dispatch(addNotification('error', 'Fetch malicious behavior failed'));
      throw (error);
    }
  };

export const FETCH_SUSPICIOUS_BEHAVIOR = '@@rest/FETCH_SUSPICIOUS_BEHAVIOR';
export const FETCH_SUSPICIOUS_BEHAVIOR_COMPLETE = '@@rest/FETCH_SUSPICIOUS_BEHAVIOR_COMPLETE';
export const FETCH_SUSPICIOUS_BEHAVIOR_FAILED = '@@rest/FETCH_SUSPICIOUS_BEHAVIOR_FAILED';
export const REFRESH_SUSPICIOUS_BEHAVIOR = '@@rest/REFRESH_SUSPICIOUS_BEHAVIOR';
export const REFRESH_SUSPICIOUS_BEHAVIOR_COMPLETE = '@@rest/REFRESH_SUSPICIOUS_BEHAVIOR_COMPLETE';
export const REFRESH_SUSPICIOUS_BEHAVIOR_FAILED = '@@rest/REFRESH_SUSPICIOUS_BEHAVIOR_FAILED';

export const fetchSuspiciousBehavior = (startTime, endTime, params = { 'limit': 1000, 'start': 0 }, force = false) =>
  async (dispatch, getState) => {
    const hash = getState().raw.toJS().suspiciousBehaviorHash;
    const reduxItems = getState().raw.toJS().suspiciousBehavior;
    const paramsArr = Object.keys(params).map(el => (`&${el}=${params[el]}`));
    const currentHash = createHash(startTime, endTime, 'suspicious', paramsArr);
    if ((hash === currentHash && reduxItems.length > 0) && !force) {
      return;
    }

    try {
      dispatch({ 'type': FETCH_SUSPICIOUS_BEHAVIOR });
      const response = await ptrxREST.get(`suspiciousbehavior?start_time=${startTime}&end_time=${endTime}${''.concat(...paramsArr)}`);
      let items = response.data.items;
      if (response.data.totalCount >= response.data.limit) {
        const paginationResponse = await dateRangePagination(
          `suspiciousbehavior?start_time=${startTime}&end_time=${endTime}${params.pipeline ? `&pipeline=${params.pipeline}` : ''}`,
          { ...params, 'start': response.data.limit },
          response.data.totalCount,
        );
        items = paginationResponse.reduce((acc, arr) => acc.concat(arr), items);
      }
      dispatch({
        'type': FETCH_SUSPICIOUS_BEHAVIOR_COMPLETE,
        'payload': { 'items': items, 'hash': currentHash },
      });
    } catch (error) {
      dispatch({ 'type': FETCH_SUSPICIOUS_BEHAVIOR_FAILED, 'payload': error });
      dispatch(addNotification('error', 'Fetch suspicious behavior failed'));
      throw (error);
    }
  };

export const refreshSuspiciousBehavior = (startTime, endTime, params = { 'limit': 1000, 'start': 0 }, force = false) =>
  async (dispatch, getState) => {
    const hash = getState().raw.toJS().suspiciousBehaviorHash;
    const reduxItems = getState().raw.toJS().suspiciousBehavior;
    const paramsArr = Object.keys(params).map(el => (`&${el}=${params[el]}`));
    const currentHash = createHash(startTime, endTime, 'suspicious', paramsArr);
    if ((hash === currentHash && reduxItems.length > 0) && !force) {
      return;
    }

    try {
      dispatch({ 'type': REFRESH_SUSPICIOUS_BEHAVIOR });
      const response = await ptrxREST.get(`suspiciousbehavior?start_time=${startTime}&end_time=${endTime}${''.concat(...paramsArr)}`);
      let items = response.data.items;
      if (response.data.totalCount >= response.data.limit) {
        const paginationResponse = await dateRangePagination(
          `suspiciousbehavior?start_time=${startTime}&end_time=${endTime}${params.pipeline ? `&pipeline=${params.pipeline}` : ''}`,
          { ...params, 'start': response.data.limit },
          response.data.totalCount,
        );
        items = paginationResponse.reduce((acc, arr) => acc.concat(arr), items);
      }

      if (!isSameArray(reduxItems, items)) {
        dispatch({
          'type': REFRESH_SUSPICIOUS_BEHAVIOR_COMPLETE,
          'payload': { 'items': items, 'hash': currentHash },
        });
        dispatch(addNotification('success', 'Suspicious data is refreshed'));
      } else {
        dispatch({
          'type': REFRESH_SUSPICIOUS_BEHAVIOR_COMPLETE,
          'payload': {},
        });
        dispatch(addNotification('success', 'No new Suspicious data is available'));
      }
    } catch (error) {
      dispatch({ 'type': REFRESH_SUSPICIOUS_BEHAVIOR_FAILED, 'payload': error });
      dispatch(addNotification('error', 'Fetch suspicious behavior failed'));
      throw (error);
    }
  };


export const FETCH_SUMMARY = '@@rest/FETCH_SUMMARY';
export const FETCH_SUMMARY_BY_CHUNK = '@@rest/FETCH_SUMMARY_BY_CHUNK';
export const FETCH_SUMMARY_COMPLETE = '@@rest/FETCH_SUMMARY_COMPLETE';
export const FETCH_SUMMARY_CHUNK_COMPLETE = '@@rest/FETCH_SUMMARY_CHUNK_COMPLETE';
export const FETCH_SUMMARY_FAILED = '@@rest/FETCH_SUMMARY_FAILED';
export const REFRESH_SUMMARY = '@@rest/REFRESH_SUMMARY';
export const REFRESH_SUMMARY_COMPLETE = '@@rest/REFRESH_SUMMARY_COMPLETE';
export const REFRESH_SUMMARY_CHUNK_COMPLETE = '@@rest/REFRESH_SUMMARY_CHUNK_COMPLETE';
export const REFRESH_SUMMARY_FAILED = '@@rest/REFRESH_SUMMARY_FAILED';

/**
 * @param {Object} startDate  Moment instance
 * @param {Object} endDate    Moment instance
 * @return {Thunk}
 */
export const fetchBehaviorSummary = (
  startDate,
  endDate,
) => async (dispatch) => {
  try {
    dispatch({ 'type': FETCH_SUMMARY });
    const urls = dateToRange('behaviorsummary?create_time=', startDate, endDate, 'X');

    urls.forEach(async (urlData) => {
      const response = await ptrxREST.get(urlData.url);
      return dispatch({
        'type': FETCH_SUMMARY_CHUNK_COMPLETE,
        'payload': {
          'items': {
            ...response.data,
            'day_ts': urlData.date,
          },
          'startDate': startDate.format('YYYY-MM-DD'),
          'endDate': endDate.format('YYYY-MM-DD'),
        },
      });
    });
  } catch (error) {
    dispatch({ 'type': FETCH_SUMMARY_FAILED, 'payload': error });
    dispatch(addNotification('error', 'Fetch behavior summary failed'));
    throw (error);
  }
};

/**
 * @param {Object} startDate  Moment instance
 * @param {Object} endDate    Moment instance
 * @return {Thunk}
 */
export const refreshBehaviorSummary = (
  startDate,
  endDate,
) => async (dispatch, getState) => {
  const summaryData = getState().raw.toJS().behaviorSummary;
  try {
    dispatch({ 'type': REFRESH_SUMMARY });
    const urls = dateToRange('behaviorsummary?create_time=', startDate, endDate, 'X');

    urls.forEach(async (urlData) => {
      const response = await ptrxREST.get(urlData.url);

      /* RS-4532 find data from behaviorSummary with same date and compare it with response. */
      const summaryItem = summaryData.find(summary =>
        summary.day_ts === urlData.date);

      response.data = Object.assign({}, response.data, { day_ts: urlData.date });

      if (!isEqual(summaryItem, response.data)) {
        return dispatch({
          'type': REFRESH_SUMMARY_CHUNK_COMPLETE,
          'payload': {
            'items': {
              ...response.data,
              'day_ts': urlData.date,
            },
            'startDate': startDate.format('YYYY-MM-DD'),
            'endDate': endDate.format('YYYY-MM-DD'),
          },
        });
      }
      return dispatch({
        'type': REFRESH_SUMMARY_CHUNK_COMPLETE,
        'payload': {
        },
      });
    });
  } catch (error) {
    dispatch({ 'type': REFRESH_SUMMARY_FAILED, 'payload': error });
    dispatch(addNotification('error', 'Fetch behavior summary failed'));
    throw (error);
  }
};

export const REFRESH_DASHBOARD = 'REFRESH_DASHBOARD';
/**
 * @param {boolean} isRefreshEnabled
 * @return {Thunk}
 */
export const toggleAutoRefresh = isRefreshEnabled => (dispatch, getState) => {
  dispatch({ 'type': REFRESH_DASHBOARD,
    'payload': {
      'isRefreshEnabled': isRefreshEnabled || !getState().raw.toJS().isRefreshEnabled,
    },
  });
};
