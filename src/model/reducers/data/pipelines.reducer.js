import { fromJS } from 'immutable';
import * as actions from 'model/actions/rest/pipelines.actions.js';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = fromJS({
  'items': [],
  'totalCount': 0,
  'filterParams': {},
});

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.FETCH_PIPELINES_MODEL_COMPLETE:
      return state.set('items', fromJS(payload.items))
        .set('totalCount', payload.totalCount);

    case actions.FETCH_PIPELINES_MODEL_MORE: {
      const items = state.get('items');
      return state.set('items', items.concat(fromJS(payload.items)));
    }

    case actions.UPDATE_PIPELINES_MODEL: {
      return state.set('items', fromJS(payload.items));
    }

    case actions.FETCH_PIPELINES_MODEL_FAILED:
      return state.set('item', []);

    case actions.RESET_PIPELINES_MODE:
      return initialState;

    case LOCATION_CHANGE:
      const filterParams = state.toJS().filterParams;
      if (payload.pathname.includes('pipeline') && Object.keys(payload.query).length) {
        return state.set('filterParams', payload.query);
      }
      return state.set('filterParams', filterParams);

    default:
      return state;
  }
};
