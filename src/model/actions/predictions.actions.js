import moment from 'moment';
import ptrxREST from 'lib/rest';
// import { fetchLabels } from './rest.actions';
import { tagsSelector } from '../selectors';

export const SET_PREDICTION = '@prediction/SET_PREDICTION';
export const SET_PREDICTION_FAILED = '@prediction/SET_PREDICTION_FAILED';

const getTagIdByName = (tags, id) =>
  tags.filter(el => el.name.toLowerCase() === id.toLowerCase());

/**
 * Make a POST to /labels to confirm/deny a prediction.
 *
 * If you confirm a prediction, "confirm" param will be true and we will send the
 * entity's threat_tactic tag ID.
 *
 * If you deny a prediction, "confirm" param will be false and we will send the
 * 'benign' tag ID.
 *
 * @param {Object} entity       Entity object
 * @param {String} prediction   Prediction
 * @param {Boolean} confirm     Confirm or Deny action
 */
export const postPrediction = (entity, prediction, confirm = true) =>
  async (dispatch, getState) => {
    const tags = tagsSelector(getState());
    const tagName = confirm ? prediction : 'benign';
    try {
      const data = {
        'tag_id': getTagIdByName(tags, tagName)[0].id,
        'entity_name': entity.entity_name,
        'entity_type': entity.entity_type,
        'pipeline': entity.pipeline,
        'predicted_tag_id': getTagIdByName(tags, prediction)[0].id,
        'time_start': moment.utc(entity.first_ts).format('X'),
        'time_end': moment.utc(entity.last_ts).format('X'),
        'weight': Object.keys(entity).includes('weight') ? entity.weight : 1,
        'description': Object.keys(entity).includes('description') ? entity.description : '',
        'status': 'active',
      };

      const response = await ptrxREST.post('labels', data);
      if (response.status === 200) {
        // dispatch(fetchLabels());
      }
    } catch (error) {
      throw (error);
    }
    return null;
  };

export const inspectZepplin = entity => (dispatch, getState) => {
  const relations = getState().data.relations.toJS().items;
  let cluster = relations.filter((relation => relation.cluster_entities.includes(entity)));
  if (cluster.length > 0) {
    cluster = cluster[0];
  }

  window.location = `${window.location.origin}/analytics/#/notebook/Autocorrelate?cluster=${cluster.cluster_id}&pipeline=${cluster.pipeline}&date=${moment(cluster.day_ts).format('YYYY-MM-DD')}&central=${cluster.central_entity}`;
};
