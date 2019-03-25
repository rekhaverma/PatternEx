import moment from 'moment';

import ptrxREST from 'lib/rest/index';
import { createURL } from 'lib';
import { dateFormats } from 'config';

import evpActions from '../actions';

/**
 * @returns {{type: string}}
 */
const fetchClusterRelations = () => ({
  'type': evpActions.FETCH_CLUSTER_RELATIONS,
});

/**
 * @param data
 * @returns {{type: string, payload: *}}
 */
const setClusterRelations = data => ({
  'type': evpActions.SET_CLUSTER_RELATIONS,
  'payload': data,
});

/**
 * @param params
 * @returns {string}
 */
const buildClusterRelationsUrl = (params) => {
  const query = {
    entity_name: params.entity_name,
    end_time: moment.utc(params.end_time, dateFormats.mmddyyDash).add(2, 'hours').startOf('day').unix(),
  };

  return createURL('cluster_relations', query);
};

/**
 * @param entitiesDate
 * @param id
 * @returns {string}
 */
const buildClusterEntitiesUrl = (entitiesDate, id) => {
  const query = {
    cluster_id: id,
  };

  return createURL(`/cluster_entities/${entitiesDate}`, query);
};

/**
 * @param params
 * @returns {function(*): *}
 */
export const getClusterRelations = params => async (dispatch) => {
  dispatch(fetchClusterRelations());
  const payload = {
    clusterDetails: [],
    clusterEntities: [],
  };

  try {
    const response = await ptrxREST.get(buildClusterRelationsUrl(params));
    const items = response.data.items;

    let entitiesDate;
    if (items.length > 0 && Object.keys(items[0]).includes('day_ts')) {
      entitiesDate = moment.utc(items[0].day_ts).format(dateFormats.apiSendFormat);
    } else {
      entitiesDate = moment.utc(params.end_time, dateFormats.mmddyyDash).add(2, 'hours').startOf('day').format(dateFormats.apiSendFormat);
    }
    const id = items.length > 0 ? items[0].cluster_id : '';
    const entities = await ptrxREST.get(buildClusterEntitiesUrl(entitiesDate, id));

    payload.clusterDetails = items[0] || [];
    payload.clusterEntities = entities.data.items || [];
  } catch (error) {
    // @todo: find a way to handle errors
  }

  return dispatch(setClusterRelations(payload));
};
