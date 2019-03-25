import ptrxREST from 'lib/rest';

import { addNotification } from '../ui.actions';

export const FETCH_PERFORMANCE_DATA = '@@rest/FETCH_PERFORMANCE_DATA';
export const FETCH_PERFORMANCE_DATA_COMPLETE = '@@rest/FETCH_PERFORMANCE_DATA_COMPLETE';
export const FETCH_PERFORMANCE_DATA_FAILED = '@@rest/FETCH_PERFORMANCE_DATA_FAILED';

export const fetchPerformanceData = (startTime, endTime, pagination = { 'limit': 1000, 'start': 0 }) =>
  async (dispatch) => {
    try {
      dispatch({ 'type': FETCH_PERFORMANCE_DATA });
      const paramsArr = Object.keys(pagination).map(el => (`&${el}=${pagination[el]}`));
      const response = await ptrxREST.get(`performancedetails?start_time=${startTime}&end_time=${endTime}${''.concat(...paramsArr)}`);

      dispatch({
        'type': FETCH_PERFORMANCE_DATA_COMPLETE,
        'payload': { 'items': response.data.items },
      });
    } catch (err) {
      dispatch(addNotification('error', 'Performance Details fetch failed'));
    }
  };
