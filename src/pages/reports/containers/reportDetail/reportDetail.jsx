import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { routerActions } from 'react-router-redux';

import { getEntityTypeByPipeline } from 'lib/decorators';
import Loader from 'components/loader/loader-v2.component';
import Tooltip from 'components/tooltip';
import BarChartDiagram from 'components/d3-bar-chart';
// RS-4379 Hiding piechart and grouped bar chart for the time
// import GroupedBarChart from 'components/d3-grouped-bar-chart';
// import DonutChart from 'components/d3-donut-chart';
import DateRange from 'components/date-range';
import Table from 'components/table';
import { Button } from 'components/forms';
import { createURL } from 'lib';
import { EvpOpenMethods } from 'model/classes/evp-open-methods';
import LoaderSmall from 'components/loader/loader-small.component';
import { filterRulesToShow, getAvailableDates, getFormattedChartData, handleListingData, formatRules, cleanPipeline } from 'model/selectors';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { fetchReportSummary, fetchReportResults, fetchColumnFormat, fetchReportResultsCSV, getReportById, getRules, onDemandPost, resetDownloadCSV } from 'model/actions';
import { goBackUrl } from 'model/actions/exploded-view.actions';
import intlMessages from '../../i18n/en.js';
import dashboardIntlMessages from '../../../dashboard/i18n/en';
import { ViewDetail } from '../viewDetail';
import { OnDemand } from '../onDemand';
import './reportDetail.scss';

const checkIfBatch = (pipeline = '') => pipeline.includes('_byday');

const getEntityName = (data, selectedPipeline) => {
  switch (selectedPipeline) {
    case 'sip':
      return data.srcip;

    case 'dip':
      return data.dstip;

    case 'domain':
      return data.domain;

    case 'sipdip':
      return `${data.srcip} ${data.dstip}`;

    case 'sipdomain':
      return `${data.srcip} ${data.domain}`;

    case 'useraccess':
      return data.user;

    case 'request':
      return `${data.source_ip} ${data.uid}`;

    case 'hpa':
      return data.ipv4;

    default:
      return '';

    // TODO for lgin and vpn pipeline. pending from backend.
  }
};

export class ReportDetail extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'time': {
        'startTime': moment.utc().subtract(7, 'days'),
        'endTime': moment.utc(),
      },
      'realTime': {
        'startTime': moment.utc().subtract(2, 'h').minutes(0),
        'endTime': moment.utc().minutes(0),
      },
      'showViewDetails': false,
      'barChartData': [],
      // 'pieChartData': [], RS-4379 Hiding piechart and grouped bar chart for the time
      // 'stackedBarChartData': [],
      'pieMaxSlice': 10,
      'chartWidth': 700,
      'isBatch': true,
      'pageSize': 20,
      'currentPage': 1,
      'showOnDemandModal': false,
    };
    this.changeStateValue = this.changeStateValue.bind(this);
    this.handleReportDetail = this.handleReportDetail.bind(this);
    this.handleChartData = this.handleChartData.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.onMonthChange = this.onMonthChange.bind(this);
    this.getTimeBasedOnMode = this.getTimeBasedOnMode.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
    this.onDemandApply = this.onDemandApply.bind(this);
  }

  componentWillMount() {
    this.props.fetchRules();
  }

  componentDidMount() {
    const { location, router } = this.props;
    const { reportId, pipeline, startTime, endTime } = location.query;
    if (!reportId || !pipeline) {
      router.push('/reports');
    }
    const isBatch = checkIfBatch(pipeline);
    const stateValues = {
      'chartWidth': this.barChart.offsetWidth,
      'reportId': reportId,
      'isBatch': isBatch,
    };
    const timeKey = isBatch ? 'time' : 'realTime';
    if (startTime
      && endTime
      && !isNaN(startTime)
      && !isNaN(endTime)
      && (parseInt(endTime, 10) >= parseInt(startTime, 10))) {
      stateValues[timeKey] = {
        'startTime': moment.utc(startTime, 'X'),
        'endTime': moment.utc(endTime, 'X'),
      };
    }
    this.props.getReportById(reportId);
    this.props.fetchColumnFormat(cleanPipeline(pipeline));
    this.setState(Object.assign({}, stateValues), () => {
      this.handleReportDetail();
      const time = this.getTimeBasedOnMode();
      if (isBatch) {
        this.onMonthChange(time.endTime);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.handleChartData(nextProps);
    const { router } = this.props;
    if (!nextProps.isLoading && Object.keys(nextProps.reportDetail).length < 1) {
      router.push('/reports');
    }
  }

  onRowClick(row) {
    const { isOldEVPActive, handleExplodedView } = this.props;
    const { isBatch } = this.state;
    const pipeline = cleanPipeline(this.props.reportDetail.pipeline);
    const rowData = row;
    const entityName = getEntityName(row, pipeline);
    const entityType = getEntityTypeByPipeline(pipeline);
    let time = null;
    if (isBatch) {
      time = {
        'start_time_moment': moment.utc(row.day_ts_original),
        'end_time_moment': moment.utc(row.day_ts_original),
        'start_time': moment.utc(row.day_ts_original),
        'end_time': moment.utc(row.day_ts_original),
      };
    } else {
      time = {
        'start_time_moment': moment.utc(row.minute_ts),
        'end_time_moment': moment.utc(row.minute_ts),
        'start_time': moment.utc(row.minute_ts),
        'end_time': moment.utc(row.minute_ts),
      };
    }
    const params = {
      ...rowData,
      ...time,
      'pipeline': pipeline,
      'entity_name': entityName,
      'entity_type': entityType,
      'model_type': 'classifier', // model_type will be classifier only in case of report detail's entity
    };
    EvpOpenMethods.onRowClickHandler(params, 'reports', isOldEVPActive, handleExplodedView);
  }

  /*
  * Handling disable dates using
  * reportSummary API
  */
  onMonthChange(startDate) {
    const momentTime = moment.utc(startDate).startOf('month');
    const id = this.props.location.query.reportId;
    if (this.state.isBatch) {
      this.props.fetchReportSummary(id, {
        'start_time': momentTime.subtract(1, 'month').unix(),
        'end_time': momentTime.add(3, 'month').unix(),
        'mode': this.state.isBatch ? 'batch' : 'realtime',
      }, 'quarterly');
    }
  }

  onDemandApply(params) {
    const { reportId } = this.state;
    this.props.onDemandPost(reportId, params);
    this.changeStateValue('showOnDemandModal', false);
  }

  getTimeBasedOnMode() {
    const { isBatch, time, realTime } = this.state;
    if (isBatch) {
      return {
        'startTime': time.startTime.startOf('day'),
        'endTime': time.endTime.startOf('day'),
      };
    }
    return {
      'startTime': realTime.startTime,
      'endTime': realTime.endTime,
    };
  }

  handlePagination(nextPage, itemsInPage) {
    const { reportId } = this.state;
    const { startTime, endTime } = this.getTimeBasedOnMode();
    const start = (nextPage - 1) * itemsInPage;
    const limit = itemsInPage;

    const resultsParams = {
      'time_start': startTime.format('X'),
      'time_end': endTime.format('X'),
      start,
      limit,
    };
    this.changeStateValue('currentPage', nextPage);
    this.props.fetchReportResults(reportId, resultsParams);
    this.props.fetchReportResultsCSV(reportId, {
      ...resultsParams,
      'csv_download': true,
    });
  }

  downloadCSV() {
    const { reportId } = this.state;
    const { startTime, endTime } = this.getTimeBasedOnMode();
    const resultsParams = {
      'time_start': startTime.format('X'),
      'time_end': endTime.format('X'),
      'csv_download': true,
    };
    this.props.fetchReportResultsCSV(reportId, resultsParams);
  }

  /*
  * Reseting filters to the initial state
  */
  resetFilters() {
    this.setState({
      'time': {
        'startTime': moment.utc().subtract(7, 'days'),
        'endTime': moment.utc(),
      },
      'realTime': {
        'startTime': moment.utc().minutes(0),
        'endTime': moment.utc().add(2, 'h').minutes(0),
      },
    }, () => {
      this.props.resetDownloadCSV();
      this.handleReportDetail();
    });
  }

  /**
  * Function to update the state's value
  */
  changeStateValue(key, value) {
    this.setState({
      [key]: value,
    });
  }

  /*
  * handleReportDetail will fetch resultSummary,
  * columnFormat, reportResults download URL and reportResults data.
  */
  handleReportDetail() {
    this.setState({
      'currentPage': 1,
    }, () => {
      const { reportId, pageSize } = this.state;
      const { startTime, endTime } = this.getTimeBasedOnMode();
      const mode = this.state.isBatch ? 'batch' : 'realtime';
      const summaryParams = {
        'start_time': startTime.format('X'),
        'end_time': endTime.format('X'),
        'mode': mode,
      };
      if (mode === 'realtime') {
        summaryParams.start_time = moment.utc(startTime, 'X').startOf('day').format('X');
        summaryParams.end_time = moment.utc(endTime, 'X').endOf('day').format('X');
      }
      const resultsParams = {
        'time_start': startTime.format('X'),
        'time_end': endTime.format('X'),
        'limit': pageSize,
      };
      this.props.fetchReportSummary(reportId, summaryParams);
      this.props.fetchReportResults(reportId, resultsParams);
      this.props.resetDownloadCSV();
    });
  }

  /*
  * Update the state with the startDate and endDate
  * based on the mode.
  */
  handleDateChange(startDate, endDate) {
    let key = '';
    const { location } = this.props;
    if (this.state.isBatch) {
      key = 'time';
    } else {
      key = 'realTime';
    }
    const utcStartDate = !startDate.isUTC() ? moment.utc(startDate) : startDate;
    const utcEndDate = !endDate.isUTC() ? moment.utc(endDate) : endDate;

    const nextLocation = createURL(
      location.pathname,
      { ...location.query, 'startTime': utcStartDate.format('X'), 'endTime': utcEndDate.format('X') },
    );
    // this.props.updateLocation(nextLocation);
    this.setState({
      [key]: {
        'startTime': utcStartDate,
        'endTime': utcEndDate,
      },
    }, () => this.props.updateLocation(nextLocation));
  }

  /*
  * Handling chart data using tags and report Summary
  */
  handleChartData(props) {
    const { tags, reportSummary } = props;
    const time = this.getTimeBasedOnMode();
    const mode = this.state.isBatch ? 'batch' : 'realtime';
    if (Object.keys(tags).length && reportSummary.items && reportSummary.items.length) {
      const chartDataParams = getFormattedChartData({
        'allTags': tags,
        'timeRange': time,
        'reportSummaryData': reportSummary,
        'mode': mode,
      });
      this.setState(chartDataParams);
    } else {
      this.setState({
        'barChartData': [],
        // 'pieChartData': [], RS-4379 Hiding piechart and grouped bar chart for the time
        // 'stackedBarChartData': [],
      });
    }
  }

  render() {
    const { reportResultsCSVUrl,
      reportDetail,
      rules,
      availableDates,
      listingData,
      router,
      reportSummaryCompleted,
      reportResultsCompleted,
      reportResultsCsvCompleted,
      totalDataCount,
      isLoading,
    } = this.props;
    // RS-4379 Hiding piechart and grouped bar chart for the time
    const { isBatch,
      showViewDetails,
      pieMaxSlice,
      chartWidth,
      barChartData,
      currentPage,
      pageSize,
      showOnDemandModal,
    } = this.state; // stackedBarChartData barChartData pieChartData colorArr
    const { startTime,
      endTime } = this.getTimeBasedOnMode();
    let tableSection = null;
    let barChartDataHeader;
    if (isBatch) {
      barChartDataHeader = `No of Entities - from ${moment.utc(startTime).format('YYYY-MM-DD')} to ${moment.utc(endTime).format('YYYY-MM-DD')}`;
    } else {
      barChartDataHeader = `No of Entities - ${moment(startTime).format('YYYY-MM-DD')} (24 hours)`;
    }
    const noDataText = (
      <span className="reportDetail__heading">
        <FormattedMessage
          id="reports.noDataFound"
        />
      </span>
    );
    let downloadSection;
    const reportName = reportDetail.name || ' ';
    const filteredRulesForDetails = filterRulesToShow({ 'allRules': rules, 'selectedRules': reportDetail.rules });
    if (listingData && listingData.columns.length > 0 && listingData.items.length > 0) {
      tableSection = (
        <Table
          className="reportDetailTable"
          columns={listingData.columns}
          data={listingData.items || []}
          pagination
          options={{
            'onRowClick': this.onRowClick,
            'hidePageListOnlyOnePage': true,
            'sizePerPage': pageSize,
            'pageList': currentPage,
            'page': currentPage,
            'onPageChange': this.handlePagination,
            'onSizePerPageList': newPageSize => this.changeStateValue('pageSize', newPageSize),
            'sizePerPageList': [{
              'text': '10', 'value': 10,
            }, {
              'text': '20', 'value': 20,
            }, {
              'text': '30', 'value': 30,
            }, {
              'text': '50', 'value': 50,
            }],
          }}
          expandableRow={() => null}
          expandComponent={() => null}
          fetchInfo={{
            'dataTotalSize': totalDataCount,
          }}
          enableRemote
        />
      );
    } else {
      tableSection = noDataText;
    }
    if (reportResultsCSVUrl !== '') {
      downloadSection = (
        <a
          className="button--success +small downloadUrl"
          href={reportResultsCSVUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="icon-download" />
          <FormattedMessage
            id="reports.downloadCSV"
          />
        </a>
      );
    } else {
      downloadSection = (
        <Button
          className="button--success +small"
          onClick={this.downloadCSV}
        >
          <span className="icon-download file-download" />
          <FormattedMessage
            id="reports.download"
          />
        </Button>
      );
    }
    return (
      <IntlProvider locale="en" messages={{ ...intlMessages, ...dashboardIntlMessages }}>
        <section className="reportDetail">
          {isLoading && <Loader />}
          <div className="reportDetail__row +center">
            <span className="reportDetail__heading">
              <FormattedMessage
                id="reports.reportDetail.title"
                values={{
                  'reportDetailTitle': reportName,
                }}
              />
            </span>
          </div>
          <div className="reportDetail__row +spaceBetween">
            <span className="reportDetail__backButton" onClick={() => router.push('/reports')}>
              <span className="icon-chevron-left" />
              <FormattedMessage
                id="reports.viewDetail.backButtonText"
              />
            </span>
            <div className="reportDetail__row +center">
              {
                isBatch && <DateRange
                  disableDays
                  startDate={startTime}
                  endDate={endTime}
                  updateDateRange={this.handleDateChange}
                  onMonthChange={this.onMonthChange}
                  enableDates={availableDates}
                  theme="row"
                  showHoursList={false}
                  activeOption="customRange"
                  allowEnableDatesHours
                />
              }
              {
                !isBatch && <DateRange
                  disableDays
                  updateDateRange={this.handleDateChange}
                  endDate={endTime}
                  startDate={startTime}
                  enableDates={availableDates}
                  className="dateRange"
                  type="daily"
                  activeOption="daily"
                />
              }
              <Button
                className="button--success +small"
                onClick={this.handleReportDetail}
              >
                <FormattedMessage
                  id="reports.apply"
                />
              </Button>
              <Button
                className="button--dark +small"
                onClick={this.resetFilters}
              >
                <FormattedMessage
                  id="reports.reset"
                />
              </Button>
            </div>
            <div className="reportDetail__row +center ">
              {reportResultsCsvCompleted
                ? downloadSection
                : (
                  <div className="reportDetail__downloadLoader">
                    <LoaderSmall />
                  </div>
                )
              }
              <Button
                className="button--dark +small"
                onClick={() => this.changeStateValue('showViewDetails', true)}
              >
                <FormattedMessage
                  id="reports.detail.viewDetail"
                />
              </Button>
              <span>
                <Tooltip
                  trigger={(
                    <span
                      className="icon-retrain"
                      onClick={() => this.changeStateValue('showOnDemandModal', true)}
                    />
                  )}
                  position="bottom"
                >
                  <FormattedMessage id="reports.onDemandHeading" />
                </Tooltip>
              </span>
            </div>
          </div>
          <div className="reportDetail__row" >
            <div className="reportDetail__row reportDetail__subheading">
              <b>Number of Entities</b>
            </div>
          </div>
          <div className="reportDetail__row" ref={(input) => { this.barChart = input; }}>
            <div className={`barChart ${!reportSummaryCompleted ? 'reportDetail__loading' : ''}`} >
              {reportSummaryCompleted
                ? (
                  <div>
                    {barChartData.length < 1 && noDataText}
                    <BarChartDiagram
                      items={barChartData}
                      header={barChartDataHeader}
                      yAxisText="Count"
                      maxSlice={pieMaxSlice}
                      config={{ 'svgHeight': 300, 'svgWidth': chartWidth }}
                    />
                  </div>
                )
                : <LoaderSmall />
              }
            </div>
            {/*
          // RS-4379 Hiding piechart and grouped bar chart for the time
          <div className="pieChart">
                      <div className="reportDetail__row reportDetail__subheading">
                        <b>Predicted Threat Tactics</b>
                      </div>
                      { pieChartData.length < 1 && noDataText }
                      <DonutChart
                        data={pieChartData}
                        config={{ 'width': chartWidth, 'height': 300 }}
                        pipeline={reportDetail.pipeline}
                        startDate={startTime}
                        endDate={endTime}
                      />
                    </div> */}
          </div>
          <div className="reportDetail__row reportDetail__subheading">
            <b>Details</b>
          </div>
          <div className="reportDetail__row">
            {/*
          // RS-4379 Hiding piechart and grouped bar chart for the time
          <div className="groupedChart">
                      <div className="reportDetail__row reportDetail__subheading">
                        <b>Predictions by Date</b>
                      </div>
                      { stackedBarChartData.length < 1 && noDataText }
                      <GroupedBarChart
                        items={stackedBarChartData}
                        colors={colorArr}
                        config={{ 'svgWidth': chartWidth, 'svgHeight': 300 }}
                      />
                    </div> */}
            <div className={`detailListing ${!reportResultsCompleted ? 'reportDetail__loading' : ''}`} >
              {reportResultsCompleted ? tableSection : <LoaderSmall />}
            </div>
          </div>
          {showViewDetails && <ViewDetail data={reportDetail} onClose={() => this.changeStateValue('showViewDetails', false)} rules={filteredRulesForDetails} />}
          {showOnDemandModal && (
            <OnDemand
              mode={isBatch ? 'batch' : 'realtime'}
              onCancel={() => this.changeStateValue('showOnDemandModal', false)}
              pipeline={cleanPipeline(reportDetail.pipeline)}
              onApply={this.onDemandApply}
            />
          )}
        </section>
      </IntlProvider>
    );
  }
}

const mapStateToProps = state => ({
  'isLoading': (state.data.reports.toJS().isLoading.length !== 0 || state.data.rules.toJS().isLoading.length !== 0),
  'tags': state.raw.toJS().tags,
  'reportSummary': state.data.reports.toJS().reportSummary,
  'reportResultsCSVUrl': state.data.reports.toJS().reportResultsCSVUrl,
  'availableDates': getAvailableDates(state),
  'listingData': handleListingData(state),
  'totalDataCount': state.data.reports.toJS().reportResults.totalCount,
  'rules': formatRules(state),
  'reportDetail': state.data.reports.toJS().reportDetail,
  'reportSummaryCompleted': state.data.reports.toJS().reportSummaryCompleted,
  'reportResultsCompleted': state.data.reports.toJS().reportResultsCompleted,
  'reportResultsCsvCompleted': state.data.reports.toJS().reportResultsCsvCompleted,
  'isOldEVPActive': !state.app.ui.toJS().newEVPVisibility,
});

const mapDispatchToProps = dispatch => ({
  'updateLocation': location => dispatch(routerActions.push(location)),
  'fetchRules': (...args) => dispatch(getRules(...args)),
  'fetchReportSummary': (...args) => dispatch(fetchReportSummary(...args)),
  'fetchReportResults': (...args) => dispatch(fetchReportResults(...args)),
  'fetchColumnFormat': (...args) => dispatch(fetchColumnFormat(...args)),
  'fetchReportResultsCSV': (...args) => dispatch(fetchReportResultsCSV(...args)),
  'handleExplodedView': (...args) => dispatch(routerActions.push(...args)),
  'getReportById': (...args) => dispatch(getReportById(...args)),
  'goBackUrl': (...args) => dispatch(goBackUrl(...args)),
  'resetDownloadCSV': (...args) => dispatch(resetDownloadCSV(...args)),
  'onDemandPost': (...args) => dispatch(onDemandPost(...args)),
});

ReportDetail.propTypes = {
  'updateLocation': PropTypes.func.isRequired,
  'fetchReportResults': PropTypes.func.isRequired,
  'fetchColumnFormat': PropTypes.func.isRequired,
  'fetchReportSummary': PropTypes.func.isRequired,
  'reportDetail': PropTypes.object.isRequired,
  'reportResultsCSVUrl': PropTypes.string.isRequired,
  'fetchReportResultsCSV': PropTypes.func.isRequired,
  'rules': PropTypes.array.isRequired,
  'availableDates': PropTypes.array.isRequired,
  'listingData': PropTypes.object.isRequired,
  'handleExplodedView': PropTypes.func.isRequired,
  'location': PropTypes.object.isRequired,
  'getReportById': PropTypes.func.isRequired,
  'isLoading': PropTypes.bool.isRequired,
  'router': PropTypes.object.isRequired,
  'fetchRules': PropTypes.func.isRequired,
  'reportSummaryCompleted': PropTypes.bool.isRequired,
  'reportResultsCompleted': PropTypes.bool.isRequired,
  'reportResultsCsvCompleted': PropTypes.bool.isRequired,
  'totalDataCount': PropTypes.number,
  'resetDownloadCSV': PropTypes.func.isRequired,
  'isOldEVPActive': PropTypes.bool,
  'onDemandPost': PropTypes.func.isRequired,
};

ReportDetail.defaultProps = {
  'totalDataCount': 0,
  'isOldEVPActive': false,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportDetail);
