import { ptrxRESTlocal } from 'lib/rest';

import sessionActions from '../actions';

const setUserIsLoggedInStart = () => ({
  'type': sessionActions.USER_IS_LOGGED_IN_START,
});

const setUserIsLoggedInSuccess = () => ({
  'type': sessionActions.USER_IS_LOGGED_IN_SUCCESS,
});

const setUserIsLoggedInFail = () => ({
  'type': sessionActions.USER_IS_LOGGED_IN_FAIL,
});

export const checkIfUserIsLoggedIn = () => async (dispatch) => {
  dispatch(setUserIsLoggedInStart());

  try {
    await ptrxRESTlocal.get('privileges');
  } catch (e) {
    return dispatch(setUserIsLoggedInFail());
  }

  return dispatch(setUserIsLoggedInSuccess());
};
