import ptrxREST from 'lib/rest';
import { addNotification } from 'model/actions/ui.actions';

import logManagerActions from '../actions';

const beginStoppingDataSource = payload => ({
  payload,
  type: logManagerActions.STOP_DATA_SOURCE_BEGIN_SENDING,
});
const failStoppingDataSource = payload => ({
  payload,
  type: logManagerActions.STOP_DATA_SOURCE_FAIL_SENDING,
});
const completeStoppingDataSource = payload => ({
  payload,
  type: logManagerActions.STOP_DATA_SOURCE_COMPLETE_SENDING,
});

export const stopDataSource = data => async (dispatch) => {
  dispatch(beginStoppingDataSource(data));
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

    await ptrxREST.post('/log_sources/config/stop', { conf: params });

    dispatch(completeStoppingDataSource(data));
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(addNotification('error', error.response.data));
    }
    dispatch(failStoppingDataSource(data));
  }
};
