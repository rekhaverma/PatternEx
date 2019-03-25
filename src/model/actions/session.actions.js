import { ptrxRESTlocal } from 'lib/rest';

import { addNotification } from './ui.actions';

export const SESSION_IS_ALREADY_AUTHENTICATED_SUCCESS = '@@session/IS_ALREADY_AUTHENTICATED_SUCCESS';
export const SESSION_IS_ALREADY_AUTHENTICATED_FAIL = '@@session/IS_ALREADY_AUTHENTICATED_FAIL';
export const SESSION_AUTHENTICATE_USER_SUCCESS = '@@session/AUTHENTICATE_USER_SUCCESS';
export const SESSION_AUTHENTICATE_USER_LOADING_START = '@@session/AUTHENTICATE_USER_LOADING_START';
export const SESSION_AUTHENTICATE_USER_LOADING_COMPLETE = '@@session/AUTHENTICATE_USER_LOADING_COMPLETE';
export const SESSION_USER_LOGOUT_COMPLETE = '@@session/USER_LOGOUT_COMPLETE';

/**
 * @deprecated
 * @returns {Function}
 */
export const checkIfUserIsAuthencated = () => async (dispatch) => {
  try {
    await ptrxRESTlocal.get('privileges');
    dispatch({
      'type': SESSION_IS_ALREADY_AUTHENTICATED_SUCCESS,
    });
  } catch (error) {
    dispatch({
      'type': SESSION_IS_ALREADY_AUTHENTICATED_FAIL,
    });
    throw error;
  }
};

/**
 * Rewrite this action once the API will be ready...
 * @deprecated
 */
export const authenticateUser = data => async (dispatch) => {
  dispatch({
    type: SESSION_AUTHENTICATE_USER_LOADING_START,
    payload: true,
  });

  try {
    await ptrxRESTlocal.post('login', data);

    dispatch({
      type: SESSION_AUTHENTICATE_USER_LOADING_COMPLETE,
      payload: true,
    });

    dispatch({
      type: SESSION_AUTHENTICATE_USER_SUCCESS,
      payload: true,
    });
  } catch (error) {
    dispatch({
      type: SESSION_AUTHENTICATE_USER_LOADING_COMPLETE,
      payload: true,
    });

    dispatch(addNotification('error', 'Invalid credentials!'));
  }
};

/**
 * Review this action once API is complete
 * @deprecated
 */
export const logoutUser = () => async (dispatch) => {
  try {
    await ptrxRESTlocal.post('logout');

    dispatch({
      type: SESSION_USER_LOGOUT_COMPLETE,
      payload: true,
    });
  } catch (error) {
    // @todo: find a way to handle errors
  }

  dispatch({
    type: SESSION_USER_LOGOUT_COMPLETE,
    payload: true,
  });
};
