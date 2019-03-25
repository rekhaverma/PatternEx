import { createSelector } from 'reselect';

const loadingState = state => state.logManager.toJS().loading.stopDataSource;
const statusState = state => state.logManager.toJS().status.stopDataSource;

export const getStopDataSourceStatus = createSelector(
  loadingState,
  statusState,
  (loading, status) => {
    if (loading) {
      return 'loading';
    }

    return status || 'not-started';
  },
);
