import { fromJS } from 'immutable';
import * as actions from 'model/actions/rest/labels.actions.js';

const initialState = fromJS({
  'isLoading': [],
  'limit': 100,
  'start': 0,
  'error': '',
  'items': [],
  'labelSummaryAvailable': false,
  'labelsAvailable': false,
  'allLabels': [],
  'updateLabelCall': false,
  'deleteLabelCall': false,
});

export default (state = initialState, { type, payload }) => {
  const isLoading = state.get('isLoading');
  switch (type) {
    case actions.FETCH_LABELS_SUMMARY:
      return state
        .set('isLoading', isLoading.push(type))
        .set('labelSummaryAvailable', false);

    case actions.FETCH_LABELS_SUMMARY_COMPLETED:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.FETCH_LABELS_SUMMARY))
        .set('labelSummary', payload.data)
        .set('labelSummaryAvailable', true);

    case actions.INITIATE_FETCH_LABELS:
      return state
        .set('isLoading', isLoading.push(type))
        .set('labelsAvailable', false);

    case actions.FETCH_LABELS_COMPLETED:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.INITIATE_FETCH_LABELS))
        .set('items', payload)
        .set('labelsAvailable', true);

    case actions.FETCH_LABELS_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.INITIATE_FETCH_LABELS))
        .set('error', payload);

    case actions.UPDATE_LABEL:
      return state.set('isLoading', isLoading.push(type));

    case actions.UPDATE_LABEL_SUCCESS:
      return state
        .set('isLoading', isLoading.filterNot(action => action === actions.UPDATE_LABEL))
        .set('updateLabelCall', true);

    case actions.UPDATE_LABEL_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.UPDATE_LABEL));

    case actions.DELETE_LABEL:
      return state.set('isLoading', isLoading.push(type));

    case actions.DELETE_LABEL_SUCCESS:
      return state
        .set('isLoading', isLoading.filterNot(action => action === actions.DELETE_LABEL))
        .set('deleteLabelCall', true);

    case actions.DELETE_LABEL_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.DELETE_LABEL));

    case actions.SET_DELETE_LABEL_STATE:
      return state.set('deleteLabelCall', payload);

    case actions.SET_UPDATE_LABEL_STATE:
      return state.set('updateLabelCall', payload);

    default:
      return state;
  }
};
