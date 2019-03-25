import moment from 'moment';
import { dateFormats } from 'config';
import { createURL } from 'lib';
import ptrxREST from 'lib/rest';
import evpActions from '../actions';

/*
 * @param params
 * @returns {string}
 */
const buildDHCPDataUrl = (params) => {
  const query = {
    ip: params.entity_name,
    date: moment.utc(params.end_time).format(dateFormats.apiSendFormat),
  };

  return createURL('entity/info', query);
};

export const getDHCPData = params => async (dispatch) => {
  try {
    dispatch({
      'type': evpActions.GET_DHCP_DATA,
    });

    const response = await ptrxREST.get(buildDHCPDataUrl(params));

    dispatch({
      'type': evpActions.GET_DHCP_DATA_SUCCESS,
      'payload': response.data && response.data.ip_address_info && response.data.ip_address_info.host_name,
    });
  } catch (error) {
    dispatch({
      'type': evpActions.GET_DHCP_DATA_FAILED,
    });
  }
};
