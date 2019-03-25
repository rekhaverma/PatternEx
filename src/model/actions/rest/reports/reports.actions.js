import ptrxREST from 'lib/rest';
import { createURL } from 'lib';
import { addNotification } from 'model/actions/ui.actions';
import reportActions from './actions';

/**
 * Get request- Function to fetch all reports
 */
const fetchReports = () => async (dispatch) => {
  dispatch({
    'type': reportActions.FETCH_REPORTS,
  });
  try {
    const response = await ptrxREST.get('reports');
    if (response.status === 200) {
      dispatch({
        'type': reportActions.FETCH_REPORTS_SUCCESS,
        'payload': response.data.items,
      });
    }
  } catch (e) {
    dispatch(addNotification('error', 'Fetching reports failed'));
    dispatch({
      'type': reportActions.FETCH_REPORTS_FAILED,
    });
    throw e;
  }
};

/**
 * Get request- Function to fetch the result summary
 * based on the report Id.
 *
 * @param {string, object} reportId, parameters
 */
const fetchReportSummary = (id, params, type) => async (dispatch) => {
  const dispatchType = type === 'quarterly' ? reportActions.FETCH_REPORT_SUMMARY_DATES : reportActions.FETCH_REPORT_SUMMARY;
  dispatch({
    'type': dispatchType,
  });
  try {
    const reportSummaryUrl = createURL(`reportsummary/id/${id}`, params);
    const response = await ptrxREST.get(reportSummaryUrl);
    if (response.status === 200) {
      dispatch({
        'type': `${dispatchType}_SUCCESS`,
        'payload': response.data,
      });
    }
  } catch (e) {
    dispatch(addNotification('error', 'Fetching report summary failed'));
    dispatch({
      'type': `${dispatchType}_FAILED`,
    });
    throw e;
  }
};

/**
 * Post request- Function to create the report
 *
 * @param {object} parameters(name<string>, rules<array>, mode<string>, pipeline<string>)
 */
const createReport = params => async (dispatch) => {
  dispatch({
    'type': reportActions.CREATE_NEW_REPORT,
  });
  try {
    const response = await ptrxREST.post('reports', params);
    if (response.status === 201) {
      dispatch({
        'type': reportActions.CREATE_NEW_REPORT_SUCCESS,
        'payload': response.data,
      });
      dispatch(addNotification('success', `${params.name} report created successfully`));
      dispatch(fetchReports());
    } else {
      dispatch(addNotification('error', response.data));
      dispatch({
        'type': reportActions.CREATE_NEW_REPORT_FAILED,
      });
    }
  } catch (e) {
    dispatch(addNotification('error', 'Error in creating new report'));
    dispatch({
      'type': reportActions.CREATE_NEW_REPORT_FAILED,
    });
    throw e;
  }
};

/**
 * Put request- Function to update the report
 * based on the report Id.
 *
 * @param {string, object} reportId, params
 */
const updateReport = (id, params) => async (dispatch) => {
  dispatch({
    'type': reportActions.EDIT_REPORT,
  });
  try {
    const response = await ptrxREST.put(`reports/${id}`, params);
    if (response.status === 201) {
      dispatch({
        'type': reportActions.EDIT_REPORT_SUCCESS,
        'payload': response.data,
      });
      dispatch(addNotification('success', `${params.name} report updated successfully`));
      dispatch(fetchReports());
    }
  } catch (e) {
    dispatch(addNotification('error', 'Error in updating report'));
    dispatch({
      'type': reportActions.EDIT_REPORT_FAILED,
    });
    throw e;
  }
};

/**
 * Delete request- Function to delete the report
 * based on the report Id.
 *
 * @param {string} reportId
 */
const deleteReport = reportId => async (dispatch) => {
  dispatch({
    'type': reportActions.DELETE_REPORT,
  });
  try {
    const response = await ptrxREST.delete(`reports/${reportId}`);
    if (response.status === 204) {
      dispatch({
        'type': reportActions.DELETE_REPORT_SUCCESS,
        'payload': response.data,
      });
      dispatch(addNotification('success', 'Report deleted successfully'));
      dispatch(fetchReports());
    }
  } catch (e) {
    dispatch(addNotification('error', 'Error in deleting report'));
    dispatch({
      'type': reportActions.DELETE_REPORT_FAILED,
    });
    throw e;
  }
};

/**
 * Get request- Function to get the report details
 * based on the report Id.
 *
 * @param {string} reportId
 */
const getReportById = reportId => async (dispatch) => {
  dispatch({
    'type': reportActions.GET_REPORT_BYID,
  });
  try {
    const response = await ptrxREST.get(`reports/${reportId}`);
    if (response.status === 200) {
      dispatch({
        'type': reportActions.GET_REPORT_BYID_SUCCESS,
        'payload': response.data,
      });
    }
  } catch (e) {
    dispatch(addNotification('error', 'Fetching Report failed'));
    dispatch({
      'type': reportActions.GET_REPORT_BYID_FAILED,
    });
    throw e;
  }
};

/**
 * Get request- Function to get the reportResults
 * based on the report Id.
 *
 * @param {string, object} reportId, params
 */
const fetchReportResults = (reportId, params) => async (dispatch) => {
  dispatch({
    'type': reportActions.FETCH_REPORT_RESULTS,
  });
  try {
    const url = createURL(`reportresults/${reportId}`, params);
    const response = await ptrxREST.get(url);
    if (response.status === 200) {
      dispatch({
        'type': reportActions.FETCH_REPORT_RESULTS_SUCCESS,
        'payload': response.data,
      });
    }
  } catch (e) {
    dispatch(addNotification('error', 'Report results failed'));
    dispatch({
      'type': reportActions.FETCH_REPORT_RESULTS_FAILED,
    });
    throw e;
  }
};

/**
 * Get request- Function to get the download URL
 * based on the report Id.
 *
 * @param {string, object} reportId, params
 */
const fetchReportResultsCSV = (reportId, params) => async (dispatch) => {
  dispatch({
    'type': reportActions.FETCH_REPORT_RESULTS_CSV,
  });
  try {
    const url = createURL(`reportresults/${reportId}`, params);
    const response = await ptrxREST.get(url);
    if (response.status === 200) {
      dispatch({
        'type': reportActions.FETCH_REPORT_RESULTS_CSV_SUCCESS,
        'payload': response.data.file_url,
      });
      if (!response.data.file_url) {
        dispatch(addNotification('error', 'No data found'));
      }
    }
  } catch (e) {
    dispatch(addNotification('error', 'Download CSV failed'));
    dispatch({
      'type': reportActions.FETCH_REPORT_RESULTS_CSV_FAILED,
    });
    throw e;
  }
};

/**
 * Dispatching action to reset the keys used for report detail data
 */
const resetReportDetailData = () => (dispatch) => {
  dispatch({
    'type': reportActions.RESET_REPORTS_DETAIL_STATE,
  });
};

const resetDownloadCSV = () => (dispatch) => {
  dispatch({
    'type': reportActions.RESET_DOWNLOAD_CSV,
  });
};

/**
 * On demand report, function hit the post API to start on demand job in the backend
 * @param {string} reportId
 * @param {object} params
 */
const onDemandPost = (reportId, params) => async (dispatch) => {
  dispatch({
    'type': reportActions.ON_DEMAND,
  });
  try {
    const response = await ptrxREST.post(`reportresults/${reportId}/run`, params);
    if (response.status >= 200 && response.status < 300) {
      dispatch({
        'type': reportActions.ON_DEMAND_SUCCESS,
      });
      dispatch(addNotification('success', 'Report\'s job is in progress'));
    } else {
      dispatch({
        type: reportActions.ON_DEMAND_FAILED,
      });
      dispatch(addNotification('error', 'Report\'s job failed to execute'));
    }
  } catch (e) {
    dispatch(addNotification('error', 'Report\'s job failed to execute'));
    dispatch({
      type: reportActions.ON_DEMAND_FAILED,
    });
    throw e;
  }
};

export { fetchReportResults,
  getReportById,
  deleteReport,
  updateReport,
  fetchReports,
  fetchReportSummary,
  createReport,
  fetchReportResultsCSV,
  resetReportDetailData,
  resetDownloadCSV,
  onDemandPost,
};
