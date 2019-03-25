import { isSameDate } from 'lib';
import { getTime } from '../selectors/ui.selectors';

export const SET_POPUP = '@@ui/SET_POPUP';
export const ADD_NOTIFICATION = '@@ui/ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = '@@ui/REMOVE_NOTIFICATION';
export const UPDATE_CLUSTER_SORT_BY = '@@ui/UPDATE_CLUSTER_SORT_BY';
export const UPDATE_TIME = '@@ui/UPDATE_TIME';
export const UPDATE_TIMEZONE = '@@ui/UPDATE_TIMEZONE';
export const TOGGLE_NEW_EVP_PAGE = '@@ui/TOGGLE_NEW_EVP_PAGE';

export const setPopup = (name = '') => ({
  'type': SET_POPUP,
  'payload': name,
});

const shouldAddNotification = (notifications, type, content) => {
  let duplicate = false;

  notifications.forEach((element) => {
    if (element.content === content) {
      duplicate = true;
    }
  });

  return duplicate;
};

export const addNotification = (type = '', content = '') => (dispatch, getState) => {
  const notifications = getState().app.ui.get('notifications').toJS();

  if (!shouldAddNotification(notifications, type, content)) {
    dispatch({
      'type': ADD_NOTIFICATION,
      'payload': {
        type,
        content,
      },
    });
  }
};

export const removeNotification = id => ({
  'type': REMOVE_NOTIFICATION,
  'payload': {
    id,
  },
});

export const updateClusterSortBy = value => ({
  'type': UPDATE_CLUSTER_SORT_BY,
  'payload': value,
});

/**
 * Action to update time in redux model
 *
 * @param {Object} startTime  Moment time
 * @param {Object} endTime    Moment time
 */
export const updateTime = (startTime, endTime) => (dispatch, getState) => {
  const time = getTime(getState());

  if (Object.keys(time.startTime).length > 0
    && Object.keys(time.endTime).length > 0) {
    if (!isSameDate(time.startTime, startTime)
      || !isSameDate(time.endTime, endTime)) {
      dispatch({
        'type': UPDATE_TIME,
        'payload': { startTime, endTime },
      });
    }
  } else {
    dispatch({
      'type': UPDATE_TIME,
      'payload': { startTime, endTime },
    });
  }
};

/**
 * Action to update timzone in redux model
 *
 * @param {String} timezone
 */
export const updateTimezone = timezone => ({
  'type': UPDATE_TIMEZONE,
  'payload': timezone,
});

export const toggleNewEVPPage = enabled => ({
  'type': TOGGLE_NEW_EVP_PAGE,
  'payload': enabled,
});
