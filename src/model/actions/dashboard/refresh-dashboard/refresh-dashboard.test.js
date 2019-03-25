import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { fromJS } from 'immutable';

import { toggleAutoRefresh } from './refresh-dashboard.action';
import dashboardActions from '../actions';

/**
 * @sign-off-by: Georgiana Lingurariu
 */

const mockStore = configureMockStore([thunk]);

describe('refresh-dashboard-data action', () => {
  it('should dispath REFRESH_DASHBOARD action when dashboard is being refreshed', () => {
    const store = mockStore({
      'raw': fromJS({
        'isRefreshEnabled': true,
      }),
    });

    const expectedActions = [
      {
        'type': dashboardActions.REFRESH_DASHBOARD,
      },
    ];

    store.dispatch(toggleAutoRefresh());
    expect(store.getActions()).toEqual(expectedActions);
  });
});
