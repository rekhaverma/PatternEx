import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';
import ptrxREST from 'lib/rest/index';

import evpActions from '../actions';
import { setLabelHandler, labelStatus } from './set-label.action';

jest.mock('model/actions/ui.actions', () => ({ addNotification: jest.fn(() => jest.fn()) }));

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
describe('set label action', () => {
  beforeEach(() => moxios.install(ptrxREST));
  afterEach(() => moxios.uninstall(ptrxREST));

  it('should dispatch SET_LABEL_COMPLETE action when label has been set', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          'type': evpActions.SET_LABEL_START,
        },
        {
          'type': evpActions.SET_LABEL_COMPLETE,
        }];

      const store = mockStore({
        mockStore: [],
      });
      store.dispatch(setLabelHandler(params, ''));
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 222,
          response: {
            message: 'Label set successfully',
          },
        })
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
          });
      });
    });
  });
  it('should return confirmed if predictedTag is equal to tagId', () => {
    expect(labelStatus('1', '1')).toBe('confirmed');
  });
  it('should return rejected if predictedTag is not equal with tagId', () => {
    expect(labelStatus('1', '2')).toBe('rejected');
  });
});
