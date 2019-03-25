import ptrxREST from 'lib/rest';
import { createURL } from 'lib';

export const FETCH_MODELS = '@@rest/FETCH_MODELS';
export const FETCH_MODELS_COMPLETED = '@@rest/FETCH_MODELS_COMPLETED';
export const FETCH_MODELS_FAILED = '@@rest/FETCH_MODELS_FAILED';

export const CREATE_MODEL = '@@rest/CREATE_MODEL';
export const CREATE_MODEL_COMPLETED = '@@rest/CREATE_MODEL_COMPLETED';
export const CREATE_MODEL_FAILED = '@@rest/CREATE_MODEL_FAILED';

export const FETCH_MODEL_DETAILS = '@@rest/FETCH_MODEL_DETAILS';
export const FETCH_MODEL_DETAILS_COMPLETED = '@@rest/FETCH_MODEL_DETAILS_COMPLETED';
export const FETCH_MODEL_DETAILS_FAILED = '@@rest/FETCH_MODEL_DETAILS_FAILED';

export const MODEL_ACTION = '@@rest/MODEL_ACTION';
export const MODEL_ACTION_COMPLETED = '@@rest/MODEL_ACTION_COMPLETED';
export const MODEL_ACTION_FAILED = '@@rest/MODEL_ACTION_FAILED';

export const RESULT_SUMMARY_ACTION = '@@rest/RESULT_SUMMARY_ACTION';
export const RESULT_SUMMARY_COMPLETED = '@@rest/RESULT_SUMMARY_COMPLETED';
export const RESULT_RTHOURS_SUMMARY_COMPLETED = '@rest/RESULT_RTHOURS_SUMMARY_COMPLETED';
export const RESULT_RTDAY_SUMMARY_COMPLETED = '@rest/RESULT_RTDAY_SUMMARY_COMPLETED';
export const RESULT_SUMMARY_FAILED = '@@rest/RESULT_SUMMARY_FAILED';

export const MODEL_RESET = '@@rest/MODEL_RESET';
export const RESET_RESULTSUMMARY = '@@rest/RESET_RESULTSUMMARY';

export const RETRAIN_MODEL = '@@rest/RETRAIN_MODEL';
export const RETRAIN_MODEL_SUCCESSFUL = '@@rest/RETRAIN_MODEL_SUCCESSFUL';
export const RETRAIN_MODEL_FAILED = '@@rest/RETRAIN_MODEL_FAILED';

export const fetchModels = params => async (dispatch) => {
  dispatch({
    'type': FETCH_MODELS,
    'payload': {},
  });
  const url = createURL(
    'models',
    { ...params },
  );
  try {
    const response = await ptrxREST.get(url);
    dispatch({
      'type': FETCH_MODELS_COMPLETED,
      'payload': response.data,
    });
  } catch (error) {
    dispatch({
      'type': FETCH_MODELS_FAILED,
      'payload': 'Models fetch failed',
    });
  }
};

export const createModel = params => async (dispatch) => {
  dispatch({
    'type': CREATE_MODEL,
    'payload': {},
  });
  try {
    const response = await ptrxREST.post('models/train', params);
    dispatch({
      'type': CREATE_MODEL_COMPLETED,
      'payload': response.data,
    });
  } catch (error) {
    dispatch({
      'type': FETCH_MODELS_FAILED,
      'payload': 'Create model failed',
    });
  }
};

export const fetchModelDetails = (modelName, details) => async (dispatch) => {
  dispatch({
    'type': FETCH_MODEL_DETAILS,
    'payload': {
      'modelDetails': {},
      'requestStatus': {},
    },
  });
  let payload = {};
  try {
    const response = await ptrxREST.get(`models/${modelName}${details ? '?details=true' : ''}`);
    payload = response.data;
  } catch (error) {
    dispatch({
      'type': FETCH_MODEL_DETAILS_FAILED,
      'payload': 'Models details failed',
    });
  }

  dispatch({
    'type': FETCH_MODEL_DETAILS_COMPLETED,
    'payload': payload,
  });
};
/** Model Deploy/UnDeploy/Delete actions
*/

export const modelAction = params => async (dispatch) => {
  dispatch({
    'type': MODEL_ACTION,
    'payload': {},
  });
  try {
    const response = await ptrxREST.post('models/modelstate', params);
    dispatch({
      'type': MODEL_ACTION_COMPLETED,
      'payload': {
        'status': response.data.status,
        'message': response.data.message,
      },
    });
  } catch (error) {
    dispatch({
      'type': MODEL_ACTION_FAILED,
      'payload': (error.response && error.response.data) || 'Model action failed',
    });
  }
};

export const fetchResultSummary = params => async (dispatch) => {
  dispatch({
    'type': RESULT_SUMMARY_ACTION,
    'payload': {},
  });
  try {
    const fetchHoursPerDay = params.fetchHoursPerDay;
    const fetchDayPerMonth = params.fetchDayPerMonth;

    const parameters = params;
    delete parameters.fetchHoursPerDay;
    delete parameters.fetchDayPerMonth;

    const url = createURL(
      'resultsummary',
      { ...parameters },
    );
    const response = await ptrxREST.get(url);
    if (fetchHoursPerDay) {
      dispatch({
        'type': RESULT_RTHOURS_SUMMARY_COMPLETED,
        'payload': response.data,
      });
    } else if (fetchDayPerMonth) {
      dispatch({
        'type': RESULT_RTDAY_SUMMARY_COMPLETED,
        'payload': response.data,
      });
    } else {
      dispatch({
        'type': RESULT_SUMMARY_COMPLETED,
        'payload': response.data,
      });
    }
  } catch (error) {
    dispatch({
      'type': RESULT_SUMMARY_FAILED,
      'payload': {},
    });
  }
};

export const fetchResultSummaryPromise = params => dispatch =>
  new Promise(async (resolve, reject) => {
    dispatch({
      'type': RESULT_SUMMARY_ACTION,
      'payload': {},
    });
    try {
      const url = createURL(
        'resultsummary',
        { ...params },
      );
      const response = await ptrxREST.get(url);
      dispatch({
        'type': RESULT_SUMMARY_COMPLETED,
        'payload': response.data,
      });
      resolve(response.data);
    } catch (error) {
      dispatch({
        'type': RESULT_SUMMARY_FAILED,
        'payload': {},
      });
      reject(error);
    }
  });

export const resetModelState = () => async (dispatch) => {
  dispatch({
    'type': MODEL_RESET,
  });
};

export const clearResultSummary = () => (dispatch) => {
  dispatch({
    'type': RESET_RESULTSUMMARY,
  });
};

export const retrainModel = params => async (dispatch) => {
  dispatch({
    'type': RETRAIN_MODEL,
  });
  try {
    const response = await ptrxREST.post('models/train', params);
    dispatch({
      'type': RETRAIN_MODEL_SUCCESSFUL,
      'payload': response.data,
    });
  } catch (error) {
    dispatch({
      'type': RETRAIN_MODEL_FAILED,
      'payload': 'Model retraining failed',
    });
  }
};
