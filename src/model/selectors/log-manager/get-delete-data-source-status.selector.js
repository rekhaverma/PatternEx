import { createSelector } from 'reselect';

const loadingState = state => state.logManager.toJS().loading.deleteDataSource;
const statusState = state => state.logManager.toJS().status.deleteDataSource;

export const getDeleteDataSourceStatus = createSelector(
  loadingState,
  statusState,
  (loading, status) => {
    if (loading) {
      return 'loading';
    }

    return status || 'not-started';
  },
);
