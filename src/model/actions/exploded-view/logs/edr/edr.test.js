import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';

import ptrxREST from 'lib/rest/index';

import { getLogsEDR } from './edr.action';
import evpActions from '../../actions';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
const mockStore = configureMockStore([thunk]);
const params = {
  behavior_type: 'suspicious',
  end_time: '06-23-2018',
  entity_id: '3a627a00-76c4-11e8-8caf-6bff10ab57c7',
  entity_name: '172.18.16.236 8.8.8.8',
  method_name: 'ranking',
  mode: 'realtime',
  model_name: '2018-04-29-Ranking-SipDip-1-ICMPEXFIL',
  pipeline: 'sipdip',
  start_time: '06-23-2018',
};
describe('edr-logs action', () => {
  beforeEach(() => moxios.install(ptrxREST));
  afterEach(() => moxios.uninstall(ptrxREST));

  it('should dispatch GET_EDR_LOGS_DATA_SUCCESS action when fetching edr logs has been done', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': evpActions.GET_EDR_LOGS_DATA,
        },
        {
          'type': evpActions.GET_EDR_LOGS_DATA_SUCCESS,
          'payload': {
            items: [
              {
                id: 1,
              }],
          },
        }];

      const store = mockStore({
        mockStore: [],
      });

      store.dispatch(getLogsEDR(params));
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            items: [
              {
                id: 1,
              }],
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