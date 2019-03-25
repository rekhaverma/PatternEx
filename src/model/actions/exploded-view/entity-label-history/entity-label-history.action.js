import ptrxREST from 'lib/rest/index';
import { createURL } from 'lib';
import getEntityTypeByPipeline from 'lib/decorators/pipeline-to-entity-type';

import evpActions from '../actions';

/**
 * @returns {{type: string}}
 */
const fetchEntityLabelHistory = () => ({
  type: evpActions.FETCH_LABELS_HISTORY,
});

/**
 * @param data
 * @returns {{type: string, payload: *}}
 */
const setEntityLabelHistory = data => ({
  'type': evpActions.SET_LABELS_HISTORY,
  'payload': data,
});

/**
 * @param params
 * @returns {string}
 */
const buildEntityLabelHistoryUrl = (params) => {
  const query = {
    entity_name: params.entity_name,
    entity_type: getEntityTypeByPipeline(params.pipeline),
    pipeline: params.pipeline,
  };

  return createURL('labels', query);
};

/**
 * @param params
 * @returns {function(*): *}
 */
export const getEntityLabelHistory = params => async (dispatch) => {
  dispatch(fetchEntityLabelHistory());
  let payload = [];

  try {
    const response = await ptrxREST.get(buildEntityLabelHistoryUrl(params));
    payload = response.data.items || [];
  } catch (error) {
    // @todo: Find a way to handle errors
  }

  return dispatch(setEntityLabelHistory(payload));
};
