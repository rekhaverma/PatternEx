import { createSelector } from 'reselect';

const loadingState = state => state.logManager.toJS().loading;

export const getRootLoader = createSelector(
  loadingState,
  (loading) => {
    const loaderStatus = Object.keys(loading)
      .filter(key => key !== 'getSummaryData' && loading[key]);
    return loaderStatus.length > 0;
  },
);
