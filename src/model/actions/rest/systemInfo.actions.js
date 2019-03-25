import ptrxREST, { ptrxRESTlocal } from 'lib/rest';

import { addNotification } from '../ui.actions';

export const FETCH_SYSTEMINFO = '@@rest/FETCH_SYSTEMINFO';
export const FETCH_SYSTEMINFO_COMPLETE = '@@rest/FETCH_SYSTEMINFO_COMPLETE';
export const FETCH_SYSTEMINFO_FAILED = '@@rest/FETCH_SYSTEMINFO_FAILED';

export const UPDATE_SYSTEMINFO = '@@rest/UPDATE_SYSTEMINFO';
export const UPDATE_SYSTEMINFO_COMPLETED = '@@rest/UPDATE_SYSTEMINFO_COMPLETE';
export const UPDATE_SYSTEMINFO_FAILED = '@@rest/UPDATE_SYSTEMINFO_FAILED';
export const RESET_SYSTEMINFO_STATE = '@@rest/RESET_SYSTEMINFO_STATE';

export const FETCH_PRIVILEGES = '@@rest/FETCH_PRIVILEGES';
export const FETCH_PRIVILEGES_COMPLETE = '@@rest/FETCH_PRIVILEGES_COMPLETE';
export const FETCH_PRIVILEGES_FAILED = '@@rest/FETCH_PRIVILEGES_FAILED';

/**
 * @param fetchForcefully{boolean}
 * fetch SystemInfo forcefully, this is needed after updating SystemInfo from setting page
 */
export const fetchSystemInfo = fetchForcefully => async (dispatch) => {
  try {
    dispatch({ 'type': FETCH_SYSTEMINFO });
    const response = await ptrxREST.get('systeminfos');
    let itemWithCustomerId = 0;

    response.data.items.forEach((item, index) => {
      if (item.customer_id) {
        itemWithCustomerId = index;
      }
    });

    dispatch({
      'type': FETCH_SYSTEMINFO_COMPLETE,
      'payload': response.data.items[itemWithCustomerId],
    });
    // resets the state of the update pipelines after forcefully fetching pipelines
    if (fetchForcefully) {
      dispatch({
        'type': RESET_SYSTEMINFO_STATE,
      });
    }
  } catch (error) {
    dispatch({ 'type': FETCH_SYSTEMINFO_FAILED });
    dispatch(addNotification('error', 'Fetch system info failed'));
    throw error;
  }
};

export const updateSystemInfo = (customerId, params) => async (dispatch) => {
  try {
    dispatch({ 'type': UPDATE_SYSTEMINFO });
    await ptrxREST.put(`systeminfos/${customerId}`, params);
    dispatch({
      'type': UPDATE_SYSTEMINFO_COMPLETED,
    });
    dispatch(addNotification('success', 'Updated system info'));
  } catch (error) {
    dispatch({ 'type': UPDATE_SYSTEMINFO_FAILED });
    dispatch(addNotification('error', 'Update system info failed'));
    throw error;
  }
};

export const fetchPrivileges = () => async (dispatch) => {
  try {
    dispatch({ 'type': FETCH_PRIVILEGES });
    const response = await ptrxRESTlocal.get('privileges');
    dispatch({
      'type': FETCH_PRIVILEGES_COMPLETE,
      'payload': response.data.privileges,
    });
  } catch (error) {
    dispatch({ 'type': FETCH_PRIVILEGES_FAILED });
    dispatch(addNotification('error', 'Fetch Privileges failed'));
    throw error;
  }
};
