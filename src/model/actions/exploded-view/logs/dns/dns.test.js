import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';

import { ptrxZeppelin } from 'lib/rest/index';

import evpActions from '../../actions';
import { getLogsDNS } from './dns.action';

/**
 * @status: WIP
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

describe('dns-logs action', () => {
  beforeEach(() => moxios.install(ptrxZeppelin));
  afterEach(() => moxios.uninstall(ptrxZeppelin));

  it('should dispatch SET_DNS_LOGS_DATA action when fetching dns logs has been done', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': evpActions.SET_DNS_LOGS_DATA,
          'payload': [], // @todo: update the response data to receive valid data
        }];

      const store = mockStore({
        mockStore: [],
      });

      store.dispatch(getLogsDNS(params));

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            body: [
              {
                id: '2DGWQ1N8P',
                name: 'DNSExfillAnalysis',
              }],
          },
        })
          .then(() => {
            moxios.wait(() => {
              const request = moxios.requests.mostRecent();
              request.respondWith({
                status: 200,
                response: {
                  body: {
                    paragraphs: [
                      {}, {},
                      {
                        results: {
                          code: 'SUCCESS',
                          msg: [{ 'type': 'TABLE', 'data': 'plugin\tplugin_name\tfamily\tseverity\tip_addr\tnetbios_name\tdns_name\n' }],
                        },
                      },
                    ],
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
  });
});