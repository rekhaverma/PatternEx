import ptrxREST from 'lib/rest/index';
import { createURL } from 'lib/index';

import evpActions from '../../actions';

/**
 * @returns {{type: string}}
 */
const fetchLogsEDRData = () => ({ 'type': evpActions.GET_EDR_LOGS_DATA });

/**
 * @returns {{type: string}}
 */
const setLogsEDRDataFail = () => ({ 'type': evpActions.GET_EDR_LOGS_DATA_FAILED });

/**
 * @param data
 * @returns {{type: string, payload: *}}
 */
const setLogsEDRDataSuccess = data => ({ 'type': evpActions.GET_EDR_LOGS_DATA_SUCCESS, 'payload': data });

/**
 * @param params
 * @returns {string}
 */
const buildEDRUrl = (params) => {
  const query = {
    entity_name: params.entity_name,
    entity_type: params.entity_type,
    start_date: params.start_date,
    end_date: params.end_date,
  };

  return createURL('log_sources/edr', query);
};

/**
 * @param params
 * @returns {Function}
 */
export const getLogsEDR = params => async (dispatch) => {
  dispatch(fetchLogsEDRData());
  let payload = [];

  try {
    const response = await ptrxREST.get(buildEDRUrl(params));

    payload = response.data;
  } catch (error) {
    return dispatch(setLogsEDRDataFail());
    // @todo find a way to handle errors
  }

  return dispatch(setLogsEDRDataSuccess(payload || []));
};
