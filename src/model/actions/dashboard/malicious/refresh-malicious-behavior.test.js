import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';
import { fromJS } from 'immutable';

import ptrxREST from 'lib/rest/index';

import moment from 'moment';

import maliciousActions from '../actions';
import { refreshMaliciousBehavior } from './refresh-malicious-behavior.action';
import { ADD_NOTIFICATION } from '../../ui.actions';

/**
 * @sign-off-by: Georgiana Lingurariu
 */

const mockStore = configureMockStore([thunk]);

const startTime = moment.utc('2018-03-11').unix();
const endTime = moment.utc('2018-03-11').unix();

describe('refresh-malicious-behavior-data action', () => {
  beforeEach(() => moxios.install(ptrxREST));
  afterEach(() => moxios.uninstall(ptrxREST));

  it('should dispatch REFRESH_MALICIOUS_BEHAVIOR action when malicious behavior data is being refreshed', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': maliciousActions.REFRESH_MALICIOUS_BEHAVIOR,
        },
        {
          'payload':
            {
              'hash': '20180311/20180311#malicious&limit=1000&start=0',
              'items': [{ 'id': 1 }],
            },
          'type': maliciousActions.REFRESH_MALICIOUS_BEHAVIOR_COMPLETE,
        },
        {
          'payload':
            {
              'content': 'Malicious data is refreshed',
              'type': 'success',
            },
          'type': ADD_NOTIFICATION,
        }];

      const store = mockStore({
        raw: fromJS({
          maliciousBehaviorHash: 'hash',
          maliciousBehavior: [],
        }),
        app: {
          ui: fromJS({
            notifications: [],
          }),
        },
      });

      store.dispatch(refreshMaliciousBehavior(startTime, endTime));
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            items: [
              {
                id: 1,
              },
            ],
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
