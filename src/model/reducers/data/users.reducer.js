import * as actions from 'model/actions';
import { fromJS } from 'immutable';

const initialState = fromJS({
  'userDetail': {},
});

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.FETCH_USER_DETAIL_COMPLETE:
      return state.set('userDetail', fromJS(payload));

    default:
      return state;
  }
};
