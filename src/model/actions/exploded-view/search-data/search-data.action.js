import moment from 'moment';

import { dateFormats } from 'config';
import ptrxREST from 'lib/rest/index';
import { createURL } from 'lib';
import getEntityTypeByPipeline from 'lib/decorators/pipeline-to-entity-type';

import evpActions from '../actions';

/**
 * @returns {{type: string}}
 */
const fetchSearchData = () => ({
  'type': evpActions.FETCH_SEARCH_DATA,
});

/**
 * @param data
 * @returns {{type: string, payload: *}}
 */
const setSearchData = data => ({
  'type': evpActions.SET_SEARCH_DATA,
  'payload': data,
});

/**
 * @param data
 * @returns {{type: string, payload: *}}
 */
const setModelName = data => ({ 'type': evpActions.SET_MODEL_NAME, 'payload': data });

/**
 * @param params
 * @returns {string}
 */
const buildSearchUrl = (params) => {
  const query = {
    entity_name: params.entity_name,
    entity_type: getEntityTypeByPipeline(params.pipeline),
    pipeline: params.pipeline,
    time_start: moment.utc(params.start_time, dateFormats.mmddyyDash).unix(),
    time_end: moment.utc(params.end_time, dateFormats.mmddyyDash).endOf('day').unix(),
  };

  if (params.mode) {
    query.mode = params.mode;
  }

  if (params.origin && params.origin === 'pipeline') {
    query.model_type = params.model_type;
    query.model_name = params.model_name;
  }

  return createURL('search', query);
};

/**
 * @param params
 * @returns {function(*): *}
 */
export const getSearchData = params => async (dispatch) => {
  dispatch(fetchSearchData());
  let payload = [];

  try {
    const response = await ptrxREST.get(buildSearchUrl(params));
    payload = response.data.items;
    payload[0].model_name = response.data.model_name;
    dispatch(setModelName(response.data.model_name));
  } catch (error) {
    // @todo find a way to handle errors
  }

  return dispatch(setSearchData(payload || []));
};
