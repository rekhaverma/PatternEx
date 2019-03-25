import ptrxAmbari from 'lib/rest';
import Ambari from '../classes/ambari-services.class';
import { addNotification } from './ui.actions';

export const AMBARI_GET_STATUSES = '@@ambari/GET_STATUSES';

export const getAmbariStatus = () => (dispatch) => {
  const handleResponse = response => dispatch({
    'type': AMBARI_GET_STATUSES,
    'payload': response,
  });
  Ambari.watchStatus(handleResponse);
};

export const restartZeppelin = () => async (dispatch) => {
  try {
    const response = await ptrxAmbari.get('ambari/restart/zeppelin');
    if (response.data.STATUS === 'SUCCESSFUL') {
      dispatch(addNotification('success', 'Zeppelin restart service request accepted successfully'));
    } else if (response.data.STATUS === 'FAILED') {
      dispatch(addNotification('error', response.data.MESSAGE || 'Zeppelin resatrt service request failed'));
    }
  } catch (error) {
    dispatch(addNotification('error', 'Zeppelin restart service request failed'));
    throw error;
  }
};
