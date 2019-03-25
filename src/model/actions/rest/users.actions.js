import { ptrxRESTlocal } from 'lib/rest';

export const FETCH_USER_DETAIL = '@@rest/FETCH_USER_DETAIL';
export const FETCH_USER_DETAIL_COMPLETE = '@@rest/FETCH_USER_DETAIL_COMPLETE';
export const FETCH_USER_DETAIL_FAILED = '@@rest/FETCH_USER_DETAIL_FAILED';

export const getUserDetail = () => async (dispatch) => {
  try {
    dispatch({ 'type': FETCH_USER_DETAIL });
    const response = await ptrxRESTlocal.get('userdetails');
    dispatch({
      'type': FETCH_USER_DETAIL_COMPLETE,
      'payload': response.data.userDetails,
    });
    dispatch({ 'type': FETCH_USER_DETAIL_FAILED });
  } catch (error) {
    dispatch({ 'type': FETCH_USER_DETAIL_FAILED });
    throw error;
  }
};
