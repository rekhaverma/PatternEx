import ptrxREST from 'lib/rest';
import { dateFormats } from 'config';
import { dateToRange } from 'lib/decorators';
import summaryActions from '../../actions';
import { addNotification } from '../../../ui.actions';

/**
 * @returns {{type: string}}
 */
const fetchSummary = () => ({ 'type': summaryActions.FETCH_SUMMARY });

/**
 * @returns {{type: string}}
 */
const fetchSummaryChunkComplete = payload => ({ 'type': summaryActions.FETCH_SUMMARY_CHUNK_COMPLETE, 'payload': { ...payload } });

/**
 * @returns {{type: string}}
 */
const fetchSummaryFailed = err => ({ 'type': summaryActions.FETCH_SUMMARY_FAILED, 'payload': err });

/**
 * @param {Object} startDate  Moment instance
 * @param {Object} endDate    Moment instance
 * @return {Thunk}
 */
export const fetchBehaviorSummary = (
  startDate,
  endDate,
) => async (dispatch) => {
  try {
    dispatch(fetchSummary());
    const urls = dateToRange('behaviorsummary?create_time=', startDate, endDate, 'X');

    urls.forEach(async (urlData) => {
      const response = await ptrxREST.get(urlData.url);
      return dispatch(fetchSummaryChunkComplete({
        'items': {
          ...response.data,
          'day_ts': urlData.date,
        },
        'startDate': startDate.format(dateFormats.apiSendFormat),
        'endDate': endDate.format(dateFormats.apiSendFormat),
      }));
    });
  } catch (error) {
    dispatch(fetchSummaryFailed(error));
    dispatch(addNotification('error', 'Fetch behavior summary failed'));
    throw (error);
  }
};
