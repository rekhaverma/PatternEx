import { isSameArray } from 'lib';
import maliciousActions from '../actions';

import { addNotification } from '../../ui.actions';

import { basicPagination, getHash, getItems } from '../utils';

/**
 * @returns {{type: string}}
 */
const refreshMalicious = () => ({ 'type': maliciousActions.REFRESH_MALICIOUS_BEHAVIOR });

/**
 * @returns {{type: string}}
 */
const refreshMaliciousComplete = payload => ({
  'type': maliciousActions.REFRESH_MALICIOUS_BEHAVIOR_COMPLETE,
  'payload': { ...payload },
});

/**
 * @returns {{type: string}}
 */
const refreshMaliciousFailed = payload => ({ 'type': maliciousActions.REFRESH_MALICIOUS_BEHAVIOR_FAILED, 'payload': { ...payload } });

export const refreshMaliciousBehavior = (
  startTime,
  endTime,
  pagination = basicPagination,
  force = false,
) =>
  async (dispatch, getState) => {
    const reduxItems = getState().raw.toJS().maliciousBehavior;
    const hash = getHash(getState, startTime, endTime, 'malicious', pagination, force);
    const params = Object.keys(pagination).map(el => (`&${el}=${pagination[el]}`));
    if (!hash) {
      return;
    }

    dispatch(refreshMalicious());

    try {
      const items = await getItems(startTime, endTime, params);

      if (!isSameArray(reduxItems, items)) {
        dispatch(refreshMaliciousComplete({ 'items': items, 'hash': hash }));
        dispatch(addNotification('success', 'Malicious data is refreshed'));
      } else {
        dispatch(refreshMaliciousComplete({}));
        dispatch(addNotification('success', 'No new Malicious data is available'));
      }
    } catch (error) {
      dispatch(refreshMaliciousFailed({ 'payload': error }));
      dispatch(addNotification('error', 'Refresh malicious behavior failed'));
      throw (error);
    }
  };
