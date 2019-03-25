import { fromJS } from 'immutable';
import * as actions from 'model/actions';

const initialState = fromJS({
  'isLoading': false,
  'models': [],
  'modelDetails': {},
  'requestStatus': {},
  'resultSummaryData': {},
  'resultSummaryHoursData': {},
  'resultSummaryRTDayData': {},
});

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.FETCH_MODELS:
    case actions.CREATE_MODEL:
    case actions.MODEL_ACTION:
    case actions.RETRAIN_MODEL:
    case actions.RESULT_SUMMARY_ACTION:
      return state
        .set('requestStatus', fromJS(payload));
    case actions.FETCH_MODEL_DETAILS:
      return state.set('isLoading', true)
        .set('modelDetails', fromJS(payload.modelDetails))
        .set('requestStatus', fromJS(payload.requestStatus));


    case actions.FETCH_MODELS_COMPLETED:
      return state.set('isLoading', fromJS(false))
        .set('models', fromJS(payload.items));
    case actions.FETCH_MODEL_DETAILS_COMPLETED:
      return state.set('isLoading', fromJS(false))
        .set('modelDetails', fromJS(payload));
    case actions.MODEL_ACTION_COMPLETED:
      return state.set('isLoading', fromJS(false))
        .set('requestStatus', fromJS({ 'status': payload.status.toLowerCase(), 'reason': payload.message }));
    case actions.CREATE_MODEL_COMPLETED:
      return state.set('isLoading', false)
        .set('requestStatus', fromJS({ 'status': 'true', 'reason': `${payload.model_name} created successfully` }));

    case actions.CREATE_MODEL_FAILED:
    case actions.MODEL_ACTION_FAILED:
    case actions.FETCH_MODELS_FAILED:
    case actions.FETCH_MODEL_DETAILS_FAILED:
    case actions.RETRAIN_MODEL_FAILED:
    case actions.RESULT_SUMMARY_FAILED:
      return state.set('requestStatus', fromJS({ 'status': 'false', 'reason': payload }));

    case actions.RETRAIN_MODEL_SUCCESSFUL:
      return state.set('isLoading', fromJS(false))
        .set('requestStatus', fromJS({ 'status': 'true', 'reason': `${payload.model_name}: Model training started` }));

    // case actions.RESULT_SUMMARY_ACTION:
    case actions.RESULT_SUMMARY_COMPLETED:
    // case actions.RESULT_SUMMARY_FAILED:
      return state.set('resultSummaryData', fromJS(payload));

    case actions.RESULT_RTHOURS_SUMMARY_COMPLETED:
      return state.set('isLoading', fromJS(false))
        .set('resultSummaryHoursData', fromJS(payload));

    case actions.RESULT_RTDAY_SUMMARY_COMPLETED:
      return state.set('isLoading', fromJS(false))
        .set('resultSummaryRTDayData', fromJS(payload));

    case actions.MODEL_RESET:
      return state.set('requestStatus', fromJS({}));

    case actions.RESET_RESULTSUMMARY:
      return state.set('resultSummaryData', fromJS({}));

    default:
      return state;
  }
};
