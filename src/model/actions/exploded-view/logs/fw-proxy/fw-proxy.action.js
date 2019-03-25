import { ptrxZeppelin } from 'lib/rest/index';
import Zeppelin from 'model/classes/zeppelin.class';
import { addNotification } from 'model/actions/ui.actions';

import evpActions from '../../actions';
import { getZeppelinDataFromReport, getZeppelinNoteBookReportIdId } from '../../utils';

/**
 * @param data
 * @returns {{type: string, payload: *}}
 */
const setFWLogsData = data => ({ 'type': evpActions.SET_FW_LOGS_DATA, 'payload': data });

/**
 * @param params
 * @returns {Function}
 */
export const getLogsFWProxy = params => async (dispatch) => {
  let payload = [];

  try {
    const notebooks = await ptrxZeppelin('/notebook');
    const entityDetailAnalyticsId = getZeppelinNoteBookReportIdId(notebooks.data.body, 'EntityDetailAnalytics');
    if (!entityDetailAnalyticsId) {
      return dispatch(addNotification('error', 'Unable to get EntityDetailAnalytics report.\n Please contact admin'));
    }

    const reportData = await Zeppelin.getNotebookById(entityDetailAnalyticsId, params);
    payload = getZeppelinDataFromReport(reportData, 6);
  } catch (error) {
    // @todo find a way to handle errors
  }

  return dispatch(setFWLogsData(payload || []));
};
