import ptrxREST from 'lib/rest';
import { arrayToObject } from 'lib/decorators';

import { addNotification } from './ui.actions';

import Tags from '../classes/tags.class';
import DetectionMetrics from '../classes/detection-metrics.class';

export const FETCH_DETECTIONMETRICS = '@@rest/FETCH_DETECTIONMETRICS';
export const FETCH_DETECTIONMETRICS_COMPLETE = '@@rest/FETCH_DETECTIONMETRICS_COMPLETE';

export const FETCH_TAGS = '@@rest/FETCH_TAGS';
export const FETCH_TAGS_COMPLETE = '@@rest/FETCH_TAGS_COMPLETE';
export const FETCH_TAGS_FAILED = '@@rest/FETCH_TAGS_FAILED';

export const fetchTags = (forcefully = false) => async (dispatch) => {
  const cached = Tags.getFromCache();

  // If we don't have any tags in localStorage, fetch them from API
  if (forcefully || Object.keys(cached).length === 0) {
    dispatch({ 'type': FETCH_TAGS });

    // Try to fetch tags from API
    try {
      const response = await ptrxREST.get('tags');

      // Transform response array to object
      const tagsArr = arrayToObject(response.data.items, 'id');

      // Save tags to localStorage
      Tags.setToCache(tagsArr);

      // Dispatch action to Redux
      dispatch(addNotification('success', 'Fetch complete'));
      return dispatch({ 'type': FETCH_TAGS_COMPLETE, 'payload': { 'items': tagsArr } });
    } catch (error) {
      dispatch({ 'type': FETCH_TAGS_FAILED, 'payload': error });
      dispatch(addNotification('error', 'Fetch tags failed'));
      throw (error);
    }
  }

  // We have tags cached, dispatch action to Redux with cached data
  return dispatch({ 'type': FETCH_TAGS_COMPLETE, 'payload': { 'items': cached } });
};

export const fetchDetectionMetrics = (startDate, endDate) => async (dispatch) => {
  const cached = DetectionMetrics.getFromCache();
  /**
   *  If we do not have a cache version or the items in cache or is a new date range,
   * fetch the data from API otherwise return the cached version.
   */
  if (Object.keys(cached).length === 0
    || (Object.keys(cached).includes('end_time') && DetectionMetrics.shouldRefetch(cached.end_time))) {
    dispatch({ 'type': FETCH_DETECTIONMETRICS });
    try {
      const response = await DetectionMetrics.getDataFromAPI({ startDate, endDate });
      /**
       *  If we have an OK status, cache data, dispach an action to Redux
       * (to let it know the request is done) and return the data.
       *
       *  Data is not saved in Redux because System Performance Report
       * will consume it raw and we don't need it anywhere else right now.
       * If we will have to use the same data elsewhere, we can get it from
       * localStorage with DetectionMetrics.getFromCache() or using this action.
       *
       */
      if (response.status === 200) {
        DetectionMetrics.setToCache(response.data);
        dispatch({ 'type': FETCH_DETECTIONMETRICS_COMPLETE });
        return response.data;
      }
    } catch (error) {
      dispatch(addNotification('error', 'Fetch detection metrics failed'));
      throw (error);
    }
  }

  dispatch({ 'type': FETCH_DETECTIONMETRICS_COMPLETE });
  return cached;
};
