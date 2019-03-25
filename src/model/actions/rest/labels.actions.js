import ptrxREST from 'lib/rest';
import { createURL } from 'lib';
import { omit } from 'lodash';
import { addNotification } from '../ui.actions';

export const INITIATE_FETCH_LABELS = '@@rest/INITIATE_FETCH_LABELS';
export const FETCH_LABELS_COMPLETED = '@@rest/FETCH_LABELS_COMPLETED';
export const FETCH_LABELS_FAILED = '@@rest/FETCH_LABELS_FAILED';

export const FETCH_LABELS_SUMMARY = '@@rest/FETCH_LABELS_SUMMARY';
export const FETCH_LABELS_SUMMARY_COMPLETED = '@@rest/FETCH_LABELS_SUMMARY_COMPLETED';
export const FETCH_LABELS_SUMMARY_FAILED = '@@rest/FETCH_LABELS_SUMMARY_FAILED';
export const UPDATE_LABEL = '@@rest/UPDATE_LABEL';
export const UPDATE_LABEL_SUCCESS = '@@rest/UPDATE_LABEL_SUCCESS';
export const UPDATE_LABEL_FAILED = '@@rest/UPDATE_LABEL_FAILED';
export const DELETE_LABEL = '@@rest/DELETE_LABEL';
export const DELETE_LABEL_SUCCESS = '@@rest/DELETE_LABEL_SUCCESS';
export const DELETE_LABEL_FAILED = '@@rest/DELETE_LABEL_FAILED';
export const SET_DELETE_LABEL_STATE = '@@rest/SET_DELETE_LABEL_STATE';
export const SET_UPDATE_LABEL_STATE = '@@rest/SET_UPDATE_LABEL_STATE';

/**
 * Function to get the labels total count.
 *
 * @param {object} labelSummary
 * @return {Number} labels Total Count
 */
const labelsTotalCount = (labelSummary) => {
  let totalLabels = 0;
  if (labelSummary) {
    const iterFields = labelSummary.label_by_type
      || labelSummary.label_by_pipeline
      || labelSummary.label_by_tag || {};

    Object.keys(iterFields).forEach((key) => {
      totalLabels += iterFields[key] || 0;
    });
  }
  return totalLabels;
};

/**
 * Function to get the pagination response.
 *
 * @param {string} href
 * @param {object} settings
 * @param {Number} totalCount
 * @return {Array}
 */
const paginationResponse = async (href, settings, totalCount) => {
  const urls = [];
  let othersParams = omit(settings, ['start', 'limit']);
  let start = settings.start;

  while (start < totalCount) {
    const limitParam = settings.limit ? { 'limit': settings.limit } : {};
    const startParam = !isNaN(start) ? { 'start': start } : {};
    othersParams = {
      ...othersParams,
      ...limitParam,
      ...startParam,
    };
    urls.push(createURL(href, othersParams));
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

/**
 * Function to fetch all labels
 * get labels in batch based on the totalCount
 *
 * @param {object, number} params, number
 * @return {}
 */
const fetchAllLabels = (params, totalCount) => async (dispatch) => {
  dispatch({ 'type': INITIATE_FETCH_LABELS });
  let queryString = [];
  if (totalCount >= params.limit) {
    try {
      const pipeline = params.pipeline ? { 'pipeline': params.pipeline } : {};
      const response = await paginationResponse(
        'labels',
        {
          ...pipeline,
          'limit': 500,
          'start': 0,
        },
        totalCount,
      );
      if (response) {
        const items = (response && response.length > 1)
          ? response.reduce((acc, arr) => acc.concat(arr), [])
          : response || [];

        dispatch({ 'type': FETCH_LABELS_COMPLETED, 'payload': items });
      } else {
        dispatch({ 'type': FETCH_LABELS_FAILED });
        dispatch(addNotification('error', 'Fetch labels failed'));
      }
    } catch (error) {
      dispatch({ 'type': FETCH_LABELS_FAILED, 'payload': error });
      dispatch(addNotification('error', 'Fetch labels failed'));
      throw (error);
    }
  } else {
    const paramsv2 = {
      ...params,
      'limit': totalCount,
    };
    queryString = Object.keys(paramsv2).map(key => `${queryString}${key}=${paramsv2[key]}`);
    try {
      const response = await ptrxREST.get(`labels?${queryString.join('&')}`);
      if (response.status >= 200 && response.status < 300) {
        dispatch({ 'type': FETCH_LABELS_COMPLETED, 'payload': response.data.items });
      } else {
        dispatch({ 'type': FETCH_LABELS_FAILED });
        dispatch(addNotification('error', 'Fetch labels failed'));
      }
    } catch (error) {
      dispatch({ 'type': FETCH_LABELS_FAILED, 'payload': error });
      dispatch(addNotification('error', 'Fetch labels failed'));
      throw (error);
    }
  }
};

/**
 * Function to fetch all labels
 * 1. get the label summary
 * 2. get the count from the response of the label summary API
 * 3. get labels
 *
 * @param {object, number} params, number
 * @return {}
 */
const fetchLabelsForLabels = (params = { 'limit': 1000, 'start': 0 }) => async (dispatch) => {
  dispatch({
    'type': FETCH_LABELS_SUMMARY,
  });
  try {
    const response = await ptrxREST.get('labelsummary');
    if (response.status >= 200 && response.status < 300) {
      dispatch({
        'type': FETCH_LABELS_SUMMARY_COMPLETED,
        'payload': response,
      });
      const limit = labelsTotalCount(response.data);
      dispatch(fetchAllLabels(params, limit));
    } else {
      dispatch({
        'type': FETCH_LABELS_SUMMARY_FAILED,
      });
      dispatch(addNotification('error', 'Fetch Labels Summary failed'));
    }
  } catch (error) {
    dispatch({
      'type': FETCH_LABELS_SUMMARY_FAILED,
    });
    dispatch(addNotification('error', 'Fetch Labels Summary failed'));
    throw error;
  }
};

/**
 * Update the labels using id and the changed params
 *
 * @param {object, string} params, label's id
 * @return {}
 */
const updateLabel = (params, id) => async (dispatch) => {
  dispatch({
    'type': UPDATE_LABEL,
  });
  try {
    const response = await ptrxREST.put(`labels/${id}`, params);
    if (response.status >= 200 && response.status < 300) {
      dispatch({
        'type': UPDATE_LABEL_SUCCESS,
      });
    } else {
      dispatch({
        'type': UPDATE_LABEL_FAILED,
      });
    }
  } catch (error) {
    dispatch({
      'type': UPDATE_LABEL_FAILED,
    });
  }
};

/**
 * Delete the labels using label id
 *
 * @param {string} label's id
 * @return {}
 */
const deleteLabel = (labelId, callback = () => {}) => async (dispatch) => {
  dispatch({
    'type': DELETE_LABEL,
  });

  try {
    const response = await ptrxREST.delete(`labels/${labelId}`);
    if (response.status >= 200 && response.status < 300) {
      dispatch({
        'type': DELETE_LABEL_SUCCESS,
      });
      callback();
    } else {
      dispatch({
        'type': DELETE_LABEL_FAILED,
      });
    }
  } catch (error) {
    dispatch({
      'type': DELETE_LABEL_FAILED,
    });
  }
};

/**
 * Set deleteLabelCall key in label's state
 *
 * @param {boolean} param
 * @return {}
 */
const setDeleteLabel = param => (dispatch) => {
  dispatch({
    'type': SET_DELETE_LABEL_STATE,
    'payload': param,
  });
};

/**
 * Set updateLabelCall key in label's state
 *
 * @param {boolean} param
 * @return {}
 */
const setUpdateLabel = param => (dispatch) => {
  dispatch({
    'type': SET_UPDATE_LABEL_STATE,
    'payload': param,
  });
};


export { deleteLabel, updateLabel, fetchLabelsForLabels, setUpdateLabel, setDeleteLabel };
