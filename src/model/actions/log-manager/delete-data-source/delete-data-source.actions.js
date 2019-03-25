import ptrxREST from 'lib/rest';
import { addNotification } from 'model/actions/ui.actions';

import logManagerActions from '../actions';

const beginDeletingDataSource = payload => ({
  payload,
  type: logManagerActions.DELETE_DATA_SOURCE_BEGIN_SENDING,
});
const failDeletingDataSource = payload => ({
  payload,
  type: logManagerActions.DELETE_DATA_SOURCE_FAIL_SENDING,
});
const completeDeletingDataSource = payload => ({
  payload,
  type: logManagerActions.DELETE_DATA_SOURCE_COMPLETE_SENDING,
});

export const deleteDataSource = data => async (dispatch) => {
  dispatch(beginDeletingDataSource(data));
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

    await ptrxREST.post('/log_sources/config/delete', { conf: params });

    dispatch(completeDeletingDataSource(data));
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(addNotification('error', error.response.data));
    }
    dispatch(failDeletingDataSource(data));
  }
};
