import ptrxREST from 'lib/rest';
import { omit } from 'lodash';
import moment from 'moment';
import { dateFormats } from 'config';

export const basicPagination = { 'limit': 1000, 'start': 0 };

const dateRangePagination = async (href, settings, totalCount) => {
  const urls = [];
  const othersParams = omit(settings, ['start', 'limit']);
  const paramsArr = Object.keys(othersParams).map(el => (`&${el}=${settings[el]}`));
  let start = settings.start;

  while (start < totalCount) {
    const limit = settings.limit ? `&limit=${settings.limit}` : '';
    urls.push(`${href}&start=${start}${limit}${''.concat(...paramsArr)}`);
    if ((start + settings.limit) > totalCount) {
      start += totalCount - settings.limit;
    } else {
      start += settings.limit;
    }
  }

  try {
    return await Promise.all(urls.map(async (req) => {
      const response = await ptrxREST.get(req);
      return response.data.items;
    }));
  } catch (error) {
    throw error;
  }
};

export const getUrl = (startTime, endTime, params, addPipeline = false) => {
  if (addPipeline) {
    return `maliciousbehavior?start_time=${startTime}&end_time=${endTime}${params.pipeline
      ? (`&pipeline=${params.pipeline}`) : ''}`;
  }
  return `maliciousbehavior?start_time=${startTime}&end_time=${endTime}${''.concat(...params)}`;
};

export const getItems = async (startTime, endTime, params) => {
  const response = await ptrxREST.get(getUrl(startTime, endTime, params));
  let items = response.data.items;

  if (response.data.totalCount >= response.data.limit) {
    const paginationResponse = await dateRangePagination(
      getUrl(startTime, endTime, params, true),
      { 'limit': 1000, 'start': response.data.limit },
      response.data.totalCount,
    );
    items = paginationResponse.reduce((acc, arr) => acc.concat(arr), items);
  }
  return items;
};

const createHash = (start, end, type, paramsArr) => `${moment(parseInt(start, 10) * 1000).format(dateFormats.YYYYMMDD)}/${moment(parseInt(end, 10) * 1000).format(dateFormats.YYYYMMDD)}#${type}${''.concat(...paramsArr)}`;

export const getHash = (getState, startTime, endTime, behavior, params, force = false) => {
  let hash;
  let reduxItems;

  if (behavior === 'malicious') {
    hash = getState().raw.toJS().maliciousBehaviorHash;
    reduxItems = getState().raw.toJS().maliciousBehavior;
  } else {
    hash = getState().raw.toJS().suspiciousBehaviorHash;
    reduxItems = getState().raw.toJS().suspiciousBehavior;
  }

  const paramsArr = Object.keys(params).map(el => (`&${el}=${params[el]}`));
  const currentHash = createHash(startTime, endTime, behavior, paramsArr);

  if ((hash === currentHash && reduxItems.length > 0) && !force) {
    return false;
  }
  return currentHash;
};
