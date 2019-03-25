import ptrxREST from 'lib/rest';
import { addNotification } from 'model/actions/ui.actions';

import logManagerActions from '../actions';

const beginStartingDataSource = payload => ({
  payload,
  type: logManagerActions.START_DATA_SOURCE_BEGIN_SENDING,
});
const failStartingDataSource = payload => ({
  payload,
  type: logManagerActions.START_DATA_SOURCE_FAIL_SENDING,
});
const completeStartingDataSource = payload => ({
  payload,
  type: logManagerActions.START_DATA_SOURCE_COMPLETE_SENDING,
});

export const startDataSource = data => async (dispatch) => {
  dispatch(beginStartingDataSource(data));
  try {
    const params = { ...data };
    delete params.devicetimezoneLabel;
    delete params.processingLoading;
    delete params.dataSourceStatus;
    delete params.devicecategoryLabel;
    delete params.devicetypeLabel;
    delete params.devicesubtypeLabel;
    delete params.dataSourceDebug;
    delete params.handlers;

    await ptrxREST.post('/log_sources/config/start', { conf: params });

    dispatch(completeStartingDataSource(data));
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(addNotification('error', error.response.data));
    }
    dispatch(failStartingDataSource(data));
  }
};
