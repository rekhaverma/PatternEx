import { Map } from 'immutable';
import { arrayToObject } from 'lib/decorators';
import { ENVS } from 'config';

import { isEmpty, isEqual } from 'lodash';

import Cluster from '../classes/cluster.class';
import { clusterById, selectedClusterId } from '../selectors/relations.selectors';

export const FETCH_RELATIONS = '@@rest/FETCH_RELATIONS';
export const FETCH_RELATIONS_COMPLETE = '@@rest/FETCH_RELATIONS_COMPLETE';
export const FETCH_RELATIONS_FAILED = '@@rest/FETCH_RELATIONS_FAILED';

export const FETCH_ENTITIES = '@@rest/FETCH_ENTITIES';
export const FETCH_ENTITIES_COMPLETE = '@@rest/FETCH_ENTITIES_COMPLETE';
export const FETCH_ENTITIES_FAILED = '@@rest/FETCH_ENTITIES_FAILED';

export const FETCH_LABELS = '@@rest/FETCH_LABELS';
export const FETCH_LABELS_COMPLETE = '@@rest/FETCH_LABELS_COMPLETE';
export const FETCH_LABELS_FAILED = '@@rest/FETCH_LABELS_FAILED';

export const ADD_ENTITIES = '@@relations/ADD_ENTITIES';
export const ADD_LABELS = '@@relations/ADD_LABELS';
export const SET_ENTITY_AUTOCORRELATED = '@@relations/SET_ENTITY_AUTOCORRELATED';
export const SET_SELECTED_CLUSTER = '@@relations/SET_SELECTED_CLUSTER';

export const SET_CLUSTER_FILTER = '@@relations/SET_CLUSTER_FILTER';
export const RESET_CLUSTER_FILTERS = '@@relations/RESET_CLUSTER_FILTERS';
export const SAVE_DASHBOARD_LINK = '@@relations/SAVE_DASHBOARD_LINK';
export const RESET_DASHBOARD_LINK = '@@relations/RESET_DASHBOARD_LINK';

/**
 * Decide if we should fetch the entities for given cluster.
 * The decision is either the cluster_entities's items are empty or not.
 *
 * @example For the cluster.cluster_entities below, the output will be true.
 *  {
 *    10.41.102.41: {},
 *    52.84.7.67: {},
 *  }
 *
 * @param {Immutable.Map} cluster
 * @return {Boolean}
 */
const shouldFetchEntitiesForCluster = (cluster) => {
  const entities = cluster.get('cluster_entities').values();
  while (entities.next().done === false) {
    const next = entities.next();
    if (Map.isMap(next.value) && next.value.isEmpty()) {
      return true;
    }
  }
  return false;
};

export const fetchLabelsForCluster = (clusterEntities, clusterId) => async (dispatch) => {
  if (Object.keys(clusterEntities).length === 0) {
    return;
  }
  dispatch({ 'type': FETCH_LABELS });
  try {
    const response = await Cluster.fetchLabelsInCluster(clusterEntities);
    dispatch({ 'type': FETCH_LABELS_COMPLETE });

    if (Object.keys(response).includes('items') && response.items.length > 0) {
      const entitiesObj = arrayToObject(response.items, 'id');
      dispatch({
        'type': ADD_LABELS,
        'payload': {
          'id': clusterId,
          'labels': entitiesObj,
        },
      });
    } else if (process.env.NODE_ENV === ENVS.DEV) {
      const mockData = [{
        'status': 'inactive',
        'pipeline': 'sipdip',
        'weight': 5,
        'time_start': 'Sun, 15 Oct 2017 00:00:00 -0000',
        'score': null,
        'entity_name': '43.227.226.26 203.117.143.17',
        'entity_type': 'sipdip',
        'predicted_tag_id': {
          '2017-08-20-Classifier-SipDip-1': '939b67c3-c3e0-4dd4-999b-07768adc3916',
        },
        'time_end': 'Sun, 15 Oct 2017 18:29:00 -0000',
        'tag_id': '5378cfb2-ec24-11e5-b373-2c600c7f6a54',
        'update_time': 'Wed, 18 Oct 2017 06:29:41 -0000',
        'source': {
          '2017-08-20-Classifier-SipDip-1': 'undetermined',
        },
        'alert_id': null,
        'href': '/api/v0.2/labels/6d6831f9-41c9-423b-b527-9cbaf9e439a0',
        'create_time': 'Tue, 17 Oct 2017 10:46:44 -0000',
        'outcome': {
          '2017-08-20-Classifier-SipDip-1': 'undetermined',
        },
        'type': 'local',
        'id': '6d6831f9-41c9-423b-b527-9cbaf9e439a0',
        'description': 'abcd',
      }];
      const entitiesObj = arrayToObject(mockData, 'id');
      dispatch({
        'type': ADD_LABELS,
        'payload': {
          'id': clusterId,
          'labels': entitiesObj,
        },
      });
    }
  } catch (error) {
    dispatch({ 'type': FETCH_LABELS_FAILED });
    throw error;
  }
};

export const fetchEntitiesForCluster = (clusterId, day, clusterEntities, centralEntity) =>
  async (dispatch, getState) => {
    const clusterInfo = getState().raw
      .get('relations')
      .get('items')
      .findEntry(item => item.get('cluster_id') === clusterId);

    const isLoadingAlready = getState().raw.toJS().loadStatus.isLoading.includes(FETCH_ENTITIES);

    if (isLoadingAlready ||
      (clusterInfo !== undefined && !shouldFetchEntitiesForCluster(clusterInfo[1]))) {
      return;
    }

    try {
      dispatch({ 'type': FETCH_ENTITIES });
      const entitiesInCluster = await Cluster.fetchEntitiesInCluster(day, clusterId);
      const updateCentralEntity = el => ({
        ...el,
        'is_central_entity': el.entity_name === centralEntity,
      });
      const entitiesObj = arrayToObject(entitiesInCluster.map(updateCentralEntity), 'entity_name');

      dispatch({ 'type': FETCH_ENTITIES_COMPLETE });
      // For the cluster with <ID> transform the 'cluster_entities' from an array of entities to
      // actual entites object.
      dispatch({
        'type': ADD_ENTITIES,
        'payload': {
          'id': clusterId,
          'cluster_entities': entitiesObj,
        },
      });
      dispatch(fetchLabelsForCluster(entitiesObj, clusterId));
    } catch (error) {
      dispatch({ 'type': FETCH_ENTITIES_FAILED });
      throw error;
    }
  };


/**
 * Set the active cluster ID
 *
 * @param {String} clusterId
 */
export const setSelectedCluster = (clusterId = '') => (dispatch, getState) => {
  if (clusterId === '') {
    dispatch({
      'type': SET_SELECTED_CLUSTER,
      'payload': '',
    });
    return;
  }

  const nextCluster = clusterById(getState(), clusterId);

  if (!isEmpty(nextCluster)) {
    dispatch(fetchEntitiesForCluster(
      nextCluster.cluster_id,
      nextCluster.ts,
      Object.keys(nextCluster.cluster_entities),
      nextCluster.central_entity,
    ));
  }
  dispatch({
    'type': SET_SELECTED_CLUSTER,
    'payload': clusterId,
  });
};

/**
 * @todo Robert - Implement shouldFetchRelations
 * @todo Robert - Sort relations by severity by default (blocked by BYUI-178)
 *
 * Fetch all relations in range and, if we have any, fetch the
 * entities for first relation in list and update the cluster_entities of that
 * cluster.
 *
 * @param {Moment} start    Start time
 * @param {Moment} end      End time
 */
export const fetchClusterRelations = (start, end) => async (dispatch, getState) => {
  dispatch({ 'type': FETCH_RELATIONS });
  try {
    const relations = await Cluster.fetchRelations(start, end);

    // Save the relations as object { cluster_id: cluster }
    dispatch({
      'type': FETCH_RELATIONS_COMPLETE,
      'payload': {
        'startDate': relations.start_time,
        'endDate': relations.end_time,
        'items': arrayToObject(relations.items, 'cluster_id'),
      },
    });
    if (relations.items.length > 0) {
      const selectedCluster = relations.items[0];
      const currentSelectedCluster = selectedClusterId(getState());

      if (currentSelectedCluster !== '' && Object.keys(clusterById(getState(), currentSelectedCluster) > 0)) {
        dispatch(setSelectedCluster(currentSelectedCluster));
      } else if (Object.keys(selectedCluster).length > 0) {
        dispatch(setSelectedCluster(relations.items[0].cluster_id));
      }
    }
  } catch (error) {
    dispatch({ 'type': FETCH_RELATIONS_FAILED });
    throw error;
  }
};

export const setEntityAutocorrelated = (clusterId, entityName) => ({
  'type': SET_ENTITY_AUTOCORRELATED,
  'payload': {
    clusterId,
    entityName,
  },
});

export const setClusterFilter = (filter, value) => (dispatch, getState) => {
  const currentValue = getState().raw.get('relations').get('filters').get(filter);

  if (isEqual(currentValue, value)) {
    dispatch({
      'type': SET_CLUSTER_FILTER,
      'payload': {
        filter,
        'value': filter === 'active' ? {} : '',
      },
    });
  } else {
    dispatch({
      'type': SET_CLUSTER_FILTER,
      'payload': { filter, value },
    });
  }
};

export const saveDasboardLink = location => ({
  'type': SAVE_DASHBOARD_LINK,
  'payload': `${location.pathname}${location.search}`,
});

export const resetDashboardLink = () => ({
  'type': RESET_DASHBOARD_LINK,
});

export const resetClusterFilters = () => ({
  type: RESET_CLUSTER_FILTERS,
});
