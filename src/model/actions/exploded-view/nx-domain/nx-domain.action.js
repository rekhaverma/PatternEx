import { ptrxZeppelin } from 'lib/rest/index';
import Zeppelin from 'model/classes/zeppelin.class';
import { addNotification } from 'model/actions/ui.actions';

import evpActions from '../actions';
import { getZeppelinDataFromReport, getZeppelinNoteBookReportIdId } from '../utils';

/**
 * @param data
 * @returns {{type: string, payload: *}}
 */
const setNXData = data => ({
  'type': evpActions.GET_NX_DOMAINS,
  'payload': data,
});
/**
 * @param params
 * @returns {Function}
 */
export const getNXDomains = params => async (dispatch) => {
  let payload = [];

  try {
    const notebooks = await ptrxZeppelin('/notebook');
    const dgaActivityAnalyticsId = getZeppelinNoteBookReportIdId(notebooks.data.body, 'DgaActivityAnalytics');
    if (!dgaActivityAnalyticsId) {
      return dispatch(addNotification('error', 'Unable to get DgaActivityAnalytics report.\n Please contact admin'));
    }

    const reportData = await Zeppelin.getNotebookById(dgaActivityAnalyticsId, params);
    payload = getZeppelinDataFromReport(reportData, 5);
  } catch (error) {
    // @todo find a way to handle errors
  }

  return dispatch(setNXData(payload || []));
};
