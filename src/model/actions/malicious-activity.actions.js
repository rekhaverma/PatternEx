import moment from 'moment';
import { isEqual } from 'lodash';
import { routerActions } from 'react-router-redux';
import { createURL } from 'lib';

import ptrxREST, { ptrxRESTFormData } from 'lib/rest';
import getEntityTypeByPipeline from 'lib/decorators/pipeline-to-entity-type';
import findEntityName from 'lib/decorators/find-entity-name';
import { notificationConstants } from 'components/notification/constants';
import Tags from '../classes/tags.class';
import { addNotification } from './ui.actions';
import { UPDATE_PIPELINES_MODEL } from './rest/pipelines.actions';
import { SET_SEARCH_DATA, fetchSearchData, setSearchData, setPipelineEntityData, setModelName } from './exploded-view.actions.js';
import { getEvpUrlHandler } from './exploded-view';

export const RESET_FILTERS = '@@maliciousActivity/RESET_FILTERS';
export const SET_FILTER = '@@maliciousActivity/SET_FILTER';
export const DELETE_LABEL = '@@rest/DELETE_LABEL';
export const DELETE_LABEL_SUCCESS = '@@rest/DELETE_LABEL_SUCCESS';
export const DELETE_LABEL_FAILED = '@@rest/DELETE_LABEL_FAILED';

export const resetFilters = () => ({
  'type': RESET_FILTERS,
});


/**
 * Set {filter}: {value} in maliciousActivity state.
 *
 * If the {value} equals currentValue of {filter}, reset the {filter} to
 * default value (empty string or empty object).
 *
 * @param {String} filter
 * @param {String || Object} value
 */
export const setFilter = (filter, value) => (dispatch, getState) => {
  const currentValue = getState().app.maliciousActivity.get(filter);

  if (isEqual(currentValue, value)) {
    dispatch({
      'type': SET_FILTER,
      'payload': {
        filter,
        'value': filter === 'active' ? {} : '',
      },
    });
  } else {
    dispatch({
      'type': SET_FILTER,
      'payload': { filter, value },
    });
  }
};


/**
 * Delete the labels using label id
 *
 * @param {string} label's id
 * @return {}
 */
export const deleteLabel = (labelId, index) => async (dispatch, getState) => {
  dispatch({
    'type': DELETE_LABEL,
  });

  try {
    const isSearchEntity = getState().raw.toJS().explodedView.searchFired;
    const response = await ptrxREST.delete(`labels/${labelId}`);
    let pipelineWithLabel;
    if (isSearchEntity) {
      pipelineWithLabel = {};
      pipelineWithLabel.items = getState().raw.toJS().explodedView.searchData;
    } else {
      pipelineWithLabel = getState().data.pipelines.toJS();
    }

    pipelineWithLabel.items[index] = {
      ...pipelineWithLabel.items[index],
      'showLoader': true,
    };

    if (isSearchEntity) {
      dispatch({
        'type': SET_SEARCH_DATA,
        'payload': pipelineWithLabel.items,
      });
    } else {
      dispatch({
        'type': UPDATE_PIPELINES_MODEL,
        'payload': pipelineWithLabel,
      });
    }

    if (response.status >= 200 && response.status < 300) {
      pipelineWithLabel.items[index] = {
        ...pipelineWithLabel.items[index],
        'showLoader': false,
        user_tag: {
          'label_id': null,
          'alert': null,
          'description': null,
          'id': null,
          'name': null,
          'severity': null,
          'system_tag': null,
          'type': null,
        },
      };

      if (isSearchEntity) {
        dispatch({
          'type': SET_SEARCH_DATA,
          'payload': pipelineWithLabel.items,
        });
      } else {
        dispatch({
          'type': UPDATE_PIPELINES_MODEL,
          'payload': pipelineWithLabel,
        });
      }
    } else {
      dispatch({
        'type': DELETE_LABEL_FAILED,
      });
    }
  } catch (error) {
    dispatch({
      'type': DELETE_LABEL_FAILED,
    });
  }
};

export const setLabelForPipeline = prediction => async (dispatch, getState) => {
  const tags = getState().raw.toJS().tags;
  const tagsInstance = new Tags(tags);

  let pipelineWithLabel;
  const isSearchEntity = getState().raw.toJS().explodedView.searchFired;

  if (isSearchEntity) {
    pipelineWithLabel = {};
    pipelineWithLabel.items = getState().raw.toJS().explodedView.searchData;
  } else {
    pipelineWithLabel = getState().data.pipelines.toJS();
  }

  pipelineWithLabel.items[prediction.index] = {
    ...pipelineWithLabel.items[prediction.index],
    'showLoader': true,
  };
  if (isSearchEntity) {
    dispatch({
      'type': SET_SEARCH_DATA,
      'payload': pipelineWithLabel.items,
    });
  } else {
    dispatch({
      'type': UPDATE_PIPELINES_MODEL,
      'payload': pipelineWithLabel,
    });
  }
  // create FormData object
  const data = new URLSearchParams();
  data.append('tag_id', prediction.tag_id);
  data.append('entity_name', findEntityName(prediction.pipeline, prediction));
  data.append('entity_type', getEntityTypeByPipeline(prediction.entity_type));
  data.append('pipeline', prediction.pipeline);
  data.append('model_name', prediction.model_name);
  data.append('time_start', moment.utc(prediction.ts).format('X'));
  data.append('time_end', moment.utc(prediction.ts).format('X'));
  data.append('weight', Object.keys(prediction).includes('weight') ? prediction.weight : 1);
  data.append('description', Object.keys(prediction).includes('description') ? prediction.description : '');
  data.append('status', 'active');
  data.append('mode', prediction.mode);

  try {
    const response = await ptrxRESTFormData.post('labels', data);
    if (response.status === 200) {
      pipelineWithLabel.items[prediction.index] = {
        ...pipelineWithLabel.items[prediction.index],
        'showLoader': false,
        user_tag: {
          'label_id': response.data.id,
          'alert': tagsInstance.tags[response.data.tag_id].alert,
          'description': tagsInstance.tags[response.data.tag_id].description,
          'id': response.data.tag_id,
          'name': tagsInstance.tags[response.data.tag_id].name,
          'severity': tagsInstance.tags[response.data.tag_id].severity,
          'system_tag': tagsInstance.tags[response.data.tag_id].system_tag,
          'type': tagsInstance.tags[response.data.tag_id].type,
        },
      };
      dispatch(addNotification('success', 'Set label succeded'));

      if (isSearchEntity) {
        dispatch({
          'type': SET_SEARCH_DATA,
          'payload': pipelineWithLabel.items,
        });
      } else {
        dispatch({
          'type': UPDATE_PIPELINES_MODEL,
          'payload': pipelineWithLabel,
        });
      }
    }
  } catch (error) {
    dispatch(addNotification('error', 'Set label failed.\n Please contact admin'));
    throw error;
  }
};

export const setLabelForPrediction = (prediction, confirm = false, callback = () => {}) =>
  async (dispatch, getState) => {
    const tags = getState().raw.toJS().tags;
    const tagsInstance = new Tags(tags);
    const benighId = tagsInstance.getTagByName('benign')[0].id;
    const data = {
      'tag_id': prediction.tag_id,
      'entity_name': prediction.entity_name,
      'entity_type': prediction.entity_type,
      'pipeline': prediction.pipeline,
      'predicted_tag_id': confirm ? prediction.tag_id : benighId,
      'time_start': moment.utc(prediction.first_ts || prediction.start_time).format('X'),
      'time_end': moment.utc(prediction.last_ts || prediction.end_time).format('X'),
      'weight': Object.keys(prediction).includes('weight') ? prediction.weight : 1,
      'description': Object.keys(prediction).includes('description') ? prediction.description : '',
      'status': 'active',
    };

    try {
      const response = await ptrxREST.post('labels', data);
      if (response.status >= 200 && response.status < 300) {
        dispatch(addNotification('success', 'Set label succeded'));
        callback();
      }
    } catch (error) {
      dispatch(addNotification('error', 'Set label failed.\n Please contact admin'));
      throw error;
    }
  };
/**
 * @deprecated
 * @param row
 * @param behaviorType
 * @returns {Function}
 */
export const handleExplodedView = (row, behaviorType = '') => async (dispatch, getState) => {
  dispatch(fetchSearchData);
  const newEVPVisibility = getState().app.ui.toJS().newEVPVisibility;
  if (newEVPVisibility) {
    const nextLocation = getEvpUrlHandler(row, behaviorType);

    if (Object.keys(row).includes('newTab') && row.newTab === true) {
      const win = window.open(nextLocation, '_blank');
      if (win) {
        win.focus();
      } else {
        dispatch(addNotification('error', notificationConstants.popupError));
      }
    } else {
      dispatch(routerActions.push(nextLocation));
    }
  } else {
    let endTime = moment.utc(row.end_time);
    let startTime = moment.utc(row.start_time);

    if (row.start_time_moment && row.end_time_moment) {
      startTime = row.start_time_moment;
      endTime = row.end_time_moment;
    }

    const bundle = {
      ...row,
      'start_time': row.start_time,
      'start_time_moment': startTime,
      'end_time': row.end_time,
      'end_time_moment': endTime,
      'behaviorType': behaviorType,
      'modeType': row.modeType,
    };
    localStorage.setItem('rowData', JSON.stringify(bundle));
    window.location = window.location.origin;
  }
};

/**
 * Todo: refactor this function to remove the API call
 * @deprecated
 * @param row
 * @param behaviorType
 * @returns {Function}
 */
export const handleExplodedViewFromPipeline = (row, behaviorType = '') => async (dispatch, getState) => {
  dispatch(fetchSearchData);
  const newEVPVisibility = getState().app.ui.toJS().newEVPVisibility;

  try {
    let entityName = findEntityName(row.pipeline, row);
    const entityType = getEntityTypeByPipeline(row.pipeline);
    if (newEVPVisibility) {
      let endTime = moment(Number(row.timestamp), 'X').utc().endOf('d');
      let startTime = moment(endTime).subtract(30, 'd').utc().startOf('d');

      if (row.pipeline === 'sipdip' || row.pipeline === 'sipdomain' || row.pipeline === 'request') {
        entityName = entityName.replace(' ', '+');
      }

      let url = `search?entity_name=${entityName}&entity_type=${entityType}&pipeline=${row.pipeline}&time_start=${startTime.format('X')}&time_end=${endTime.format('X')}&mode=${row.mode}&model_type=${row.model_type}&model_name=${row.selectedModel}`;

      if (row.mode === 'realtime') {
        endTime = moment(row.ts);
        startTime = moment(endTime).subtract(1, 'd').add(1, 's');
        url = `search?entity_name=${entityName}&entity_type=${entityType}&pipeline=${row.pipeline}&time_start=${startTime.format('X')}&time_end=${endTime.format('X')}&mode=${row.mode}&model_type=${row.model_type}&model_name=${row.selectedModel}`;
      }

      dispatch(setModelName(row.selectedModel));
      dispatch(setPipelineEntityData([row]));
      const nextLocation = createURL(
        '/exploded-view',
        {
          ...location.query,
          'start_time': moment(startTime).format('MM-DD-YYYY'),
          'end_time': moment(endTime).format('MM-DD-YYYY'),
          'entity_name': entityName,
          'pipeline': row.pipeline,
          'mode': row.mode,
          'model_name': row.selectedModel,
          'model_type': row.model_type,
          'origin': 'pipeline',
          'go_back_hash': row.goBackHash,
        },
      );
      dispatch(routerActions.push(nextLocation));

      const response = await ptrxREST.get(url);

      if (response.data.items.length > 0) {
        dispatch(setSearchData(response.data.items));
      }
    } else {
      const bundle = {
        ...row,
        'entity_name': entityName,
        'entity_type': entityType,
        'behaviorType': behaviorType,
        'modeType': row.mode,
        'model_type': row.model_type,
        'featureAvailable': true,
      };

      localStorage.setItem('rowData', JSON.stringify(bundle));
      window.location = window.location.origin;
    }
  } catch (error) {
    throw (error);
  }
};
