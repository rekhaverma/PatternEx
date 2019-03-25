import ptrxREST from 'lib/rest';
import { createURL } from 'lib';

import logManagerActions from '../actions';
import { addNotification } from '../../ui.actions';
import mockData from './mock';

const beginLoadingSummaryData = () => ({
  type: logManagerActions.GET_SUMMARY_DATA_BEGIN_LOADING,
});
const completeLoadingSummaryData = payload => ({
  payload,
  type: logManagerActions.GET_SUMMARY_DATA_COMPLETE_LOADING,
});

const buildAPIUrl = (params) => {
  const query = {
    start_time: params.startDate.unix(),
    end_time: params.endDate.unix(),
  };

  return createURL('/log_sources/monitor', query);
};

export const getSummaryData = params => async (dispatch) => {
  dispatch(beginLoadingSummaryData());
  let payload = mockData.items;

  try {
    const response = await ptrxREST.get(buildAPIUrl(params));
    payload = response.data.items;
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(addNotification('error', error.response.data));
    }
  }

  dispatch(completeLoadingSummaryData(payload));
};
