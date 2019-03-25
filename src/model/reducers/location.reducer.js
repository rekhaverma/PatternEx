import { fromJS } from 'immutable';

const initialState = fromJS({
  'previous': '',
  'current': '',
});

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case '@@router/LOCATION_CHANGE':
      return state
        .set('previous', state.toJS().current.substr(1))
        .set('current', payload.pathname.substr(1));
    default:
      return state;
  }
};

