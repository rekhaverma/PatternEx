import ptrxREST from 'lib/rest/index';
import { createURL } from 'lib';
import entityNameFromPipeline from 'lib/decorators/entity-name-from-pipeline';
import { ENVS } from 'config';

import evpActions from '../actions';
import { addNotification } from '../../ui.actions';
import { domainInfoMock } from '../../mockData';

/**
 * @param data
 * @returns {{type: string, payload: *}}
 */
const setEntityInfoData = data => ({ 'type': evpActions.GET_ENTITY_INFO, 'payload': data });

/**
 * @param params
 * @returns {*}
 */
const buildEntityInfoUrl = (params) => {
  const entityData = entityNameFromPipeline(params);
  let query = {};

  if (entityData.domain && entityData.srcip) {
    query = {
      ip: entityData.srcip,
      domain: entityData.domain,
    };
  } else if (entityData.domain && !entityData.srcip) {
    query = {
      domain: entityData.domain,
    };
  } else if (!entityData.domain && entityData.srcip) {
    query = {
      ip: entityData.srcip,
    };
  } else {
    return false;
  }

  return createURL('entity/info', query);
};

/**
 * @param params
 * @returns {Function}
 */
export const getEntityInfo = params => async (dispatch) => {
  if (process.env.NODE_ENV === ENVS.DEV) {
    return dispatch(setEntityInfoData(domainInfoMock));
  }

  let payload = [];

  try {
    const url = buildEntityInfoUrl(params);
    if (!url) {
      return dispatch(addNotification('error', 'Unable to get domain information.\n Please contact admin'));
    }
    const response = await ptrxREST.get(url);
    payload = response.data;
  } catch (error) {
    // @todo find a way to handle errors
  }

  return dispatch(setEntityInfoData(payload || []));
};
