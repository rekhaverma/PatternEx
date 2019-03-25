import { fromJS } from 'immutable';

import { RESET_FILTERS, SET_FILTER } from '../actions/malicious-activity.actions';

const initialState = fromJS({
  'active': {},
  'highlighted': '',
  'filterByEntity': '',
  'filterBySeverity': '',
  'timelineRange': {},
});

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case RESET_FILTERS:
      return initialState;

    case SET_FILTER:
      if (payload.filter === 'filterByEntity') {
        return initialState.set(payload.filter, payload.value);
      }
      if (payload.filter === 'timelineRange') {
        return state.setIn(['timelineRange', 'start'], payload.value.start)
          .setIn(['timelineRange', 'end'], payload.value.end);
      }
      return state.set(payload.filter, payload.value);

    default:
      return state;
  }
};
