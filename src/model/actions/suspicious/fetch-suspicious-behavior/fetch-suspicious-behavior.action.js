import suspiciousActions from '../actions';
import { addNotification } from '../../ui.actions';

import { basicPagination, getHash, getItems } from '../../dashboard/utils';

/**
 * @returns {{type: string}}
 */
const fetchSuspicious = () => ({ 'type': suspiciousActions.FETCH_SUSPICIOUS_BEHAVIOR });

/**
 * @returns {{type: string}}
 */
const fetchSuspiciousComplete = payload => ({
  'type': suspiciousActions.FETCH_SUSPICIOUS_BEHAVIOR_COMPLETE,
  'payload': { ...payload },
});

/**
 * @returns {{type: string}}
 */
const fetchSuspiciousFailed = payload => ({ 'type': suspiciousActions.FETCH_SUSPICIOUS_BEHAVIOR_FAILED, 'payload': { ...payload } });

export const fetchSuspiciousBehavior = (
  startTime,
  endTime,
  pagination = basicPagination,
  force = false,
) =>
  async (dispatch, getState) => {
    const hash = getHash(getState, startTime, endTime, 'suspicious', pagination, force);
    const params = Object.keys(pagination).map(el => (`&${el}=${pagination[el]}`));
    if (!hash) {
      return;
    }

    dispatch(fetchSuspicious());

    try {
      const items = await getItems(startTime, endTime, params);
      dispatch(fetchSuspiciousComplete({ 'items': items, 'hash': hash }));
    } catch (error) {
      dispatch(fetchSuspiciousFailed({ 'payload': error }));
      dispatch(addNotification('error', 'Fetch malicious behavior failed'));
      throw (error);
    }
  };
