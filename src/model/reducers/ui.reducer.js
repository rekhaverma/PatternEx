import { fromJS } from 'immutable';
import {
  SET_CLUSTER,
  SET_PIPELINES,
  SET_POPUP,
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_CLUSTER_SORT_BY,
  AMBARI_GET_STATUSES,
  UPDATE_TIME,
  UPDATE_TIMEZONE,
} from '../actions';
import { TOGGLE_NEW_EVP_PAGE } from '../actions/ui.actions';

const newEVPVisibility = JSON.parse(localStorage.getItem('newEVPVisibility'));

const initialState = fromJS({
  'activeCluster': '',
  'pipelines': [],
  'popup': '',
  'notifications': [],
  'time': {
    'startTime': {},
    'endTime': {},
    'timezone': 'UTC',
  },
  'autocorrelations': {
    'sortClusterBy': 'severity',
  },
  'ambariStatus': {},
  'newEVPVisibility': newEVPVisibility || false,
});

export default (state = initialState, { type, payload }) => {
  const notificationsObj = state.get('notifications');
  switch (type) {
    case SET_CLUSTER:
      return state.set('activeCluster', payload);

    case SET_PIPELINES:
      return state.set('pipelines', fromJS(payload));

    case SET_POPUP:
      return state.set('popup', payload);

    case ADD_NOTIFICATION:
      return state.set('notifications', notificationsObj.push({ ...payload, 'id': `_${Math.random().toString(36).substr(2, 9)}` }));

    case REMOVE_NOTIFICATION:
      return state.set('notifications', notificationsObj.filter(notification => notification.id !== payload.id));

    case UPDATE_CLUSTER_SORT_BY:
      return state.setIn(['autocorrelations', 'sortClusterBy'], fromJS(payload));

    case AMBARI_GET_STATUSES:
      return state.set('ambariStatus', fromJS(payload));

    case UPDATE_TIME:
      return state.setIn(['time', 'startTime'], fromJS(payload.startTime))
        .setIn(['time', 'endTime'], fromJS(payload.endTime));

    case UPDATE_TIMEZONE:
      return state.setIn(['time', 'timezone'], fromJS(payload));

    case TOGGLE_NEW_EVP_PAGE:
      return state.set('newEVPVisibility', fromJS(payload));

    default:
      return state;
  }
};
