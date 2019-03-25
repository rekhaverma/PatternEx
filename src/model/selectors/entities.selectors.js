import { createSelector } from 'reselect';
import moment from 'moment';
import filterBy from 'lib/filter';
import { entityToPrediction } from 'lib/decorators';

import Tags from 'model/classes/tags.class';

import { tagsSelector } from './tags.selectors';

/**
 * Callback used in entitiesInCluster and labelsInCluster
 *
 * @param {Array} items       Array to be filtered
 * @param {Object} cluster    Cluster object used as ref
 * @returns {Array}
 */
const itemsInCluster = (items, cluster, tags) => {
  const tagsInstance = new Tags(tags);
  if (cluster !== null) {
    return items.filter(el => cluster.cluster_entities.includes(el.entity_name))
      .map((el) => {
        let tag = tagsInstance.getTagById(el.tag_id);

        if (Object.keys(tag).includes('name')) {
          tag = tagsInstance.getTagById(el.tag_id).name;
        } else {
          tag = '';
        }

        return {
          ...el,
          'threat_tactic': '',
        };
      });
  }
  return [];
};

export const filtersSelector = state => state.app.filters.toJS();
export const clusterSelector = state => state.app.ui.get('activeCluster');

export const entitiesSelector = state => state.data.entities.toJS().items;
export const labelsSelector = state => state.data.labels.toJS().items;
export const relationsSelector = state => state.data.relations.toJS().items;

/**
 * Search in relations for active cluster ID
 * @param {Array}     clusters  Returned by relationsSelector
 * @param {String}    id        Returned by clusterSelector, the active cluster ID
 * @returns {Object}            Active cluster object
 */
export const activeCluster = createSelector(
  relationsSelector,
  clusterSelector,
  (clusters, id) => clusters.filter(cluster => cluster.cluster_id === id)[0] || null,
);

/**
 * Select active filters
 * @param {Object}    filtersSelector   Object of filters from state
 * @returns {Array}                     Array with only active filters
 */
export const activeFilters = createSelector(
  filtersSelector,
  filters => Object.keys(filters).filter(key => filters[key] !== null),
);

/**
 * For each entity check if it's in current cluster
 * @param {Array}     entities        Returned by entitiesSelector, raw entities array
 * @param {Object}    cluster         Retured by activeCluster
 * @param {Function}  itemsInCluster  Callback
 * @returns {Array}                   Array containing the entites found in cluster
 */
export const entitiesInCluster = createSelector(
  entitiesSelector,
  activeCluster,
  tagsSelector,
  itemsInCluster,
);
export const labelsInCluster = createSelector(
  labelsSelector,
  activeCluster,
  tagsSelector,
  itemsInCluster,
);

export const concatLabelsWithEntities = createSelector(
  labelsInCluster,
  entitiesInCluster,
  tagsSelector,
  (labels, entities, tags) => {
    const output = [];
    const tagsInstance = new Tags(tags);

    labels.forEach((label) => {
      let index = 0;

      while (index < entities.length) {
        const el = entities[index];
        if (el.entity_name === label.entity_name) {
          const decorated = entityToPrediction(el, false, tagsInstance);
          output.push({
            ...decorated,
            'predictionWas': Object.keys(el).includes('tag_id') ? el.tag_id === label.tag_id : false,
            'timestamp': moment(label.create_time).format('DD/MM/YY HH:mma'),
          });
        }
        index += 1;
      }
    });

    return output;
  },
);

/**
 * Filter unlabeled predictions by checking if the labels array
 * have an element equal with the prediction. Check the comments below
 *
 * @param {Array}   entities  Returned by entitiesInCluster, only entities in active cluster
 * @param {Array}   labels    Returned by labelsSelector, raw labels array
 * @param {Array}   tags      Returned by tagsSelector, raw tags array
 * @return {Array}
 */
export const filterUnlabeledPredictions = createSelector(
  entitiesInCluster,
  labelsSelector,
  (entities, labels) => entities.filter((entity) => {
    let exists = true;
    let index = 0;

    /**
     * While we still have labels or we didn't find the prediction
     * in labels, keep searching for a label equal to prediction
     *
     * A prediction is equal with a label IF:
     *  - both have the same entity
     *
     * E.g.
     *  entity: { 'entity_name': '10.41.178.42', 'threat_tactic': 'delivery' }
     *  label: { 'entity_name': '10.41.178.42',
     *  'tag_id': 'd8b16568-5b2e-4ced-93ed-3fcaa64032e6' }
     *  tag: { 'id': 'd8b16568-5b2e-4ced-93ed-3fcaa64032e6', 'name': 'Delivery' }
     */
    while (index < labels.length && exists !== false) {
      const label = labels[index];

      /**
       * Check the conditions mentioned below
       */
      if (label.entity_name === entity.entity_name) {
        exists = false;
      }

      index += 1;
    }

    return exists;
  }),
);

/**
 * Filter the unlabeled predictions by behavior, domain or other filter
 *
 * @param {Array}   entities
 * @param {Object}  filters
 * @returns {Array}
 */
export const getUnlabeledFilteredPredictions = createSelector(
  filterUnlabeledPredictions,
  filtersSelector,
  (entities, filters) => {
    if (filters.selected) {
      return filterBy(entities, 'entity_name', filters.selected);
    }
    return Object.keys(filters)
      .filter(key => filters[key] !== null)
      .reduce((acc, currValue) => {
        if (currValue === 'query') {
          return filterBy(acc, 'entity_name', filters[currValue], true);
        }
        return filterBy(acc, currValue, filters[currValue]);
      }, entities);
  },
);

export const getRelationsForUnlabeledPredictions = createSelector(
  getUnlabeledFilteredPredictions,
  activeCluster,
  (entities, relations) => {
    if (relations !== null) {
      return relations.cluster_relations.filter((relation) => {
        let exists = false;
        entities.forEach((entity) => {
          if (relation.includes(entity.entity_name)) {
            exists = true;
          }
        });

        return exists;
      });
    }

    return [];
  },
);

export const getUnlabeledPredictions = createSelector(
  getUnlabeledFilteredPredictions,
  tagsSelector,
  (entities, tags) => {
    const tagsInstance = new Tags(tags);
    return entities.map(entity => entityToPrediction(entity, false, tagsInstance));
  },
);

export const getRelationsFromCluster = createSelector(
  getUnlabeledPredictions,
  activeCluster,
  (entities, relations) => {
    if (relations !== null) {
      return relations.cluster_relations.filter((relation) => {
        let exists = false;
        entities.forEach((entity) => {
          if (relation.includes(entity.entity_name)) {
            exists = true;
          }
        });

        return exists;
      });
    }

    return [];
  },
);

/**
 * Selector used to get the total number of unlabeled predictions
 * based on the response of "getUnlabeledPredictions" selector.
 */
export const getNumOfFilteredEntities = createSelector(
  getUnlabeledPredictions,
  entities => entities.length || 0,
);

/**
 * Get the total number of alerts based on their behavior using the
 * raw data from state.data.entities (returned by "entitiesSelector").
 *
 * This selectors applies a reduce() on data and increment the behaviour count
 * on each entity.
 *
 * WORKAROUND:
 *   In the initialValue (Array.prototype.reduce()) we have, harcoded, two properties
 * meaning the counts in page (Malicious and Suspicious). They are hardcoded mainly
 * fbecause the order of importance, because if the first entity has "behavior: suspicious"
 * the first property in the object will be "suspicious".
 *   If we want this to be custom, we should fetch the types of behavior and create the
 * initialValue from that response.
 */
export const getNumOfEntitiesByBehavior = createSelector(
  entitiesSelector,
  entities => entities.reduce((acc, currValue) => {
    const count = acc[currValue.behavior.toLowerCase()] || 0;
    if (currValue.behavior) {
      return {
        ...acc,
        [currValue.behavior.toLowerCase()]: count > 0 ? count + 1 : 1,
      };
    }
    return acc;
  }, { 'malicious': 0, 'suspicious': 0 }),
);

export const getTotalNumberOfEntities = createSelector(
  getNumOfEntitiesByBehavior,
  entities => Object.keys(entities).reduce((acc, currValue) => acc + entities[currValue], 0),
);
