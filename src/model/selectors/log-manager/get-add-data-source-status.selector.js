import { createSelector } from 'reselect';

const loadingState = state => state.logManager.toJS().loading.addDataSource;
const statusState = state => state.logManager.toJS().status.addDataSource;

export const getAddDataSourceStatus = createSelector(
  loadingState,
  statusState,
  (loading, status) => {
    if (loading) {
      return 'loading';
    }

    return status || 'not-started';
  },
);
