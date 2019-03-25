import { Map } from 'immutable';
import { pick, isEmpty } from 'lodash';
import { createSelector } from 'reselect';
import { objectToArray } from 'lib/decorators';
import moment from 'moment';

import { dateFormats, zeppelinConfig, behaviours } from 'config';

import Tags from '../classes/tags.class';
import { tagsFromState } from './malicious-activity.selectors';
import { sortClusterBy } from './ui.selectors';

export const relationsRedux = state => state.raw.get('relations').get('items');
export const selectedClusterId = state => state.raw.getIn(['relations', 'selected']);

/**
 * Get the relations(object) from state and transform them to array. After that
 * pick up only the specificed keys
 *
 * @return Array of relations containing only ['central_entity', 'cluster_id', 'day_ts']
 */
export const selectCluster = createSelector(
  relationsRedux,
  sortClusterBy,
  (relations, sortValue) => {
    let sortFunc = () => 0;
    switch (sortValue) {
      case 'newest':
        sortFunc = (first, second) => {
          const firstDate = new Date(first.day_ts);
          const secondDate = new Date(second.day_ts);

          return firstDate - secondDate;
        };
        break;

      case 'oldest':
        sortFunc = (first, second) => {
          const firstDate = new Date(first.day_ts);
          const secondDate = new Date(second.day_ts);

          return (firstDate - secondDate) * -1;
        };
        break;

      default:
        sortFunc = (first, second) => {
          const firstCounts = first.counts;
          const secondCounts = second.counts;

          if (firstCounts.malicious || secondCounts.malicious) {
            const firstMalicious = parseInt(firstCounts.malicious, 10) || 0;
            const secondMalicious = parseInt(secondCounts.malicious, 10) || 0;
            return (firstMalicious - secondMalicious) * -1;
          } else if (firstCounts.suspicious || secondCounts.suspicious) {
            const firstSuspicious = parseInt(firstCounts.suspicious, 10) || 0;
            const secondSuspicious = parseInt(secondCounts.suspicious, 10) || 0;
            return (firstSuspicious - secondSuspicious) * -1;
          }

          return (firstCounts.unknown - secondCounts.unknown) * -1;
        };
        break;
    }
    return objectToArray(relations.toJS())
      .sort(sortFunc)
      .map((el) => {
        const items = pick(el, ['central_entity', 'cluster_id', 'ts', 'counts', 'cluster_entities', 'cluster_relations', 'pipeline', 'seed_type', 'tag_id']);
        return {
          ...items,
          'ts_moment': moment.utc(items.ts),
          'ts_formatted': moment.utc(items.ts).format('MM - DD - YYYY'),
        };
      });
  },
);

/**
 *  Search the clusterId in relations and return the cluster, if found.
 *  Otherwise return an empty object.
 *
 * @param {Object} state        Redux state
 * @param {String} clusterId    String
 * @return {Object}             Cluster object
 */
export const clusterById = (state, clusterId) => {
  const relations = state.raw
    .get('relations')
    .get('items')
    .findEntry(item => item.get('cluster_id') === clusterId);

  if (Array.isArray(relations)) {
    if (Map.isMap(relations[1])) {
      return relations[1].toJS();
    }
  }

  return {};
};


/**
 * Get the selected cluster from relations, if there is any selected.
 *
 * @return {Object}
 */
export const getSelectedCluster = createSelector(
  relationsRedux,
  selectedClusterId,
  (relations, clusterId) => {
    if (clusterId !== '') {
      if (Map.isMap(relations.get(clusterId))) {
        return relations.get(clusterId).toJS();
      }
    }
    return {};
  },
);

/**
 * Decorate the cluster entities with threat tactic name and the date as Moment
 *
 * @return {Object}
 */
export const clusterPredictions = createSelector(
  getSelectedCluster,
  tagsFromState,
  (cluster, tags) => {
    const tagsInstance = new Tags(tags);

    if (Object.keys(cluster).includes('cluster_entities')) {
      return Object.keys(cluster.cluster_entities)
        .map(key => cluster.cluster_entities[key])
        .map(entity => ({
          ...entity,
          /**
           * From https://patternex.atlassian.net/browse/BYUI-533, entity threat tactic
           * should be "" if the autocorrelated behavior is not MALICIOUS.
           */
          'threat': entity.ac_behavior === behaviours.MALICIOUS ? tagsInstance.getTagById(entity.tag_id).name : '',
          'score': entity.ac_behavior === behaviours.MALICIOUS ? entity.ac_score : '',
          'momentDay': moment.utc(entity.ts).format(dateFormats.us),
          'start_time': entity.first_ts,
          'end_time': entity.last_ts,
          'handlers': {
            'onConfirm': () => {},
            'onDeny': () => {},
          },
        }));
    }

    return [];
  },
);

/**
 *  Filter predictions by entity name
 *
 * @param {Object} state    Redux state
 * @param {String} entity   Entity to be looked for
 * @return {Object}         Prediction model
 */
export const predictionByEntityName = (state, entity = '') => {
  const predictions = clusterPredictions(state);
  const filteredArr = predictions.filter(prediction =>
    Object.keys(prediction).includes('entity_name') &&
    prediction.entity_name.toLowerCase() === entity.toLowerCase());

  return filteredArr.length > 0 ? filteredArr[0] : {};
};

/**
 * Decorate the labeled entities with threat tactic name and the date as Moment
 *
 * @return {Object}
 */
export const clusterLabels = createSelector(
  getSelectedCluster,
  tagsFromState,
  (cluster, tags) => {
    const tagsInstance = new Tags(tags);
    const isTagConfirmed = (predicted, labeled) => {
      if (typeof predicted === 'object' && Object.keys(predicted).length > 0) {
        return predicted[Object.keys(predicted)[0]] === labeled;
      }

      return false;
    };

    if (Object.keys(cluster).includes('labels')) {
      return Object.keys(cluster.labels)
        .map(key => cluster.labels[key])
        .map(entity => ({
          ...entity,
          'threat': tagsInstance.getTagById(entity.tag_id).name,
          'momentDay': moment.utc(entity.update_time).format(dateFormats.us),
          'action': isTagConfirmed(entity.predicted_tag_id, entity.tag_id),
        }));
    }

    return [];
  },
);


/**
 * Create a Map with types { type -> index }
 * @param {Array} types config array with mapping
 * @return {Map}
 */
export const createEntityTypeGroup = (types = zeppelinConfig.entityTypesGroups) => types.reduce(
  (acc, type, index) => acc.set(type, index),
  new Map(),
);

/**
 * Check if 'relation' array can be found in array of relations 'predictedEdges'
 * @param {Array} relation (array with 2 elements)
 * @param {Array} tag (array of arrays)
 * @return {Bool}
 */
export const foundLink = (relation, predictedEdges) => {
  let relationIsPredicted = false;
  predictedEdges.forEach((edge) => {
    if ((edge[0] === relation[0] && edge[1] === relation[1]) ||
      (edge[1] === relation[0] && edge[0] === relation[1])) {
      relationIsPredicted = true;
    }
  });
  return relationIsPredicted;
};

/**
 * Build the normal spider graph
 *
 * In the normal spider graph we will get only the links and nodes related to central_entity
 *
 * @example
 * {
 *  'nodes': [{
 *     'behavior': 'Unknown',
 *     'id': '10.41.177.57',
 *     'group': 0,
 *     'entity_name': '10.41.177.57',
 *  }],
 *   'links': [{
 *     'source': '10.41.177.57',
 *     'target': '10.41.177.99',
 *     'value': 1,
 *     'isPredicted': false,
 *   }]
 * }
 */

export const clusterToDefaultSpider = createSelector(
  getSelectedCluster,
  (cluster) => {
    const output = {
      'nodes': [],
      'links': [],
    };
    const groupMap = createEntityTypeGroup();
    const trimEntityName = str => (str.indexOf('/?') >= 0
      ? `${str.slice(0, str.indexOf('\\/?'))}?...`
      : str);
    const itemHasLink = (id, links) => {
      let boolOutput = false;
      let itr = 0;

      while (boolOutput === false && itr < links.length) {
        if (links[itr]
          && Object.keys(links[itr]).includes('source')
          && Object.keys(links[itr]).includes('target')
        ) {
          if (links[itr].source === id || links[itr].target === id) {
            boolOutput = true;
          }
        }
        itr += 1;
      }

      return boolOutput;
    };

    const hasPredictedLinks = Object.keys(cluster).includes('predicted_edges')
      && cluster.predicted_edges && cluster.predicted_edges.length > 0;

    if (Object.keys(cluster).includes('cluster_relations')) {
      output.links = cluster.cluster_relations
        .filter(relation => relation.includes(cluster.central_entity))
        .filter(relation => (
          Object.keys(cluster.cluster_entities).includes(relation[0])
          && Object.keys(cluster.cluster_entities).includes(relation[1])
        ))
        .map((relation) => {
          const relationIsPredicted = hasPredictedLinks
            ? foundLink(relation, cluster.predicted_edges)
            : false;

          return {
            'source': relation[0],
            'target': relation[1],
            'value': 1,
            'isPredicted': relationIsPredicted,
          };
        });
    }

    if (Object.keys(cluster).includes('cluster_entities')) {
      output.nodes = Object.keys(cluster.cluster_entities)
        .map(key => ({
          'behavior': cluster.cluster_entities[key].behavior,
          'id': cluster.cluster_entities[key].entity_name,
          'group': groupMap.get(cluster.cluster_entities[key].entity_type),
          'entity_name': trimEntityName(key),
          'is_central_entity': key === cluster.central_entity,
        }))
        .filter(el => itemHasLink(el.id, output.links));
    }

    return output;
  },
);


/**
 * Build data for expanded Spider
 *
 * @return {Object}
 *
 * @example
 * {
 *  'nodes': [{
 *     'behavior': 'Unknown',
 *     'id': '10.41.177.57',
 *     'group': 0,
 *     'entity_name': '10.41.177.57',
 *  }],
 *   'links': [{
 *     'source': '10.41.177.57',
 *     'target': '10.41.177.99',
 *     'value': 1,
 *     'isPredicted': false,
 *   }]
 * }
 */
export const clusterToExpandSpider = createSelector(
  getSelectedCluster,
  (cluster) => {
    const output = {
      'nodes': [],
      'links': [],
    };
    const groupMap = createEntityTypeGroup();
    const trimEntityName = str => (str.indexOf('/?') >= 0
      ? `${str.slice(0, str.indexOf('\\/?'))}?...`
      : str);

    const itemHasLink = (id, links) => {
      let boolOutput = false;
      let itr = 0;

      while (boolOutput === false && itr < links.length) {
        if (links[itr]
          && Object.keys(links[itr]).includes('source')
          && Object.keys(links[itr]).includes('target')
        ) {
          if (links[itr].source === id || links[itr].target === id) {
            boolOutput = true;
          }
        }
        itr += 1;
      }

      return boolOutput;
    };

    const hasPredictedLinks = Object.keys(cluster).includes('predicted_edges')
       && cluster.predicted_edges && cluster.predicted_edges.length > 0;

    if (Object.keys(cluster).includes('cluster_relations')) {
      output.links = cluster.cluster_relations
        .filter(relation => (
          Object.keys(cluster.cluster_entities).includes(relation[0])
          && Object.keys(cluster.cluster_entities).includes(relation[1])
        ))
        .map((relation) => {
          const relationIsPredicted = hasPredictedLinks
            ? foundLink(relation, cluster.predicted_edges)
            : false;

          return {
            'source': relation[0],
            'target': relation[1],
            'value': 1,
            'isPredicted': relationIsPredicted,
          };
        });
    }

    if (Object.keys(cluster).includes('cluster_entities')) {
      output.nodes = Object.keys(cluster.cluster_entities)
        .map(key => ({
          'behavior': cluster.cluster_entities[key].ac_behavior || cluster.cluster_entities[key].behavior,
          'id': cluster.cluster_entities[key].entity_name,
          'group': groupMap.get(cluster.cluster_entities[key].entity_type),
          'entity_name': trimEntityName(key),
          'is_central_entity': key === cluster.central_entity,
        }))
        .filter(el => itemHasLink(el.id, output.links));
    }

    return output;
  },
);

const clusterFilters = state => state.raw.toJS().relations.filters;

/**
 * Function to tell whether any filter (timeline filter/ heatmap filter)
 * is active on dashboard or not
 */
export const isClustersListFiltered = createSelector(
  clusterFilters,
  (filters) => {
    let listIsFiltered = false;

    Object.keys(filters).map((key) => {
      if (!isEmpty(filters[key])) {
        listIsFiltered = true;
      }
      return key;
    });

    return listIsFiltered;
  },
);
