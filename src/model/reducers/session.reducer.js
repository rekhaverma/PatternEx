import { fromJS } from 'immutable';
import { sessionActions } from 'model/actions/session';

const initialState = fromJS({
  isAuthenticated: false,
  userData: {},
  isLoading: false,
  isLoggedOut: false,
  sessionCheck: {
    accessCheck: false,
    isAuthenticated: false,
  },
});

export default (state = initialState, { type }) => {
  switch (type) {
    case sessionActions.USER_IS_LOGGED_IN_START:
      return state.set('isLoading', true);
    case sessionActions.USER_IS_LOGGED_IN_SUCCESS:
      return state.set('isLoading', false)
        .set('sessionCheck', {
          accessCheck: true,
          isAuthenticated: true,
        });
    case sessionActions.USER_IS_LOGGED_IN_FAIL:
      return state.set('isLoading', false)
        .set('sessionCheck', {
          accessCheck: true,
          isAuthenticated: false,
        });

    case sessionActions.USER_LOGIN_START:
      return state.set('isLoading', true);
    case sessionActions.USER_LOGIN_SUCCESS:
      return state.set('isAuthenticated', true)
        .set('isLoading', false);
    case sessionActions.USER_LOGIN_FAIL:
      return state.set('isLoading', false);

    case sessionActions.USER_LOGOUT_START:
      return state.set('isLoading', true);
    case sessionActions.USER_LOGOUT_SUCCESS:
    case sessionActions.USER_LOGOUT_FAIL:
      return state.set('isLoggedOut', true)
        .set('isLoading', false);

    default:
      return state;
  }
};
