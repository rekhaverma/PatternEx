import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';
import { fromJS } from 'immutable';
import moment from 'moment';

import ptrxREST from 'lib/rest';
import actions from '../actions';

import { fetchPerformanceData } from './fetch-performance-data.action';

/**
 * @sign-off-by: Georgiana Lingurariu
 */
const mockStore = configureMockStore([thunk]);

const startTime = moment.utc('2018-03-11');
const endTime = moment.utc('2018-03-11');

describe('fetch-performance-data action', () => {
  beforeEach(() => moxios.install(ptrxREST));
  afterEach(() => moxios.uninstall(ptrxREST));

  it('should dispatch FETCH_PERFORMANCE_DATA action when performance data is being fetched', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': actions.FETCH_PERFORMANCE_DATA,
        },
        {
          'payload': {
            'items': [{ 'id': 1 }],
          },
          'type': actions.FETCH_PERFORMANCE_DATA_COMPLETE,
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

      store.dispatch(fetchPerformanceData(startTime, endTime));
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
