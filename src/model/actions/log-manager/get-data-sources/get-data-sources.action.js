import ptrxREST from 'lib/rest';

import logManagerActions from '../actions';
import { addNotification } from '../../ui.actions';

const beginGettingDataSourcesConfig = () => ({
  type: logManagerActions.GET_DATA_SOURCES_BEGIN_LOADING,
});
const failGettingDataSourcesConfig = () => ({
  type: logManagerActions.GET_DATA_SOURCES_FAIL_LOADING,
});
const completeGettingDataSourcesConfig = payload => ({
  payload,
  type: logManagerActions.GET_DATA_SOURCES_COMPLETE_LOADING,
});

export const getDataSources = () => async (dispatch) => {
  dispatch(beginGettingDataSourcesConfig());
  let payload = [];

  try {
    const response = await ptrxREST.get('/log_sources/config/current');
    payload = response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(addNotification('error', error.response.data));
    }
    dispatch(failGettingDataSourcesConfig());
  }

  dispatch(completeGettingDataSourcesConfig(payload));
};
