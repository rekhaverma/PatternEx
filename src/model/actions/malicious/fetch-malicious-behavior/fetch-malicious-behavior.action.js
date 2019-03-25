import maliciousActions from '../actions';
import { addNotification } from '../../ui.actions';

import { basicPagination, getHash, getItems } from '../../dashboard/utils';

/**
 * @returns {{type: string}}
 */
const fetchMalicious = () => ({ 'type': maliciousActions.FETCH_MALICIOUS_BEHAVIOR });

/**
 * @returns {{type: string}}
 */
const fetchMaliciousComplete = payload => ({
  'type': maliciousActions.FETCH_MALICIOUS_BEHAVIOR_COMPLETE,
  'payload': { ...payload },
});

/**
 * @returns {{type: string}}
 */
const fetchMaliciousFailed = payload => ({ 'type': maliciousActions.FETCH_MALICIOUS_BEHAVIOR_FAILED, 'payload': { ...payload } });

export const fetchMaliciousBehavior = (
  startTime,
  endTime,
  pagination = basicPagination,
  force = false,
) =>
  async (dispatch, getState) => {
    const hash = getHash(getState, startTime, endTime, 'malicious', pagination, force);
    const params = Object.keys(pagination).map(el => (`&${el}=${pagination[el]}`));
    if (!hash) {
      return;
    }

    dispatch(fetchMalicious());

    try {
      const items = await getItems(startTime, endTime, params);
      dispatch(fetchMaliciousComplete({ 'items': items, 'hash': hash }));
    } catch (error) {
      dispatch(fetchMaliciousFailed({ 'payload': error }));
      dispatch(addNotification('error', 'Fetch malicious behavior failed'));
      throw (error);
    }
  };
