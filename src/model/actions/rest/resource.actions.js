import ptrxREST from 'lib/rest';
import { addNotification } from '../ui.actions';

export const GET_RESOURCES = '@@rest/GET_RESOURCES';
export const GET_RESOURCES_SUCCESS = '@@rest/GET_RESOURCES_SUCCESS';
export const GET_RESOURCES_FAILED = '@@rest/GET_RESOURCES_FAILED';
export const RESET_RESOURCES_STATE = '@@rest/RESET_RESOURCES_STATE';
export const RESET_RESOURCES_ERROR_STATE = '@@rest/RESET_RESOURCES_ERROR_STATE';

export const UPDATE_RESOURCE = '@@rest/UPDATE_RESOURCE';
export const UPDATE_RESOURCE_SUCCESS = '@@rest/UPDATE_RESOURCE_SUCCESS';
export const UPDATE_RESOURCE_FAILED = '@@rest/UPDATE_RESOURCE_FAILED';

export const ADD_RESOURCE = '@@rest/ADD_RESOURCE';
export const ADD_RESOURCE_SUCCESS = '@@rest/ADD_RESOURCE_SUCCESS';
export const ADD_RESOURCE_FAILED = '@@rest/ADD_RESOURCE_FAILED';

export const DELETE_RESOURCE = '@@rest/DELETE_RESOURCE';
export const DELETE_RESOURCE_SUCCESS = '@@rest/DELETE_RESOURCE_SUCCESS';
export const DELETE_RESOURCE_FAILED = '@@rest/DELETE_RESOURCE_FAILED';

/**
* Get request- Function to get all the resources
* @param fetchForcefully{boolean}
* fetch resources forcefully, this is needed after updating resources.
*/
export const getResources = fetchForcefully => async (dispatch) => {
  dispatch({
    'type': GET_RESOURCES,
  });
  try {
    const response = await ptrxREST.get('accessresources');
    dispatch({
      'type': GET_RESOURCES_SUCCESS,
      'payload': response.data.items,
    });
    if (fetchForcefully) {
      dispatch({
        'type': RESET_RESOURCES_STATE,
      });
    }
  } catch (error) {
    dispatch({
      'type': GET_RESOURCES_FAILED,
    });
  }
};

/**
 * Post request- Function to add new resource
 * based on the params.
 *
 * @param {object} params
 */
export const addResource = params => async (dispatch) => {
  dispatch({
    'type': ADD_RESOURCE,
  });
  try {
    const response = await ptrxREST.post('accessresources', params);
    dispatch({
      'type': ADD_RESOURCE_SUCCESS,
      'payload': response.data,
    });
    dispatch(addNotification('success', 'Resource added successfully'));
  } catch (error) {
    dispatch({
      'type': ADD_RESOURCE_FAILED,
      'payload': error.response.data,
    });
    dispatch(addNotification('error', 'Add Resource failed'));
  }
};

/**
 * Put request- Function to update resource
 * based on the resource Id and params.
 *
 * @param {string, object} resourceName, params
 */
export const updateResource = (params, resourceName) => async (dispatch) => {
  dispatch({
    'type': UPDATE_RESOURCE,
  });
  try {
    const response = await ptrxREST.put(`accessresources/${resourceName}`, params);
    dispatch({
      'type': UPDATE_RESOURCE_SUCCESS,
      'payload': response.data,
    });
    dispatch(addNotification('success', 'Resource updated successfully'));
  } catch (error) {
    dispatch({
      'type': UPDATE_RESOURCE_FAILED,
      'payload': error.response.data,
    });
    dispatch(addNotification('success', 'Update resource failed'));
  }
};

export const deleteResourceByName = resourceName => async (dispatch) => {
  dispatch({
    'type': DELETE_RESOURCE,
  });
  try {
    await ptrxREST.delete(`accessresources/${resourceName}`);
    dispatch({
      'type': DELETE_RESOURCE_SUCCESS,
    });
    dispatch(addNotification('success', 'Resource deleted successfully'));
  } catch (error) {
    dispatch({
      'type': DELETE_RESOURCE_FAILED,
    });
    dispatch(addNotification('success', 'Delete resource failed'));
  }
};

export const resetResource = () => async (dispatch) => {
  dispatch({
    'type': RESET_RESOURCES_STATE,
  });
};

export const resetErrorResource = () => async (dispatch) => {
  dispatch({
    'type': RESET_RESOURCES_ERROR_STATE,
  });
};
