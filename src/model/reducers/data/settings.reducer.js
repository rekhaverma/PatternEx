import { fromJS } from 'immutable';
import * as actions from 'model/actions';

const initialState = fromJS({
  'isLoading': false,
  'pipelineUpdate': '',
  'updateSysteminfo': '',
});

export default (state = initialState, { type }) => {
  switch (type) {
    case actions.UPDATE_PIPELINE:
    case actions.UPDATE_SYSTEMINFO:
      return state.set('isLoading', true);

    case actions.RESET_SYSTEMINFO_STATE:
      return state.set('updateSysteminfo', '');

    case actions.RESET_PIPELINES_STATE:
      return state.set('pipelineUpdate', '');

    case actions.UPDATE_SYSTEMINFO_COMPLETED:
      return state.set('isLoading', false)
        .set('updateSysteminfo', 'success');

    case actions.UPDATE_PIPELINE_COMPLETED:
      return state.set('isLoading', false)
        .set('pipelineUpdate', 'success');

    case actions.UPDATE_PIPELINE_FAILED:
      return state.set('isLoading', false)
        .set('pipelineUpdate', 'failed');

    case actions.UPDATE_SYSTEMINFO_FAILED:
      return state.set('isLoading', false)
        .set('updateSysteminfo', 'failed');

    default:
      return state;
  }
};
