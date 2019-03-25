import { createSelector } from 'reselect';
import { ambariServices } from '../../config';

const dataState = state => state.data;

export const popupSelector = state => state.app.ui.get('popup');

export const loadingSelector = createSelector(
  dataState,
  (data) => {
    const loaders = Object.keys(data).map(el => data[el].get('isLoading'));
    return !loaders.every(load => load === false);
  },
);

export const sortClusterBy = state => state.app.ui.getIn(['autocorrelations', 'sortClusterBy']);

const ambariState = state => state.app.ui.get('ambariStatus').toJS();

const getNiceNameOfContainer = (containerKey) => {
  if (ambariServices.services[containerKey.toLowerCase()]) {
    return ambariServices.services[containerKey.toLowerCase()].name;
  }

  return containerKey;
};

const getOrderOfContainer = (containerKey) => {
  if (ambariServices.services[containerKey.toLowerCase()]) {
    return ambariServices.services[containerKey.toLowerCase()].order || 0;
  }

  return containerKey;
};

export const ambariStatus = createSelector(
  ambariState,
  state => Object.keys(state).map(key => ({
    'name': getNiceNameOfContainer(key),
    'state': state[key].state || '',
    'running': state[key].running,
    'order': getOrderOfContainer(key),
  })),
);

export const getTime = state => state.app.ui.get('time').toJS();
