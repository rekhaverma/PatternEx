import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';

import ptrxREST from 'lib/rest/index';

import evpActions from '../actions';
import { getClusterRelations } from './cluster-relations.action';

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

describe('cluster-relations action', () => {
  beforeEach(() => moxios.install(ptrxREST));
  afterEach(() => moxios.uninstall(ptrxREST));

  it('should dispatch SET_CLUSTER_RELATIONS action when fetching cluster relations has been done', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': evpActions.FETCH_CLUSTER_RELATIONS,
        },
        {
          'type': evpActions.SET_CLUSTER_RELATIONS,
          'payload': {
            'clusterDetails': [],
            'clusterEntities': [
              {
                id: 1,
              }],
          },
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      store.dispatch(getClusterRelations(params));

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            items: [],
          },
        })
          .then(() => {
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
  });
});