import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';

import ptrxREST from 'lib/rest/index';

import evpActions from '../actions';
import { getDHCPData } from './dhcp.action';

/**
 * @status: Complete
 * @sign-off-by: Kimmi Kumari, Alex Andries
 */
const mockStore = configureMockStore([thunk]);
const params = {
  ip: '10.0.131.167',
  date: '2018-02-23',
};
describe('dhcp action', () => {
  beforeEach(() => moxios.install(ptrxREST));
  afterEach(() => moxios.uninstall(ptrxREST));

  it('should dispatch GET_DHCP_DATA_SUCCESS action when fetching DHCP data has been done', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': evpActions.GET_DHCP_DATA,
        },
        {
          'type': evpActions.GET_DHCP_DATA_SUCCESS,
          'payload': ['02/23/18 16:40:48', '10.0.131.167', 'NPI3DDDBB.in.nawras.com.om'],
        },
      ];

      const store = mockStore({
        mockStore: [],
      });
      store.dispatch(getDHCPData(params));
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            domain_info: {},
            ip_address_info: {
              host_name: ['02/23/18 16:40:48', '10.0.131.167', 'NPI3DDDBB.in.nawras.com.om'],
            },
          },
        })
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
          });
      });
    });
  });
});
