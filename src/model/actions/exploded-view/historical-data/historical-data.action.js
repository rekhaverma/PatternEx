import moment from 'moment';

import ptrxREST from 'lib/rest/index';
import { createURL } from 'lib';
import getEntityTypeByPipeline from 'lib/decorators/pipeline-to-entity-type';
import { dateFormats } from 'config';

import evpActions from '../actions';

/**
 * @param data
 * @returns {{type: string, payload: *}}
 */
const setHistoricalData = data => ({
  'type': evpActions.SET_HISTORICAL_DATA,
  'payload': data,
});

/**
 * @param params
 * @param firstTime
 * @returns {string}
 */
const buildHistoricalUrl = (params, firstTime) => {
  let startTime = moment.utc(params.start_time, dateFormats.mmddyyDash).startOf('day');
  if (firstTime) {
    startTime = startTime.subtract(30, 'days');
  }

  const query = {
    entity_name: params.entity_name,
    entity_type: getEntityTypeByPipeline(params.pipeline),
    pipeline: params.pipeline,
    time_start: startTime.unix(),
    time_end: moment.utc(params.end_time, dateFormats.mmddyyDash).endOf('day').unix(),
  };

  if (params.mode && params.mode !== 'realtime') { // @todo: check with BE team if realtime mode will crash the request
    query.mode = params.mode;
  }

  return createURL('search', query);
};

/**
 * @param params
 * @param firstTime
 * @returns {function(*): *}
 */
export const getHistoricalData = (params, firstTime = false) => async (dispatch) => {
  let payload = [];
  try {
    const response = await ptrxREST.get(buildHistoricalUrl(params, firstTime));
    payload = response.data.items || [];
  } catch (error) {
    // @todo: find a way to handle errors
  }

  return dispatch(setHistoricalData(payload));
};
