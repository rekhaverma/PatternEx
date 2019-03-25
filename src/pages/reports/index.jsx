import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { pick } from 'lodash';
import PropTypes from 'prop-types';
import { nameToPipeline } from 'lib/decorators';
import { Button } from 'components/forms';
import Search from 'components/search';
import Table from 'components/table';
import Loader from 'components/loader/loader-v2.component';
import { fetchReports, getRules, createReport, deleteReport, updateReport, resetReportDetailData } from 'model/actions';
import { formatReports, filterReport, filterEnabledPipelines, formatRules } from 'model/selectors';
import { reportsColumns, formFieldsToValidate } from './constants.jsx';
import { ReportModal } from './containers/reportModal';
import { ReportDetail } from './containers/reportDetail';
import { DeleteReport } from './containers/deleteReport';
import AddEditRuleModal from '../rules/components/AddEditRuleModal';
import './reports.style';

export class Reports extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      'inputValue': '',
      'showAddNewReportModal': false,
      'newReport': {
        'pipeline': 'domain',
        'mode': 'batch',
        'name': '',
        'rules': '',
      },
      'formErrors': {
        'name': '',
        'rules': '',
      },
      'reportNameValid': false,
      'reportRulesValid': false,
      'formValid': false,
      'showDeleteReportModal': false,
      'showEditReportModal': false,
      'showAddRuleModal': false,
      'deleteReportRowData': {},
      'editReportData': {},
      'showReportListing': true,
      'reportDetailData': {},
      'lastOpenedModal': '',
      'showReportModalAfterClosingRules': false,
    };
    this.changeStateValue = this.changeStateValue.bind(this);
    this.createReport = this.createReport.bind(this);
    this.updateAddNewReportFields = this.updateAddNewReportFields.bind(this);
    this.onClosAddNewReport = this.onClosAddNewReport.bind(this);
    this.openDeleteReport = this.openDeleteReport.bind(this);
    this.deleteReport = this.deleteReport.bind(this);
    this.openEditReport = this.openEditReport.bind(this);
    this.updateEditReportFields = this.updateEditReportFields.bind(this);
    this.updateReportCall = this.updateReportCall.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.validateField = this.validateField.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.resetFormState = this.resetFormState.bind(this);
    this.onAddnewRule = this.onAddnewRule.bind(this);
    this.onCloseAddRuleModal = this.onCloseAddRuleModal.bind(this);
  }

  componentDidMount() {
    this.props.fetchReports();
    this.props.fetchRules();
  }

  /**
 * Function to close the add new report modal
 * It re initializes the newReport state variable and
 */
  onClosAddNewReport() {
    const newReport = {
      'pipeline': '',
      'mode': 'batch',
      'name': '',
      'rules': '',
    };
    this.resetFormState();
    this.setState({
      'newReport': {
        ...newReport,
      },
    });
    this.changeStateValue('showAddNewReportModal', false);
  }

  onRowClick(row) {
    const { router } = this.props;
    router.push(`/reportDetail?reportId=${row.id}&pipeline=${row.pipeline_original}`);
  }

  /*
  * Function to reset the report detail state
  */
  onBackClick() {
    this.props.resetReportDetailData();
    this.changeStateValue('showReportListing', true);
  }

  /**
 * Add type of modal to the state
 * and show add new rule option
 * when user clicks on add new rule option
 * @param {string} type
 */
  onAddnewRule(type, showReportModalAfterClosingRules) {
    if (type === 'add') {
      this.setState({
        'lastOpenedModal': type,
        'showAddNewReportModal': false,
        'showReportModalAfterClosingRules': showReportModalAfterClosingRules,
      });
    } else {
      this.setState({
        'lastOpenedModal': type,
        'showEditReportModal': false,
        'showReportModalAfterClosingRules': showReportModalAfterClosingRules,
      });
    }
    this.changeStateValue('showAddRuleModal', true);
  }

  /**
   * Call fetch reports and
   * open the modal from where the
   * add new rule is trigerred
   * using the lastOpenedModal state variable
   */
  onCloseAddRuleModal() {
    const { lastOpenedModal, showReportModalAfterClosingRules } = this.state;
    this.props.fetchRules();
    if (lastOpenedModal === 'add') {
      this.setState({
        'showAddNewReportModal': showReportModalAfterClosingRules,
        'showAddRuleModal': false,
      });
    } else {
      this.setState({
        'showEditReportModal': showReportModalAfterClosingRules,
        'showAddRuleModal': false,
      });
    }
  }

  /**
  * Function to update the editReportData fields
  * on every change in the editReportData modal
  */
  updateEditReportFields(key, value) {
    this.setState(prevState => ({
      'editReportData': {
        ...prevState.editReportData,
        [key]: value,
      },
    }), () => {
      if (formFieldsToValidate.includes(key)) {
        this.validateField(key, value, this.state.editReportData);
      }
    });
  }

  resetFormState() {
    this.setState({
      'formErrors': {
        'name': '',
        'rules': '',
      },
      'reportNameValid': false,
      'reportRulesValid': false,
      'formValid': false,
    });
  }

  validateField(fieldName, value, reportData) {
    const { formErrors } = this.state;
    let { reportNameValid, reportRulesValid } = this.state;
    switch (fieldName) {
      case 'name':
        reportNameValid = (reportData.name.trim() !== '');
        formErrors.name = reportNameValid ? '' : '*Report name is required';
        break;
      case 'rules':
        reportRulesValid = (reportData.rules.length > 0);
        formErrors.rules = reportRulesValid ? '' : '*Select rules to continue';
        break;
      default:
        break;
    }

    this.setState({
      formErrors,
      reportNameValid,
      reportRulesValid,
    }, this.validateForm);
  }

  validateForm() {
    this.setState({
      formValid: this.state.reportNameValid && this.state.reportRulesValid,
    });
  }

  /**
  * Function to update the newReport fields
  * on every change in the newReport modal
  */
  updateAddNewReportFields(key, value) {
    this.setState(prevState => ({
      'newReport': {
        ...prevState.newReport,
        [key]: value,
      },
    }), () => {
      if (formFieldsToValidate.includes(key)) {
        this.validateField(key, value, this.state.newReport);
      }
    });
  }

  /**
  * Function to update the Report
  */
  updateReportCall() {
    const params = pick(this.state.editReportData, ['rules', 'name']);
    params.pipeline = nameToPipeline(params.pipeline || '');
    params.rules = params.rules.split(',');
    this.props.updateReport(this.state.editReportData.id, params);
    this.changeStateValue('showEditReportModal', false);
  }

  /**
  * Function to create new Report
  */
  createReport() {
    const params = this.state.newReport;
    params.rules = params.rules.split(',');
    params.pipeline = nameToPipeline(params.pipeline || '');
    if (params.mode === 'batch') {
      params.pipeline += '_byday';
    }
    delete params.mode;
    this.props.createReport(params);
    this.onClosAddNewReport();
  }

  /**
  * Function to update the state's value
  */
  changeStateValue(key, value) {
    this.setState({
      [key]: value,
    });
  }

  openEditReport(e, row) {
    const params = row;
    this.setState({
      'editReportData': {
        ...params,
        'rules': params.rules.join(','),
        'mode': 'batch',
      },
      'formValid': true,
      'reportNameValid': true,
      'reportRulesValid': true,
    }, this.changeStateValue('showEditReportModal', true));
  }

  /**
  * Function to open delete report modal
  */
  openDeleteReport(e, row) {
    this.setState({
      'deleteReportRowData': row,
    }, this.changeStateValue('showDeleteReportModal', true));
  }

  /**
  * Function to delete report by report id
  */
  deleteReport(reportId) {
    this.props.deleteReportCall(reportId);
    this.changeStateValue('showDeleteReportModal', false);
  }

  render() {
    const { reportsData, isLoading, rules } = this.props;
    const { inputValue,
      showAddNewReportModal,
      newReport,
      deleteReportRowData,
      showDeleteReportModal,
      showEditReportModal,
      editReportData,
      showReportListing,
      reportDetailData,
      formValid,
      formErrors,
      showAddRuleModal } = this.state;
    let data = inputValue !== ''
      ? filterReport({ 'rawReports': reportsData, 'inputValue': inputValue })
      : reportsData;
    data = data.map(el => ({
      ...el,
      'handlers': {
        ...el.handlers,
        'onDelete': (e, row) => {
          e.stopPropagation();
          this.openDeleteReport(e, row);
        },
        'onEdit': (e, row) => {
          e.stopPropagation();
          this.openEditReport(e, row);
        },
      },
    }));
    if (showReportListing) {
      return (
        <section className="reportsLayout">
          {isLoading && <Loader />}
          <div className="reportsLayout__row +center">
            <span className="title">
              <FormattedMessage id="reports.title" />
            </span>
          </div>
          <div className="reportsLayout__row +rightSide">
            <Button className="orangeButton" onClick={() => this.changeStateValue('showAddNewReportModal', true)}>
              <FormattedMessage id="reports.reportModalButton" />
            </Button>
            <Button className="orangeButton" onClick={() => this.onAddnewRule('add', false)}>
              <FormattedMessage id="reports.addNewRule" />
            </Button>
          </div>
          <div className="reportsLayout__row +rightSide">
            <Search
              className="reportSearch"
              inputProps={{
                'placeholder': 'Search..',
                'value': inputValue,
                'onChange': e => this.changeStateValue('inputValue', e.target.value),
              }}
            />
          </div>
          <div className="reportsLayout__row">
            <Table
              className="reportsTable"
              columns={reportsColumns}
              data={data || []}
              pagination
              options={{
                'onRowClick': this.onRowClick,
              }}
              expandableRow={() => null}
              expandComponent={() => null}
            />
          </div>
          {
            showAddNewReportModal &&
            <ReportModal
              onClose={this.onClosAddNewReport}
              pipelines={this.props.pipelines}
              saveDetail={this.createReport}
              rules={rules}
              updateReportFields={this.updateAddNewReportFields}
              data={newReport}
              allowedFields={{
                'name': true,
                'mode': true,
                'pipelines': true,
                'rules': true,
              }}
              title="Create Report"
              formValid={formValid}
              formErrors={formErrors}
              onAddnewRule={() => this.onAddnewRule('add', true)}
            />
          }
          {
            showEditReportModal &&
            <ReportModal
              onClose={() => {
                this.changeStateValue('showEditReportModal', false);
                this.resetFormState();
              }}
              pipelines={this.props.pipelines}
              saveDetail={this.updateReportCall}
              rules={rules}
              updateReportFields={this.updateEditReportFields}
              data={editReportData}
              allowedFields={{
                'name': true,
                'mode': false,
                'pipelines': false,
                'rules': false,
              }}
              title="Edit Report"
              formValid={formValid}
              formErrors={formErrors}
              onAddnewRule={() => this.onAddnewRule('edit', true)}
            />
          }
          {
            showDeleteReportModal &&
            <DeleteReport
              onClose={() => this.changeStateValue('showDeleteReportModal', false)}
              deleteReport={this.deleteReport}
              data={deleteReportRowData}
            />
          }
          {
            showAddRuleModal &&
            <AddEditRuleModal
              onCancel={this.onCloseAddRuleModal}
              type="Add"
              pipelines={this.props.pipelines}
            />
          }
        </section>
      );
    }
    return (
      <div>
        {isLoading && <Loader />}
        <ReportDetail rowData={reportDetailData} onBackClick={this.onBackClick} rules={rules} />
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  'isLoading': (state.data.reports.toJS().isLoading.length !== 0 || state.data.rules.toJS().isLoading.length !== 0),
  'reportsData': formatReports(state),
  'pipelines': filterEnabledPipelines(state),
  'rules': formatRules(state),
});

const mapDispatchToProps = dispatch => ({
  'fetchReports': (...args) => dispatch(fetchReports(...args)),
  'fetchRules': (...args) => dispatch(getRules(...args)),
  'createReport': (...args) => dispatch(createReport(...args)),
  'deleteReportCall': (...args) => dispatch(deleteReport(...args)),
  'updateReport': (...args) => dispatch(updateReport(...args)),
  'resetReportDetailData': (...args) => dispatch(resetReportDetailData(...args)),
});

Reports.propTypes = {
  'reportsData': PropTypes.array.isRequired,
  'isLoading': PropTypes.bool.isRequired,
  'pipelines': PropTypes.array.isRequired,
  'fetchReports': PropTypes.func.isRequired,
  'fetchRules': PropTypes.func.isRequired,
  'rules': PropTypes.array.isRequired,
  'createReport': PropTypes.func.isRequired,
  'deleteReportCall': PropTypes.func.isRequired,
  'updateReport': PropTypes.func.isRequired,
  'resetReportDetailData': PropTypes.func.isRequired,
  'router': PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
