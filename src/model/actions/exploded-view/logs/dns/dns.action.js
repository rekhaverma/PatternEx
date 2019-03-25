import { ptrxZeppelin } from 'lib/rest/index';
import Zeppelin from 'model/classes/zeppelin.class';
import { addNotification } from 'model/actions/ui.actions';

import evpActions from '../../actions';
import { getZeppelinDataFromReport, getZeppelinNoteBookReportIdId } from '../../utils';

/**
 * @param data
 * @returns {{type: string, payload: *}}
 */
const setDNSLogsData = data => ({ 'type': evpActions.SET_DNS_LOGS_DATA, 'payload': data });

/**
 * @param params
 * @returns {Function}
 */
export const getLogsDNS = params => async (dispatch) => {
  let payload = [];

  try {
    const notebooks = await ptrxZeppelin('/notebook');
    const dnsExfilAnalysis = getZeppelinNoteBookReportIdId(notebooks.data.body, 'DNSExfillAnalysis');
    if (!dnsExfilAnalysis) {
      return dispatch(addNotification('error', 'Unable to get DNSExfillAnalysis report.\n Please contact admin'));
    }

    const reportData = await Zeppelin.getNotebookById(dnsExfilAnalysis, params);
    payload = getZeppelinDataFromReport(reportData, 2);
  } catch (error) {
    // @todo find a way to handle errors
  }

  return dispatch(setDNSLogsData(payload || []));
};
