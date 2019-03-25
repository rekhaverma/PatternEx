import ptrxREST from 'lib/rest';

import performanceActions from '../actions';
import { addNotification } from '../../ui.actions';
import { basicPagination } from '../../dashboard/utils';

/**
 * @returns {{type: string}}
 */
const fetchPerformance = () => ({ 'type': performanceActions.FETCH_PERFORMANCE_DATA });

/**
 * @returns {{type: string}}
 */
const fetchPerformanceComplete = payload => ({
  'type': performanceActions.FETCH_PERFORMANCE_DATA_COMPLETE,
  'payload': { ...payload },
});

/**
 * @returns {{type: string}}
 */
const fetchPerformanceFailed = payload => ({ 'type': performanceActions.FETCH_PERFORMANCE_DATA_FAILED, 'payload': { ...payload } });

export const fetchPerformanceData = (
  startTime,
  endTime,
  pagination = basicPagination,
) =>
  async (dispatch) => {
    try {
      dispatch(fetchPerformance());
      const paramsArr = Object.keys(pagination).map(el => (`&${el}=${pagination[el]}`));
      const response = await ptrxREST.get(`performancedetails?start_time=${startTime}&end_time=${endTime}${''.concat(...paramsArr)}`);

      dispatch(fetchPerformanceComplete({ 'items': response.data.items }));
    } catch (err) {
      dispatch(fetchPerformanceFailed({ 'payload': err }));
      dispatch(addNotification('error', 'Performance Details fetch failed'));
      throw (err);
    }
  };
