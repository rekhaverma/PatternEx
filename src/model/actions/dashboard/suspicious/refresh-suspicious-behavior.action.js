import { isSameArray } from 'lib';
import suspiciousActions from '../actions';

import { addNotification } from '../../ui.actions';

import { basicPagination, getHash, getItems } from '../utils';

/**
 * @returns {{type: string}}
 */
const refreshSuspicious = () => ({ 'type': suspiciousActions.REFRESH_SUSPICIOUS_BEHAVIOR });

/**
 * @returns {{type: string}}
 */
const refreshSuspiciousComplete = payload => ({
  'type': suspiciousActions.REFRESH_SUSPICIOUS_BEHAVIOR_COMPLETE,
  'payload': { ...payload },
});

/**
 * @returns {{type: string}}
 */
const refreshSuspiciousFailed = payload => ({ 'type': suspiciousActions.REFRESH_SUSPICIOUS_BEHAVIOR_FAILED, 'payload': { ...payload } });

export const refreshSuspiciousBehavior = (
  startTime,
  endTime,
  pagination = basicPagination,
  force = false,
) =>
  async (dispatch, getState) => {
    const reduxItems = getState().raw.toJS().maliciousBehavior;
    const params = Object.keys(pagination).map(el => (`&${el}=${pagination[el]}`));
    const hash = getHash(getState, startTime, endTime, 'suspicious', pagination, force);
    if (!hash) {
      return;
    }

    dispatch(refreshSuspicious());
    try {
      const items = await getItems(startTime, endTime, params);

      if (!isSameArray(reduxItems, items)) {
        dispatch(refreshSuspiciousComplete({ 'items': items, 'hash': hash }));
        dispatch(addNotification('success', 'Suspicious data is refreshed'));
      } else {
        dispatch(refreshSuspiciousComplete({}));
        dispatch(addNotification('success', 'No new Suspicious data is available'));
      }
    } catch (error) {
      dispatch(refreshSuspiciousFailed(error));
      dispatch(addNotification('error', 'Fetch suspicious behavior failed'));
    }
  };
