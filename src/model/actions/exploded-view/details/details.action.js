import moment from 'moment';

import ptrxREST from 'lib/rest/index';
import { dateFormats } from 'config';
import { createURL } from 'lib';
import getEntityTypeByPipeline from 'lib/decorators/pipeline-to-entity-type';
import evpActions from '../actions';

/**
 * @returns {{type: string}}
 */
export const fetchDetails = () => ({
  'type': evpActions.GET_DETAILS_DATA,
});

/**
 * @returns {{type: string}}
 */
const setFetchDetailsSuccess = data => ({ 'type': evpActions.SET_DETAILS_DATA, 'payload': data });

/**
 * @param data
 * @returns {{type: string, payload: *}}
 */
export const getFetchDetailsFailed = data => ({ 'type': evpActions.GET_DETAILS_DATA_FAILED, 'payload': data });

/**
 * @param params
 * @returns {string}
 */
const buildUrl = (params) => {
  const query = {
    entity_name: params.entity_name,
    entity_type: getEntityTypeByPipeline(params.pipeline),
    pipeline: params.pipeline,
    start_time: moment.utc(params.start_time, dateFormats.mmddyyDash).unix(),
    end_time: moment.utc(params.end_time, dateFormats.mmddyyDash).endOf('day').unix(),
  };

  if (params.mode) {
    query.mode = params.mode;
  }

  if (params.origin && params.origin === 'pipeline') {
    query.model_type = params.model_type;
    query.model_name = params.model_name;
  }

  return createURL('details', query);
};

/**
 * @param params
 * @returns {Function}
 */
export const getDetailsData = params => async (dispatch) => {
  dispatch(fetchDetails());
  let payload = [];

  try {
    const response = await ptrxREST.get(buildUrl(params));
    payload = response.data.items;
  } catch (error) {
    return dispatch(getFetchDetailsFailed());
  }
  return dispatch(setFetchDetailsSuccess(payload || []));
};
