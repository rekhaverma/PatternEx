import ptrxREST from 'lib/rest';

import logManagerActions from '../actions';
import { addNotification } from '../../ui.actions';

const beginGettingDataConfig = () => ({
  type: logManagerActions.GET_DATA_CONFIG_BEGIN_LOADING,
});
const completeGettingDataConfig = payload => ({
  payload,
  type: logManagerActions.GET_DATA_CONFIG_COMPLETE_LOADING,
});

export const getConfigData = () => async (dispatch) => {
  dispatch(beginGettingDataConfig());
  let payload = [];

  try {
    const response = await ptrxREST.get('/log_sources/config/all');
    payload = response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(addNotification('error', error.response.data));
    }
  }

  dispatch(completeGettingDataConfig(payload));
};
