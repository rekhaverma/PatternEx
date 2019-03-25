import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';
import { fromJS } from 'immutable';

import ptrxREST from 'lib/rest/index';

import moment from 'moment';

import actions from '../../actions';
import { refreshBehaviorSummary } from './refresh-behavior-summary.action';

/**
 * @sign-off-by: Georgiana Lingurariu
 */

const mockStore = configureMockStore([thunk]);

const startTime = moment.utc('2018-03-11');
const endTime = moment.utc('2018-03-11');

describe('refresh-behavior-summary action', () => {
  beforeEach(() => moxios.install(ptrxREST));
  afterEach(() => moxios.uninstall(ptrxREST));

  it('should dispatch REFRESH_SUMMARY action when summary data is being refreshed', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': actions.REFRESH_SUMMARY,
        },
        {
          'payload': {
            'endDate': '2018-03-11',
            'items': {
              'day_ts': '1520726400',
              'items': [{ 'id': 1 }],
            },
            'startDate': '2018-03-11',
          },
          'type': actions.REFRESH_SUMMARY_CHUNK_COMPLETE,
        }];

      const store = mockStore({
        mockStore: [],
        'raw': fromJS({
          'behaviorSummary': [],
        }),
        'app': {
          'ui': fromJS({
            'notifications': [],
          }),
        },
      });

      store.dispatch(refreshBehaviorSummary(startTime, endTime));
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
