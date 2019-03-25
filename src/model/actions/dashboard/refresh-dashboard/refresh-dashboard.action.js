import dashboardActions from '../actions';

/**
 * @returns {{type: string}}
 */
const refreshDashboard = () => ({ 'type': dashboardActions.REFRESH_DASHBOARD });

/**
 * @param {boolean} isRefreshEnabled
 * @return {Thunk}
 */
export const toggleAutoRefresh = isRefreshEnabled => (dispatch, getState) => {
  dispatch(refreshDashboard({
    'isRefreshEnabled': isRefreshEnabled || !getState().raw.toJS().isRefreshEnabled,
  }));
};
