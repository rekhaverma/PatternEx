import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';

import Tabs from 'components/tabs';
import { createURL } from 'lib';
import { dateFormats } from 'config';
import {
  addDataSource,
  deleteDataSource,
  getConfigData,
  getDataSources,
  getSummaryData,
  startDataSource,
  stopDataSource,
  updateDataSource,
} from 'model/actions/log-manager';
import {
  getAddDataSourceStatus,
  getCleanDataConfig,
  getDataSourcesSelector,
  getDeleteDataSourceStatus,
  getGraphSummaryData,
  getHeaderSummaryData,
  getRootLoader,
  getStartDataSourceStatus,
  getStopDataSourceStatus,
  getTableSummaryData,
  getUpdateDataSourceStatus,
} from 'model/selectors/log-manager';

import { LOG_MANAGER, LOG_SUMMARY, tabs } from './constants';
import LogSummary from './components/log-summary/log-summary.component';
import LogManager from './components/log-manager/log-manager.component';

import './log-manager.style.scss';

class LogManagerPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: LOG_SUMMARY,
      date: {
        startDate: null,
        endDate: null,
      },
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.onDateUpdate = this.onDateUpdate.bind(this);
  }

  componentWillMount() {
    /**
     * @todo: check default dates
     */
    const { query } = this.props.location;
    const start = query.start_date;
    const end = query.end_date;
    const { mmddyyDash } = dateFormats;
    const startDate = start ? moment.utc(start, mmddyyDash) : moment.utc().subtract(7, 'days');
    const endDate = end ? moment.utc(end, mmddyyDash) : moment.utc();
    this.setState({
      date: { startDate, endDate },
      activeTab: query.view || LOG_SUMMARY,
    });
  }

  componentDidMount() {
    this.props.getConfigData();
    this.props.dataSourceActions.onFetch();
    this.props.getSummaryData(this.state.date);
  }

  onTabChange(activeTab) {
    this.setState({ activeTab }, () => this.updatePageUrl());
  }

  onDateUpdate(startDate, endDate) {
    this.setState({
      date: { startDate, endDate },
    }, () => this.updatePageUrl());
  }

  updatePageUrl() {
    const { activeTab, date } = this.state;
    const params = {
      view: activeTab,
      start_date: date.startDate.format(dateFormats.mmddyyDash),
      end_date: date.endDate.format(dateFormats.mmddyyDash),
    };
    this.props.updateLocation(createURL('/log-manager', params));
  }

  render() {
    const { activeTab, date } = this.state;

    return (
      <div className="log-manager">
        <div className="log-manager__tabs">
          <Tabs
            active={activeTab}
            className="behaviour-tabs"
            items={tabs}
            onClick={this.onTabChange}
          />
        </div>
        <div className="log-manager__content">
          {activeTab === LOG_SUMMARY && (
            <LogSummary
              summaryDataLoading={this.props.summaryDataLoading}
              summaryData={this.props.summaryData}
              startDate={date.startDate}
              endDate={date.endDate}
              onDateUpdate={this.onDateUpdate}
              getSummaryData={this.props.getSummaryData}
            />
          )}
          {activeTab === LOG_MANAGER && (
            <LogManager
              dataSourceConfig={this.props.dataSourceConfig}
              tableData={this.props.dataSourcesTable}
              dataSourceStatuses={this.props.dataSourceStatuses}
              dataSourceActions={this.props.dataSourceActions}
            />
          )}
        </div>
      </div>
    );
  }
}

LogManagerPage.propTypes = {
  location: PropTypes.object.isRequired,
  dataSourceConfig: PropTypes.object.isRequired,
  dataSourcesTable: PropTypes.array.isRequired,
  updateLocation: PropTypes.func.isRequired,
  getConfigData: PropTypes.func.isRequired,
  getSummaryData: PropTypes.func.isRequired,
  summaryDataLoading: PropTypes.bool.isRequired,
  summaryData: PropTypes.shape({
    headerData: PropTypes.object.isRequired,
    tableData: PropTypes.array.isRequired,
    graphData: PropTypes.array.isRequired,
  }).isRequired,
  dataSourceActions: PropTypes.shape({
    onAdd: PropTypes.func.isRequired,
    onFetch: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onStart: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  }).isRequired,
  dataSourceStatuses: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    add: PropTypes.string.isRequired,
    update: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    stop: PropTypes.string.isRequired,
    delete: PropTypes.string.isRequired,
  }).isRequired,
};

export const mapStateToProps = state => ({
  summaryDataLoading: state.logManager.toJS().loading.getSummaryData,
  summaryData: {
    headerData: getHeaderSummaryData(state),
    graphData: getGraphSummaryData(state),
    tableData: getTableSummaryData(state),
  },
  dataSourcesTable: getDataSourcesSelector(state),
  dataSourceConfig: getCleanDataConfig(state),
  dataSourceStatuses: {
    isLoading: getRootLoader(state),
    add: getAddDataSourceStatus(state),
    update: getUpdateDataSourceStatus(state),
    start: getStartDataSourceStatus(state),
    stop: getStopDataSourceStatus(state),
    delete: getDeleteDataSourceStatus(state),
  },
});
const mapDispatchToProps = dispatch => ({
  updateLocation: url => dispatch(routerActions.push(url)),
  getConfigData: () => dispatch(getConfigData()),
  getSummaryData: params => dispatch(getSummaryData(params)),
  dataSourceActions: {
    onAdd: data => dispatch(addDataSource(data)),
    onFetch: () => dispatch(getDataSources()),
    onUpdate: data => dispatch(updateDataSource(data)),
    onStart: data => dispatch(startDataSource(data)),
    onStop: data => dispatch(stopDataSource(data)),
    onDelete: data => dispatch(deleteDataSource(data)),
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(LogManagerPage);
