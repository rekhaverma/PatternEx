import { createSelector } from 'reselect';

const loadingState = state => state.logManager.toJS().loading.updateDataSource;
const statusState = state => state.logManager.toJS().status.updateDataSource;

export const getUpdateDataSourceStatus = createSelector(
  loadingState,
  statusState,
  (loading, status) => {
    if (loading) {
      return 'loading';
    }

    return status || 'not-started';
  },
);
