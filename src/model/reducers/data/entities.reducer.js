import { fromJS } from 'immutable';
// import * as actions from 'model/actions';

const initialState = fromJS({
  'isLoading': false,
  'error': '',
  'items': [],
});

export default (state = initialState, { type }) => {
  switch (type) {
    // case actions.FETCH_ENTITIES:
    //   return state.set('isLoading', true);

    // case actions.FETCH_ENTITIES_COMPLETE:
    //   return state.set('isLoading', false)
    //     .set('items', payload.items);

    // case actions.FETCH_ENTITIES_FAILED:
    //   return state.set('isLoading', false)
    //     .set('error', payload);

    // case 'MOCK/REMOVE_ENTITY':
    //   return state.set('items', payload);

    default:
      return state;
  }
};
