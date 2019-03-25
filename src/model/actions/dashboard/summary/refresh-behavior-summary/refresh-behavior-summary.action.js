import ptrxREST from 'lib/rest';

import { isEqual } from 'lodash';

import { dateFormats } from 'config';
import { dateToRange } from 'lib/decorators';
import summaryActions from '../../actions';
import { addNotification } from '../../../ui.actions';

/**
 * @returns {{type: string}}
 */
const refreshSummary = () => ({ 'type': summaryActions.REFRESH_SUMMARY });

/**
 * @returns {{type: string}}
 */
const refreshSummaryChunkComplete = payload => ({ 'type': summaryActions.REFRESH_SUMMARY_CHUNK_COMPLETE, 'payload': { ...payload } });

/**
 * @returns {{type: string}}
 */
const refreshSummaryFailed = err => ({ 'type': summaryActions.REFRESH_SUMMARY_FAILED, 'payload': err });

/**
 * @param {Object} startDate  Moment instance
 * @param {Object} endDate    Moment instance
 * @return {Thunk}
 */
export const refreshBehaviorSummary = (
  startDate,
  endDate,
) => async (dispatch, getState) => {
  const summaryData = getState().raw.toJS().behaviorSummary;

  try {
    dispatch(refreshSummary());
    const urls = dateToRange('behaviorsummary?create_time=', startDate, endDate, 'X');

    urls.forEach(async (urlData) => {
      const response = await ptrxREST.get(urlData.url);

      /* RS-4532 find data from behaviorSummary with same date and compare it with response. */
      const summaryItem = summaryData.find(summary =>
        summary.day_ts === urlData.date);

      response.data = Object.assign({}, response.data, { day_ts: urlData.date });

      if (!isEqual(summaryItem, response.data)) {
        return dispatch(refreshSummaryChunkComplete({
          'items': {
            ...response.data,
            'day_ts': urlData.date,
          },
          'startDate': startDate.format(dateFormats.apiSendFormat),
          'endDate': endDate.format(dateFormats.apiSendFormat),
        }));
      }
      return dispatch(refreshSummaryChunkComplete({}));
    });
  } catch (error) {
    dispatch(refreshSummaryFailed(error));
    dispatch(addNotification('error', 'Fetch behavior summary failed'));
    throw (error);
  }
};
