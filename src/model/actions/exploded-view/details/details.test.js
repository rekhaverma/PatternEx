import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';

import ptrxREST from 'lib/rest/index';

import evpActions from '../actions';
import { getDetailsData } from './details.action';

const mockStore = configureMockStore([thunk]);
const params = {
  entity_name: '172.26.20.87 10.202.91.84',
  entity_type: 'sipdip',
  pipeline: 'sipdip',
  start_time: '01-28-2018',
  end_time: '01-28-2018',
  mode: 'batch',
};

describe('details action', () => {
  beforeEach(() => moxios.install(ptrxREST));
  afterEach(() => moxios.uninstall(ptrxREST));

  it('should dispatch SET_DETAILS_DATA action when fetching details data has been done', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': evpActions.GET_DETAILS_DATA,
        },
        {
          'type': evpActions.SET_DETAILS_DATA,
          'payload': [{
            id: 1,
          }],
        }];

      const store = mockStore({
        mockStore: [],
      });
      store.dispatch(getDetailsData(params));

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
