import ptrxREST from 'lib/rest';
import { addNotification } from 'model/actions/ui.actions';

import logManagerActions from '../actions';

const beginUpdatingDataSource = payload => ({
  payload,
  type: logManagerActions.UPDATE_DATA_SOURCE_BEGIN_SENDING,
});
const failUpdatingDataSource = payload => ({
  payload,
  type: logManagerActions.UPDATE_DATA_SOURCE_FAIL_SENDING,
});
const completeUpdatingDataSource = payload => ({
  payload,
  type: logManagerActions.UPDATE_DATA_SOURCE_COMPLETE_SENDING,
});

export const updateDataSource = data => async (dispatch) => {
  dispatch(beginUpdatingDataSource(data));
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

    await ptrxREST.post('/log_sources/config/update', { conf: params });

    dispatch(completeUpdatingDataSource(data));
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(addNotification('error', error.response.data));
    }
    dispatch(failUpdatingDataSource(data));
  }
};
