import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';

import { ptrxRESTlocal } from 'lib/rest';

import sessionActions from '../actions';
import { userLogin } from './user-login.action';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
const params = {
  email: '',
  password: '',
};
const mockStore = configureMockStore([thunk]);
describe('user-login action', () => {
  beforeEach(() => moxios.install(ptrxRESTlocal));
  afterEach(() => moxios.uninstall(ptrxRESTlocal));

  it('should dispatch USER_LOGIN_SUCCESS action when request complete successfully', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': sessionActions.USER_LOGIN_START,
        },
        {
          'type': sessionActions.USER_LOGIN_SUCCESS,
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      store.dispatch(userLogin(params));
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

  it('should dispatch USER_LOGIN_FAIL action when request complete with 400', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': sessionActions.USER_LOGIN_START,
        },
        {
          'type': sessionActions.USER_LOGIN_FAIL,
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      store.dispatch(userLogin(params));
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