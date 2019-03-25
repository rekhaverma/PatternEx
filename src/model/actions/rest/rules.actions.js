import ptrxREST from 'lib/rest';
import { addNotification } from '../ui.actions';

export const GET_RULES = '@@rest/GET_RULES';
export const GET_RULES_SUCCESS = '@@rest/GET_RULES_SUCCESS';
export const GET_RULES_FAILED = '@@rest/GET_RULES_FAILED';
export const RESET_RULES_STATE = '@@rest/RESET_RULES_STATE';
export const RESET_RULES_ERROR_STATE = '@@rest/RESET_RULES_ERROR_STATE';

export const GET_RULE_DETAIL = '@@rest/GET_RULE_DETAIL';
export const GET_RULE_DETAIL_SUCCESS = '@@rest/GET_RULE_DETAIL_SUCCESS';
export const GET_RULE_DETAIL_FAILED = '@@rest/GET_RULE_DETAIL_FAILED';

export const UPDATE_RULE = '@@rest/UPDATE_RULE';
export const UPDATE_RULE_SUCCESS = '@@rest/UPDATE_RULE_SUCCESS';
export const UPDATE_RULE_FAILED = '@@rest/UPDATE_RULE_FAILED';

export const ADD_RULE = '@@rest/ADD_RULE';
export const ADD_RULE_SUCCESS = '@@rest/ADD_RULE_SUCCESS';
export const ADD_RULE_FAILED = '@@rest/ADD_RULE_FAILED';

export const DELETE_RULE = '@@rest/DELETE_RULE';
export const DELETE_RULE_SUCCESS = '@@rest/DELETE_RULE_SUCCESS';
export const DELETE_RULE_FAILED = '@@rest/DELETE_RULE_FAILED';

/**
* Get request- Function to get all the rules
* @param fetchForcefully{boolean}
* fetch rules forcefully, this is needed after updating rules.
*/
export const getRules = fetchForcefully => async (dispatch) => {
  dispatch({
    'type': GET_RULES,
  });
  try {
    const response = await ptrxREST.get('rules');
    dispatch({
      'type': GET_RULES_SUCCESS,
      'payload': response.data.items,
    });
    if (fetchForcefully) {
      dispatch({
        'type': RESET_RULES_STATE,
      });
    }
  } catch (e) {
    dispatch({
      'type': GET_RULES_FAILED,
    });
  }
};

/**
 * Get request- Function to get rules
 * based on the rule Id.
 *
 * @param {string} ruleId
 */
export const getRulesById = ruleId => async (dispatch) => {
  dispatch({
    'type': GET_RULE_DETAIL,
  });
  try {
    const response = await ptrxREST.get(`rules/${ruleId}`);
    if (response.status === 200) {
      dispatch({
        'type': GET_RULE_DETAIL_SUCCESS,
        'payload': response.data,
      });
    }
  } catch (e) {
    dispatch({
      'type': GET_RULE_DETAIL_FAILED,
    });
  }
};

/**
 * Put request- Function to add new rule
 * based on the params.
 *
 * @param {object} params
 */
export const addRule = params => async (dispatch) => {
  dispatch({
    'type': ADD_RULE,
  });
  try {
    const response = await ptrxREST.post('rules', params);
    dispatch({
      'type': ADD_RULE_SUCCESS,
      'payload': response.data,
    });
    dispatch(addNotification('success', 'Rule added successfully'));
  } catch (e) {
    dispatch({
      'type': ADD_RULE_FAILED,
      'payload': e.response.data,
    });
    dispatch(addNotification('error', 'Add Rule failed'));
  }
};

/**
 * Put request- Function to update rule
 * based on the rule Id and params.
 *
 * @param {string, object} ruleId, params
 */
export const updateRule = (params, ruleId) => async (dispatch) => {
  dispatch({
    'type': UPDATE_RULE,
  });
  try {
    const response = await ptrxREST.put(`rules/${ruleId}`, params);
    if (response.status === 201) {
      dispatch({
        'type': UPDATE_RULE_SUCCESS,
        'payload': response.data,
      });
      dispatch(addNotification('success', 'Rule updated successfully'));
    }
    if (response.status === 200) {
      dispatch({
        'type': UPDATE_RULE_FAILED,
        'payload': response.data,
      });
      dispatch(addNotification('info', response.data));
    }
  } catch (e) {
    dispatch({
      'type': UPDATE_RULE_FAILED,
      'payload': e.response.data,
    });
    dispatch(addNotification('error', 'Update rule failed'));
  }
};

export const deleteRuleById = ruleId => async (dispatch) => {
  dispatch({
    'type': DELETE_RULE,
  });
  try {
    const response = await ptrxREST.delete(`rules/${ruleId}`);
    dispatch({
      'type': DELETE_RULE_SUCCESS,
    });
    let NotifyData = 'Rule deleted successfully';
    if (response.status === 200) {
      NotifyData = response.data;
    }
    dispatch(addNotification('success', NotifyData));
  } catch (e) {
    dispatch({
      'type': DELETE_RULE_FAILED,
    });
    dispatch(addNotification('error', 'Delete rule failed'));
  }
};

export const resetRule = () => async (dispatch) => {
  dispatch({
    'type': RESET_RULES_STATE,
  });
};

export const resetRuleError = () => async (dispatch) => {
  dispatch({
    'type': RESET_RULES_ERROR_STATE,
  });
};
