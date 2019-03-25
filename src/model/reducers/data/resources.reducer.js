import { fromJS } from 'immutable';
import * as actions from 'model/actions';

const initialState = fromJS({
  'isLoading': [],
  'resources': [],
  'updateResources': false,
  'resourceError': '',
});

export default (state = initialState, { type, payload }) => {
  const isLoading = state.get('isLoading');
  switch (type) {
    case actions.GET_RESOURCES:
    case actions.ADD_RESOURCE:
    case actions.UPDATE_RESOURCE:
    case actions.DELETE_RESOURCE:
      return state
        .set('isLoading', isLoading.push(type));

    case actions.GET_RESOURCES_SUCCESS:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.GET_RESOURCES))
        .set('resources', fromJS(payload));

    case actions.GET_RESOURCES_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.GET_RESOURCES));

    case actions.ADD_RESOURCE_SUCCESS:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.ADD_RESOURCE))
        .set('updateResources', true);

    case actions.ADD_RESOURCE_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.ADD_RESOURCE))
        .set('updateResources', false)
        .set('resourceError', payload);

    case actions.UPDATE_RESOURCE_SUCCESS:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.UPDATE_RESOURCE))
        .set('updateResources', true);

    case actions.UPDATE_RESOURCE_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.UPDATE_RESOURCE))
        .set('updateResources', false)
        .set('resourceError', payload);

    case actions.RESET_RESOURCES_STATE:
      return state.set('updateResources', false);

    case actions.RESET_RESOURCES_ERROR_STATE:
      return state.set('resourceError', '');

    case actions.DELETE_RESOURCE_SUCCESS:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.DELETE_RESOURCE))
        .set('updateResources', true);

    case actions.DELETE_RESOURCE_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.DELETE_RESOURCE))
        .set('updateResources', false);

    default:
      return state;
  }
};
