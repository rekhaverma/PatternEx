import ptrxREST from 'lib/rest';
import { addNotification } from 'model/actions/ui.actions';

import logManagerActions from '../actions';

const beginAddingDataSource = () => ({
  type: logManagerActions.ADD_DATA_SOURCE_BEGIN_SENDING,
});
const failAddingDataSource = () => ({
  type: logManagerActions.ADD_DATA_SOURCE_FAIL_SENDING,
});
const completeAddingDataSource = () => ({
  type: logManagerActions.ADD_DATA_SOURCE_COMPLETE_SENDING,
});

export const addDataSource = data => async (dispatch) => {
  dispatch(beginAddingDataSource());
  try {
    const params = {
      ...data,
      'input.template.option': data['input.template'].option,
      'input.template.suboption': data['input.template'].subOption,
      debug: false,
    };
    delete params['input.template'];

    if (data.devicetype) {
      params.filename = data.devicetype;
    }
    if (data.devicesubtype) {
      params.filename = data.devicesubtype;
    }

    await ptrxREST.post('/log_sources/config/add', { conf: params });

    dispatch(completeAddingDataSource());
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(addNotification('error', error.response.data));
    }
    dispatch(failAddingDataSource());
  }
};
