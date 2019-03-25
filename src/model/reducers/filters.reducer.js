import { fromJS } from 'immutable';
import { SET_FILTER, CLEAR_FILTERS, SET_ENTITY } from '../actions/filters.actions';

const initialState = fromJS({
  'entity_type': null,
  'behavior': null,
  'query': null,
  'selected': null,
});

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_FILTER:
      return state.set(payload.filter, payload.value)
        .set('selected', null);

    case CLEAR_FILTERS:
      return initialState;

    case SET_ENTITY:
      return state.set('entity_type', null)
        .set('behavior', null)
        .set('query', null)
        .set('selected', payload);

    default:
      return state;
  }
};
