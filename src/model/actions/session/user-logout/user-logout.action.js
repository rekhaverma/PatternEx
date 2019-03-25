import { ptrxRESTlocal } from 'lib/rest';

import sessionActions from '../actions';

const setUserLogoutStart = () => ({
  'type': sessionActions.USER_LOGOUT_START,
});

const setUserLogoutSuccess = () => ({
  'type': sessionActions.USER_LOGOUT_SUCCESS,
});

const setUserLogoutFail = () => ({
  'type': sessionActions.USER_LOGOUT_FAIL,
});

export const userLogout = () => async (dispatch) => {
  dispatch(setUserLogoutStart());

  try {
    await ptrxRESTlocal.post('logout');
  } catch (e) {
    return dispatch(setUserLogoutFail());
  }

  return dispatch(setUserLogoutSuccess());
};
