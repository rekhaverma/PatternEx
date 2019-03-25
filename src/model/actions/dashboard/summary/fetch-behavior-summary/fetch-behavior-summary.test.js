import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';
import { fromJS } from 'immutable';
import moment from 'moment';

import ptrxREST from 'lib/rest';

import actions from '../../actions';
import { fetchBehaviorSummary } from './fetch-behavior-summary.action';

/**
 * @sign-off-by: Georgiana Lingurariu
 */
const mockStore = configureMockStore([thunk]);

const startTime = moment.utc('2018-03-11');
const endTime = moment.utc('2018-03-11');

describe('fetch-behavior-summary action', () => {
  beforeEach(() => moxios.install(ptrxREST));
  afterEach(() => moxios.uninstall(ptrxREST));

  it('should dispatch FETCH_SUMMARY action when summary data is being fetched', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': actions.FETCH_SUMMARY,
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
          'type': actions.FETCH_SUMMARY_CHUNK_COMPLETE,
        },
      ];

      const store = mockStore({
        mockStore: [],
        app: {
          ui: fromJS({
            notifications: [],
          }),
        },
      });

      store.dispatch(fetchBehaviorSummary(startTime, endTime));
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
