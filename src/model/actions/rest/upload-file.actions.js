import ptrxREST from 'lib/rest';

import { addNotification } from '../ui.actions';

export const UPLOAD_FILE = '@@rest/UPLOAD_FILE';
export const UPLOAD_FILE_SUCCESS = '@@rest/UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_FAILED = '@@rest/UPLOAD_FILE_FAILED';

export const uploadFile = params => async (dispatch) => {
  const formData = new FormData();
  formData.append('log_sources_file', params.file);
  try {
    const res = await ptrxREST.post(`log_sources/${params.logType}`, formData);
    if (res.status >= 200 && res.status < 300) {
      dispatch(addNotification('success', 'File uploaded successfully'));
    } else {
      dispatch(addNotification('error', 'File upload failed'));
    }
  } catch (error) {
    dispatch(addNotification('error', 'File upload failed'));
  }
};
