import { fromJS } from 'immutable';
import { reportActions } from 'model/actions/rest/reports';

const initialState = fromJS({
  'isLoading': [],
  'reports': [],
  'reportSummary': {},
  'reportDetail': {},
  'reportResults': {},
  'rules': [],
  'ruleDetail': {},
  'reportResultsCSVUrl': '',
  'reportSummaryQuarterlyData': {},
  'reportResultsCompleted': false,
  'reportResultsCsvCompleted': true,
  'reportSummaryCompleted': false,
});

export default (state = initialState, { type, payload }) => {
  const isLoading = state.get('isLoading');
  switch (type) {
    case reportActions.FETCH_REPORTS:
    case reportActions.ON_DEMAND:
      return state
        .set('isLoading', isLoading.push(type));

    case reportActions.FETCH_REPORTS_SUCCESS:
      return state.set('isLoading', isLoading.filterNot(action => action === reportActions.FETCH_REPORTS))
        .set('reports', fromJS(payload));

    case reportActions.FETCH_REPORTS_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === reportActions.FETCH_REPORTS));

    case reportActions.FETCH_REPORT_SUMMARY:
      return state
        .set('reportSummaryCompleted', false);

    case reportActions.FETCH_REPORT_SUMMARY_SUCCESS:
      return state.set('reportSummaryCompleted', true)
        .set('reportSummary', fromJS(payload));

    case reportActions.FETCH_REPORT_SUMMARY_FAILED:
      return state.set('reportSummaryCompleted', true);

    case reportActions.FETCH_REPORT_SUMMARY_DATES_SUCCESS:
      return state.set('reportSummaryQuarterlyData', fromJS(payload));

    case reportActions.CREATE_NEW_REPORT:
      return state
        .set('isLoading', isLoading.push(type));

    case reportActions.CREATE_NEW_REPORT_SUCCESS:
    case reportActions.CREATE_NEW_REPORT_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === reportActions.CREATE_NEW_REPORT));

    case reportActions.DELETE_REPORT:
      return state
        .set('isLoading', isLoading.push(type));

    case reportActions.DELETE_REPORT_SUCCESS:
    case reportActions.DELETE_REPORT_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === reportActions.DELETE_REPORT));

    case reportActions.EDIT_REPORT:
      return state
        .set('isLoading', isLoading.push(type));

    case reportActions.EDIT_REPORT_SUCCESS:
    case reportActions.EDIT_REPORT_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === reportActions.EDIT_REPORT));

    case reportActions.GET_REPORT_BYID:
      return state
        .set('isLoading', isLoading.push(type));

    case reportActions.GET_REPORT_BYID_SUCCESS:
      return state.set('isLoading', isLoading.filterNot(action => action === reportActions.GET_REPORT_BYID))
        .set('reportDetail', fromJS(payload));

    case reportActions.GET_REPORT_BYID_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === reportActions.GET_REPORT_BYID));

    case reportActions.FETCH_REPORT_RESULTS:
      return state
        .set('reportResultsCompleted', false);

    case reportActions.FETCH_REPORT_RESULTS_SUCCESS:
      return state.set('reportResultsCompleted', true)
        .set('reportResults', fromJS(payload));

    case reportActions.FETCH_REPORT_RESULTS_FAILED:
      return state.set('reportResultsCompleted', true)
        .set('reportResults', fromJS({}));

    case reportActions.FETCH_REPORT_RESULTS_CSV:
      return state
        .set('reportResultsCsvCompleted', false);

    case reportActions.FETCH_REPORT_RESULTS_CSV_SUCCESS:
      return state.set('reportResultsCsvCompleted', true)
        .set('reportResultsCSVUrl', payload);

    case reportActions.FETCH_REPORT_RESULTS_CSV_FAILED:
      return state.set('reportResultsCsvCompleted', true);

    case reportActions.RESET_REPORTS_DETAIL_STATE:
      return state
        .set('reportSummary', fromJS({}))
        .set('reportResults', fromJS({}))
        .set('reportResultsCSVUrl', '')
        .set('reportSummaryQuarterlyData', fromJS({}));

    case reportActions.ON_DEMAND_SUCCESS:
    case reportActions.ON_DEMAND_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === reportActions.ON_DEMAND));

    case reportActions.RESET_DOWNLOAD_CSV:
      return state
        .set('reportResultsCSVUrl', '');

    default:
      return state;
  }
};
