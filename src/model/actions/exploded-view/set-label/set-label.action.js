import moment from 'moment';

import findEntityName from 'lib/decorators/find-entity-name';
import getEntityTypeByPipeline from 'lib/decorators/pipeline-to-entity-type';
import ptrxREST from 'lib/rest';
import { addNotification } from 'model/actions/ui.actions';

import evpActions from '../actions';

const setLabelStart = () => ({ 'type': evpActions.SET_LABEL_START });
const setLabelComplete = () => ({ 'type': evpActions.SET_LABEL_COMPLETE });

export const labelStatus = (predictedTag, tagId) => (predictedTag === tagId ? 'confirmed' : 'rejected');

export const setLabelHandler = (row, behaviourType, callback) => async (dispatch) => {
  dispatch(setLabelStart());

  const data = {
    entity_name: findEntityName(row.pipeline, row),
    entity_type: getEntityTypeByPipeline(row.entity_type),
    pipeline: row.pipeline,
    time_start: moment.utc(row.ts).unix(),
    time_end: moment.utc(row.ts).unix(),
    status: labelStatus(row.predicted_tag_id, row.tag_id),
    tag_id: row.tag_id,
    description: row.description || '',
    weight: row.weight || 1,
  };

  let apiUrl = 'labels';

  if (['malicious', 'suspicious'].indexOf(behaviourType) >= 0) {
    apiUrl = 'maliciousbehavior';
    data.id = row.id;

    if (behaviourType === 'suspicious') {
      apiUrl = 'suspiciousbehavior';
      data.method_name = row.method_name;
    }
  } else {
    data.model = row.model;
    data.model_name = row.model_name;
  }

  try {
    const response = await ptrxREST.put(apiUrl, data);

    dispatch(addNotification('success', 'Set label successfully'));
    if (typeof callback === 'function') {
      callback(response, row.index);
    }
  } catch (error) {
    dispatch(addNotification('error', 'Set label failed.\n Please contact admin'));
  }

  return dispatch(setLabelComplete());
};
