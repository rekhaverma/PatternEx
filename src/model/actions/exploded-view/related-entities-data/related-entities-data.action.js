import moment from 'moment';

import { dateFormats } from 'config';
import ptrxREST from 'lib/rest/index';
import { createURL } from 'lib';
import getEntityTypeByPipeline from 'lib/decorators/pipeline-to-entity-type';
import getRelationFromPipeline from 'lib/decorators/relation-from-pipeline';

import evpActions from '../actions';

/**
 * @returns {{type: string}}
 */
const fetchRelatedEntitiesData = () => ({ 'type': evpActions.FETCH_RELATED_ENTITIES_DATA });

/**
 * @param data
 * @returns {{type: string, payload: *}}
 */
const setRelatedEntitiesData = data => ({ 'type': evpActions.SET_RELATED_ENTITIES_DATA, 'payload': data });

/**
 * @param params
 * @returns {string}
 */
const buildRelatedEntitiesUrl = (params) => {
  const relationData = getRelationFromPipeline({
    pipeline: params.pipeline,
    entityName: params.entity_name.split(' ')[0],
    entityType: getEntityTypeByPipeline(params.pipeline),
  });
  const query = {
    entity_name: relationData.entityName,
    entity_type: relationData.entityType,
    related_type: relationData.relatedType,
    relation: relationData.relation,
    time_start: moment(params.start_time, dateFormats.mmddyyDash).startOf('day').subtract(1, 'days').unix(),
    time_end: moment(params.end_time, dateFormats.mmddyyDash).endOf('day').unix(),
  };

  return createURL('relatedentity', query);
};

/**
 * @param params
 * @returns {function(*): *}
 */
export const getRelatedEntitiesData = params => async (dispatch) => {
  dispatch(fetchRelatedEntitiesData());
  let payload = [];

  try {
    const response = await ptrxREST.get(buildRelatedEntitiesUrl(params));
    payload = response.data;
  } catch (error) {
    // @todo find a way to handle errors
  }

  return dispatch(setRelatedEntitiesData(payload || []));
};
