import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';

import { ptrxRESTlocal } from 'lib/rest';

import sessionActions from '../actions';
import { userLogout } from './user-logout.action';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
const mockStore = configureMockStore([thunk]);
describe('user-logout action', () => {
  beforeEach(() => moxios.install(ptrxRESTlocal));
  afterEach(() => moxios.uninstall(ptrxRESTlocal));

  it('should dispatch USER_LOGOUT_SUCCESS action when request complete successfully', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': sessionActions.USER_LOGOUT_START,
        },
        {
          'type': sessionActions.USER_LOGOUT_SUCCESS,
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      store.dispatch(userLogout());
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

  it('should dispatch USER_LOGOUT_FAIL action when request complete with 400', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': sessionActions.USER_LOGOUT_START,
        },
        {
          'type': sessionActions.USER_LOGOUT_FAIL,
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      store.dispatch(userLogout());
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 400,
        })
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
          });
      });
    });
  });
});