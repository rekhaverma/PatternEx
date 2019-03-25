import { ptrxRESTlocal } from 'lib/rest';

import sessionActions from '../actions';

const setUserLoginStart = () => ({
  'type': sessionActions.USER_LOGIN_START,
});

const setUserLoginSuccess = () => ({
  'type': sessionActions.USER_LOGIN_SUCCESS,
});

const setUserLoginFail = () => ({
  'type': sessionActions.USER_LOGIN_FAIL,
});

export const userLogin = data => async (dispatch) => {
  dispatch(setUserLoginStart());

  try {
    await ptrxRESTlocal.post('login', data);
  } catch (e) {
    return dispatch(setUserLoginFail());
  }

  return dispatch(setUserLoginSuccess());
};
