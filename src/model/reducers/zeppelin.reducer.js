import { fromJS } from 'immutable';

import { GET_NOTEBOOK_COMPLETE, UPDATE_STATUSES, DISABLE_ZEPPELIN, FINISH_AUTOCORRELATE, START_AUTOCORRELATE } from '../actions/zeppelin.actions';

const initialState = fromJS({
  'notebookId': '',
  'paragraphs': {},
  'disabled': false,
  'autocorrelateInProgress': false,
});

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_NOTEBOOK_COMPLETE: {
      return state.set('notebookId', fromJS(payload.id))
        .set('paragraphs', fromJS(payload.paragraphs));
    }

    case UPDATE_STATUSES:
      return state.set(
        'paragraphs',
        state.get('paragraphs').map((value, key) => value.set('status', payload[key].status)),
      );

    case DISABLE_ZEPPELIN:
      return state.set('disabled', true).set('autocorrelateInProgress', false);

    case START_AUTOCORRELATE:
      return state.set('autocorrelateInProgress', true);

    case FINISH_AUTOCORRELATE:
      return state.set('autocorrelateInProgress', false);

    default:
      return state;
  }
};
