import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';
import { fromJS } from 'immutable';
import moment from 'moment';

import ptrxREST from 'lib/rest';

import suspiciousActions from '../actions';
import { fetchSuspiciousBehavior } from './fetch-suspicious-behavior.action';

/**
 * @sign-off-by: Georgiana Lingurariu
 */

const mockStore = configureMockStore([thunk]);

const startTime = moment.utc('2018-03-11').unix();
const endTime = moment.utc('2018-03-11').unix();

describe('fetch-suspicious-behavior action', () => {
  beforeEach(() => moxios.install(ptrxREST));
  afterEach(() => moxios.uninstall(ptrxREST));

  it('should dispatch FETCH_SUSPICIOUS_BEHAVIOR action when suspicious behavior data is being fetched', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        { 'type': suspiciousActions.FETCH_SUSPICIOUS_BEHAVIOR },
        {
          'payload': {
            'hash': '20180311/20180311#suspicious&limit=1000&start=0',
            'items': [{ 'id': 1 }],
          },
          'type': suspiciousActions.FETCH_SUSPICIOUS_BEHAVIOR_COMPLETE,
        }];

      const store = mockStore({
        raw: fromJS({
          suspiciousBehaviorHash: 'hash',
          suspiciousBehavior: [],
        }),
      });

      store.dispatch(fetchSuspiciousBehavior(startTime, endTime));
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            items: [],
            totalCount: 1001,
            limit: 1000,
          },
        })
          .then(() => {
            moxios.wait(() => {
              const req = moxios.requests.mostRecent();
              req.respondWith({
                status: 200,
                response: {
                  items: [
                    {
                      id: 1,
                    },
                  ],
                  totalCount: 1001,
                  limit: 2000,
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
