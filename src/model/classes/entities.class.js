import moment from 'moment';
import { isEqual, pick } from 'lodash';
import Tags from './tags.model';

export default class Entities {
  /**
   * Decorate the entity as a prediction
   *
   * @static
   * @param {Object} entity
   * @returns {Object}
   * @memberof Entities
   */
  static entityToPrediction(entity) {
    return {
      ...pick(entity, ['entity_name', 'behavior', 'pipeline', 'first_ts', 'last_ts']),
      'tags': entity.is_central_entity ? [entity.pipeline, 'main'] : [entity.pipeline],
      'timestamp': moment(entity.behavior_ts).format('DD/MM/YY HH:mma'),
      'predictions': entity.threat_tactic !== null ? [entity.threat_tactic] : [],
    };
  }

  constructor(entities = [], labels = [], tags = []) {
    this.entities = entities;
    this.labels = labels;
    this.tags = new Tags(tags);
  }

  /**
   * Concat entities with their predictions
   *
   * @returns {Array}
   * @memberof Entities
   */
  get allPredictions() {
    return this.entities.map((entity) => {
      const labelsForEntity = this.findEntityLabels(entity);

      if (labelsForEntity.length > 0) {
        const tag = this.tags.getTagById(labelsForEntity[0].tag_id)[0];
        return {
          ...entity,
          'predictionWas': entity.threat_tactic.toLowerCase() === tag.name.toLowerCase(),
          'label': labelsForEntity,
        };
      }

      return entity;
    });
  }

  /**
   * Get only the unlabeled predictions
   *
   * @readonly
   * @memberof Entities
   */
  get unlabeledPredictions() {
    return this.entities.filter((entity) => {
      const labelsForEntity = this.findEntityLabels(entity);
      return !(labelsForEntity.length > 0);
    });
  }

  /**
   * Get only the labeled predictions
   *
   * @readonly
   * @memberof Entities
   */
  get labeledPredictions() {
    return this.allPredictions.reduce((acc, entity) => {
      if (Object.keys(entity).includes('label')) {
        return acc.concat({
          ...Entities.entityToPrediction(entity),
          'predictionWas': entity.predictionWas,
          'timestamp': moment(entity.label.create_time).format('DD/MM/YY HH:mma'),
        });
      }

      return acc;
    }, []);
  }

  /**
   * Filter entities by whatever property
   *
   * @param {String} prop
   * @param {any} value
   * @returns {Array}   Filtered entities
   * @memberof Entities
   */
  findEntitiesByProperty(prop, value) {
    return this.entities.filter((el) => {
      if (Object.keys(el).includes(prop)) {
        return isEqual(el[prop], value);
      }
      return false;
    });
  }

  /**
   * Find labels for that entity by checking the entity_name and
   * predictedTag
   *
   * @param {Object} entity
   * @returns {Array}
   * @memberof Entities
   */
  findEntityLabels(entity) {
    return this.labels.filter((label) => {
      const predictedTag = this.tags.getTagById(label.predicted_tag_id)[0];
      return entity.entity_name === label.entity_name
        && entity.threat_tactic.toLowerCase() === predictedTag.name.toLowerCase();
    });
  }
}
