import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';

import { ptrxRESTlocal } from 'lib/rest';

import sessionActions from '../actions';
import { checkIfUserIsLoggedIn } from './user-is-logged-in.action';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
const mockStore = configureMockStore([thunk]);
describe('user-is-logged-in action', () => {
  beforeEach(() => moxios.install(ptrxRESTlocal));
  afterEach(() => moxios.uninstall(ptrxRESTlocal));

  it('should dispatch SESSION_USER_IS_LOGGED_IN_SUCCESS action when request complete successfully', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': sessionActions.USER_IS_LOGGED_IN_START,
        },
        {
          'type': sessionActions.USER_IS_LOGGED_IN_SUCCESS,
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      store.dispatch(checkIfUserIsLoggedIn());
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
        })
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
          });
      });
    });
  });

  it('should dispatch SESSION_USER_IS_LOGGED_IN_FAIL action when request complete with 401', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': sessionActions.USER_IS_LOGGED_IN_START,
        },
        {
          'type': sessionActions.USER_IS_LOGGED_IN_FAIL,
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      store.dispatch(checkIfUserIsLoggedIn());
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
        })
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
          });
      });
    });
  });
});