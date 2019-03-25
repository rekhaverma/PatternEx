import { fromJS } from 'immutable';
import * as actions from 'model/actions';

const initialState = fromJS({
  'isLoading': false,
  'limit': 100,
  'start': 0,
  'error': '',
  'items': [],
});
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.FETCH_PERFORMANCE_DATA:
      return state.set('isLoading', true);

    case actions.FETCH_PERFORMANCE_DATA_COMPLETE:
      return state.set('isLoading', false)
        .set('items', payload.items);

    case actions.FETCH_PERFORMANCE_DATA_FAILED:
      return state.set('isLoading', false)
        .set('error', payload);

    default:
      return state;
  }
};
