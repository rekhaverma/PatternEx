/* eslint newline-per-chained-call: 0 */
import { fromJS } from 'immutable';
import moment from 'moment';

import { SET_DATE } from '../actions/timeline.actions';

const initialState = fromJS({
  'fromDate': moment().set('year', 2017).set('month', 8).set('date', 20).hours(0).minutes(0).seconds(0),
  'untilDate': moment().hours(0).minutes(0).seconds(0),
});

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_DATE:
      return state.set(payload.key, moment(payload.value, 'MM-DD-YYYY'));

    default:
      return state;
  }
};
