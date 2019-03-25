import ptrxREST from 'lib/rest';
import { createURL } from 'lib';

import { addNotification } from '../ui.actions';

export const FETCH_PIPELINES = '@@rest/FETCH_PIPELINES';
export const FETCH_PIPELINES_COMPLETE = '@@rest/FETCH_PIPELINES_COMPLETE';
export const FETCH_PIPELINES_FAILED = '@@rest/FETCH_PIPELINES_FAILED';

export const FETCH_COLUMN_FORMAT = '@@rest/FETCH_COLUMN_FORMAT';
export const FETCH_COLUMN_FORMAT_COMPLETE = '@@rest/FETCH_COLUMN_FORMAT_COMPLETE';
export const FETCH_COLUMN_FORMAT_FAILED = '@@rest/FETCH_COLUMN_FORMAT_FAILED';

export const FETCH_PIPELINES_MODEL = '@@rest/FETCH_PIPELINES_MODEL';
export const FETCH_PIPELINES_MODEL_COMPLETE = '@@rest/FETCH_PIPELINES_MODEL_COMPLETE';
export const FETCH_PIPELINES_MODEL_FAILED = '@@rest/FETCH_PIPELINES_MODEL_FAILED';
export const FETCH_PIPELINES_MODEL_MORE = '@@rest/FETCH_PIPELINES_MODEL_MORE';
export const RESET_PIPELINES_MODE = '@@rest/RESET_PIPELINES_MODE';

export const UPDATE_PIPELINES_MODEL = '@@rest/UPDATE_PIPELINE_MODEL';

export const UPDATE_PIPELINE_COMPLETED = '@@rest/UPDATE_PIPELINE_COMPLETE';
export const UPDATE_PIPELINE_FAILED = '@@rest/UPDATE_PIPELINE_FAILED';
export const UPDATE_PIPELINE = '@@rest/UPDATE_PIPELINE';
export const RESET_PIPELINES_STATE = '@@rest/RESET_PIPELINES_STATE';


const shouldFetchPipelines = state => Object.keys(state.raw.toJS().pipelines).length === 0
  && !state.raw.toJS().loadStatus.isLoading.includes(FETCH_PIPELINES);

const pipelineMap = {
  'user_access': ['useraccess'],
  'user_activity': ['user'],
  'fw_sipdip': ['sipdip', 'sip', 'dip', 'domain', 'sipdomain'],
  'login_activity': ['hpa', 'request'],
};

export const fetchPipelines = fetchForcefully => async (dispatch, getState) => {
  const state = getState();
  const costumerId = state.raw.toJS().systemInfo.customer_id;

  if (shouldFetchPipelines(state) && costumerId && costumerId !== '') {
    try {
      dispatch({
        'type': FETCH_PIPELINES,
      });
      const pipelines = {};
      const response = await ptrxREST.get(`systeminfo/pipelines?customer_id=${costumerId}`);
      const data = response.data.pipelines;

      Object.keys(data).forEach((pipe) => {
        if (Object.keys(pipelineMap).includes(pipe)) {
          pipelineMap[pipe].forEach(key => pipelines[key] = data[pipe]);
        }
      });

      dispatch({
        'type': FETCH_PIPELINES_COMPLETE,
        'payload': pipelines,
      });
      // resets the state of the update pipelines after forcefully fetching pipelines
      if (fetchForcefully) {
        dispatch({
          'type': RESET_PIPELINES_STATE,
        });
      }
    } catch (error) {
      dispatch(addNotification('error', 'Fetch piplines failed'));
      dispatch({ 'type': FETCH_PIPELINES_FAILED });
      throw error;
    }
  } else {
    dispatch(addNotification('error', 'Fetch piplines failed'));
  }
};

export const fetchColumnFormat = pipeline => async (dispatch) => {
  try {
    dispatch({
      'type': FETCH_COLUMN_FORMAT,
    });
    const response = await ptrxREST.get(`${pipeline}/columnformat`);
    dispatch({
      'type': FETCH_COLUMN_FORMAT_COMPLETE,
      'payload': response.data,
    });
  } catch (error) {
    dispatch({
      'type': FETCH_COLUMN_FORMAT_FAILED,
    });
    throw (error);
  }
};

/**
 * Get pipeline specific prediction/Scoring results for the date specified.
 * This is computed at end of day as a batch job
 *
 * Params in URL are:
 *   - {String} pipeline:    [REQUIRED] Selected pipeline (sip, dip, sipdip etc)
 *   - {String} model_type:  [REQUIRED] Selected model type (classifier, ranking)
 *   - {String} model_name:  [REQUIRED] Name of the last trained model (found in resultsummary day)
 *   - {Number} start:       Starting offset for results.
 *   - {Number} limit:       Ending offset for results.
 *
 * @param {Object} date     Moment instance of date
 * @param {Object} params   URL params
 * @example
 *  Example of URL:
 *  /api/v0.2/modelresults/2017-10-09?pipeline=sipdip
 *    &model_type=classifier
 *    &model_name=2017-08-20-Classifier-SipDip-1
 *    &start=0
 *    &limit=100
 */
export const fetchPipelineModel = (date, params) => async (dispatch) => {
  const reqParams = params;

  if (!params.sort_col && !params.sort_dir) {
    reqParams.sort_dir = 'desc';
    switch (params.model_type) {
      case 'ranking':
        reqParams.sort_col = 'score';
        break;
      case 'classifier':
        reqParams.sort_col = 'predicted_prob';
        break;
      default:
        break;
    }
  }

  let baseUrl = createURL('modelresults', reqParams);
  if (date) {
    baseUrl = createURL(`modelresults/${date.format('YYYY-MM-DD')}`, reqParams);
  }

  try {
    dispatch({ 'type': FETCH_PIPELINES_MODEL });
    const response = await ptrxREST.get(baseUrl);
    const { items, totalCount } = response.data;

    dispatch({ 'type': FETCH_PIPELINES_MODEL_COMPLETE, 'payload': { items, totalCount } });
  } catch (error) {
    dispatch({ 'type': FETCH_PIPELINES_MODEL_FAILED });
    throw error;
  }
};

export const fetchPipelineModelMore = (date, params) => async (dispatch, getState) => {
  const totalCount = getState().data.pipelines.get('totalCount');

  if (params.start + params.limit < totalCount) {
    const baseUrl = createURL(`modelresults/${date.format('YYYY-MM-DD')}`, params);

    try {
      const response = await ptrxREST.get(baseUrl);
      const { items } = response.data;

      dispatch({ 'type': FETCH_PIPELINES_MODEL_MORE, 'payload': { items } });
    } catch (error) {
      dispatch({ 'type': FETCH_PIPELINES_MODEL_FAILED });
      throw error;
    }
  }
};

export const updatePipeline = params => async (dispatch) => {
  try {
    dispatch({
      'type': UPDATE_PIPELINE,
    });
    await ptrxREST.put('systeminfo/pipelines', params);
    dispatch({
      'type': UPDATE_PIPELINE_COMPLETED,
    });
    dispatch(addNotification('success', 'Pipeline updated successfully'));
  } catch (error) {
    dispatch({
      'type': UPDATE_PIPELINE_FAILED,
    });
    dispatch(addNotification('error', 'Update pipeline failed'));
    throw (error);
  }
};

export const resetPipeline = () => ({ 'type': RESET_PIPELINES_MODE });
