import React from 'react';
import PropTypes from 'prop-types';
import moment, { isMoment } from 'moment';
import { createURL } from 'lib';

import { routerActions } from 'react-router-redux';
import { setLabelForPrediction } from 'model/actions/malicious-activity.actions';
import { deleteLabel } from 'model/actions/rest/labels.actions';
import { getTime } from 'model/selectors';

import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import { connect } from 'react-redux';

import { isEqual } from 'lodash';

import Modal from 'components/modal';
import DateRange from 'components/date-range';
import { TimelineLegend } from 'components/d3-timeline-diagram';

import ChangeLabel from 'containers/change-label';
import MaliciousTimeline from 'containers/malicious-timeline';
import { fetchBehaviorSummary, refreshBehaviorSummary, refreshMaliciousBehavior, refreshSuspiciousBehavior } from 'model/actions/dashboard';
import { fetchMaliciousBehavior } from 'model/actions/malicious';
import { fetchSuspiciousBehavior } from 'model/actions/suspicious';
import ViewSwitcher from './components/view-switcher';

import MaliciousActivity from './containers/malicious-activity';
import SuspiciousActivity from './containers/suspicious-activity';
import ClusterView from './containers/cluster-view';
import Tabs from './containers/tabs';

import './dashboard.style.scss';

class Dashboard extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      'changeLabelModal': false,
      'predictionRow': {},
      'urlFilters': {
        'suspicious': { },
        'malicious': { },
      },
      'linkToMalicious': '',
      'linkToAutocorrelation': '',
      'linkToSuspicious': '',
    };

    this.updateDateRange = this.updateDateRange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleSetLabel = this.handleSetLabel.bind(this);
    this.closeChangeLabel = this.closeChangeLabel.bind(this);
    this.handleURLChange = this.handleURLChange.bind(this);
    this.updateLinkToURL = this.updateLinkToURL.bind(this);
    this.handleSetLabelAction = this.handleSetLabelAction.bind(this);
    this.handleDeleteLabelAction = this.handleDeleteLabelAction.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  componentDidMount() {
    const { location, systemInfo } = this.props;
    const refreshTime = (systemInfo && systemInfo.login_config
      && systemInfo.login_config.refresh_time) || 10;
    const refreshEnabled = systemInfo && systemInfo.login_config
      && systemInfo.login_config.is_refresh_enable;
    const isRefreshEnabled = refreshEnabled === undefined ? true : refreshEnabled;
    let refreshInterval;

    const defaultStart = moment.utc().subtract(7, 'day');
    const defaultEnd = moment.utc();

    const startDate = location.query.start_time
      ? moment.utc(location.query.start_time, 'MM-DD-YYYY')
      : defaultStart;
    const endDate = location.query.end_time
      ? moment.utc(location.query.end_time, 'MM-DD-YYYY')
      : defaultEnd;

    if (isRefreshEnabled && endDate.isSame(moment.utc(), 'day')) {
      refreshInterval = window.setInterval(() => {
        this.refreshDashboard(false);
      }, refreshTime * 60000); // Convert to miliseconds
    }

    if (isMoment(startDate) && isMoment(endDate)) {
      this.setState({
        'refreshInterval': refreshInterval,
      });
    }

    this.setState({
      'linkToMalicious': this.updateLinkToURL('/behavior/malicious', this.props.maliciousFilter),
      'linkToAutocorrelation': this.updateLinkToURL('/autocorrelation'),
      'linkToSuspicious': this.updateLinkToURL('/behavior/suspicious', this.state.urlFilters.suspicious),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.systemInfo !== this.props.systemInfo) {
      const { systemInfo, location } = nextProps;
      const refreshTime = (systemInfo && systemInfo.login_config
        && systemInfo.login_config.refresh_time) || 10;
      const refreshEnabled = systemInfo && systemInfo.login_config
        && systemInfo.login_config.is_refresh_enable;
      const isRefreshEnabled = refreshEnabled === undefined ? true : refreshEnabled;
      let { refreshInterval } = this.state;

      const endDate = location.query.end_time
        ? moment.utc(location.query.end_time, 'MM-DD-YYYY')
        : moment.utc();

      if (!isRefreshEnabled) {
        window.clearInterval(refreshInterval);
      } else if (endDate.isSame(moment.utc(), 'day')) {
        refreshInterval = window.setInterval(() => {
          this.refreshDashboard(false);
        }, refreshTime * 60000);

        this.setState({
          'refreshInterval': refreshInterval,
        });
      }
    }

    if (!isEqual(this.props.maliciousFilter, nextProps.maliciousFilter)) {
      const params = {};
      const filter = nextProps.maliciousFilter;
      const keys = Object.keys(filter);
      if (keys.length > 0) {
        params.activeEntity = keys[0];
        params.activeTactic = filter[keys[0]];
      }

      this.handleURLChange(params, 'malicious');
    }
  }

  componentWillUnmount() {
    const { refreshInterval } = this.state;
    const { systemInfo } = this.props;
    const isRefreshEnabled = (systemInfo && systemInfo.login_config
      && systemInfo.login_config.is_refresh_enable) || true;
    if (isRefreshEnabled) {
      window.clearInterval(refreshInterval);
    }
  }

  closeChangeLabel() {
    this.setState({ 'changeLabelModal': false, 'predictionRow': {} });
  }

  refreshDashboard(showLoader = true) {
    const location = this.props.location && this.props.location.query;
    const origin = showLoader ? 'manual' : 'refresh';

    const defaultStart = moment.utc().subtract(7, 'day');
    const defaultEnd = moment.utc();

    const startDate = location.start_time
      ? moment.utc(location.start_time, 'MM-DD-YYYY')
      : defaultStart;
    const endDate = location.end_time
      ? moment.utc(location.end_time, 'MM-DD-YYYY')
      : defaultEnd;

    if (endDate.isSame(moment.utc(), 'day')) {
      if (origin === 'refresh') {
        this.props.refreshBehaviorSummary(startDate, endDate);
        this.props.refreshMaliciousBehavior(startDate.format('X'), endDate.format('X'), undefined, true);
        this.props.refreshSuspiciousBehavior(startDate.format('X'), endDate.format('X'), undefined, true);
      } else {
        this.props.fetchBehaviorSummary(startDate, endDate);
        this.props.fetchMaliciousBehavior(startDate.format('X'), endDate.format('X'), undefined, true);
        this.props.fetchSuspiciousBehavior(startDate.format('X'), endDate.format('X'), undefined, true);
      }
    }
  }

  refreshData() {
    const location = this.props.location && this.props.location.query;
    const defaultStart = moment.utc().subtract(7, 'day');
    const defaultEnd = moment.utc();

    const startDate = location.start_time
      ? moment.utc(location.start_time, 'MM-DD-YYYY')
      : defaultStart;
    const endDate = location.end_time
      ? moment.utc(location.end_time, 'MM-DD-YYYY')
      : defaultEnd;

    this.props.refreshMaliciousBehavior(startDate.format('X'), endDate.format('X'), undefined, true);
    this.props.refreshSuspiciousBehavior(startDate.format('X'), endDate.format('X'), undefined, true);
  }

  handleSetLabelAction(prediction, confirm = false) {
    this.props.setLabelForPrediction(prediction, confirm, this.refreshData);
  }

  handleDeleteLabelAction(labelId) {
    this.props.deleteLabel(labelId, this.refreshData);
  }

  updateDateRange(startDate, endDate) {
    const { location } = this.props;
    const utcStartDate = !startDate.isUTC()
      ? moment.utc(startDate.format('MM-DD-YYYY'), 'MM-DD-YYYY')
      : startDate;
    const utcEndDate = !endDate.isUTC()
      ? moment.utc(endDate.format('MM-DD-YYYY'), 'MM-DD-YYYY')
      : endDate;

    const dateQuery = {
      'start_time': utcStartDate.format('MM-DD-YYYY'),
      'end_time': utcEndDate.format('MM-DD-YYYY'),
    };

    const nextLocation = createURL(
      location.pathname,
      { ...location.query, 'start_time': utcStartDate.format('MM-DD-YYYY'), 'end_time': utcEndDate.format('MM-DD-YYYY') },
    );

    this.props.updateLocation(nextLocation);

    this.setState({
      'linkToMalicious': this.updateLinkToURL('/behavior/malicious', Object.assign({}, dateQuery, this.state.urlFilters.malicious)),
      'linkToAutocorrelation': this.updateLinkToURL('/autocorrelation', dateQuery),
      'linkToSuspicious': this.updateLinkToURL('/behavior/suspicious', Object.assign({}, dateQuery, this.state.urlFilters.suspicious)),
    });
  }

  handleTabChange(index) {
    const { location } = this.props;
    const nextLocation = createURL(
      location.pathname,
      { ...location.query, 'tab': index },
    );
    this.props.updateLocation(nextLocation);
  }

  handleSetLabel(row) {
    this.setState({
      'predictionRow': row,
      'changeLabelModal': true,
    });
  }

  handleURLChange(params, behavior = 'suspicious') {
    const tbsetData = this.state.urlFilters;
    const finalData = {};

    switch (behavior) {
      case 'suspicious':
        tbsetData[behavior] = {
          ...tbsetData[behavior],
          ...params,
        };
        let ae = tbsetData[behavior].activeEntity;
        ae = ae === 'ip' ? 'sip' : ae || 'all';
        tbsetData[behavior].activeEntity = ae;
        tbsetData[behavior].suspiciousType = tbsetData[behavior].suspiciousType || 'all';
        finalData.linkToSuspicious = this.updateLinkToURL('/behavior/suspicious', tbsetData[behavior]);
        break;
      case 'malicious':
        tbsetData[behavior] = params;
        finalData.linkToMalicious = this.updateLinkToURL('/behavior/malicious', tbsetData[behavior]);
        break;
      default: break;
    }
    finalData.urlFilters = tbsetData;
    this.setState(finalData);
  }

  updateLinkToURL(baseURL = '', params = {}) {
    const { location, time } = this.props;

    if (isMoment(time.startTime)) {
      return createURL(
        baseURL,
        {
          'start_time': location.query.start_time || time.startTime.format('MM-DD-YYYY'),
          'end_time': location.query.end_time || time.endTime.format('MM-DD-YYYY'),
          ...params,
        },
      );
    }
    return baseURL;
  }

  render() {
    const { changeLabelModal } = this.state;
    const { time } = this.props;

    return (
      <div className="dashboard">
        <div className="dashboard__d3_diagram">
          <MaliciousTimeline
            startDate={time.startTime}
            endDate={time.endTime}
            tab="malicious"
            activeView={this.props.location.query.tab || 'malicious'}
          />
        </div>
        <div className="dashboard__bar">
          <div>
            <DateRange
              startDate={time.startTime}
              endDate={time.endTime}
              updateDateRange={this.updateDateRange}
              showHoursList={false}
            />
          </div>
          <Tabs
            endDate={time.endTime}
            location={this.props.location}
            startDate={time.startTime}
            handleTabChange={this.handleTabChange}
          />
          <TimelineLegend
            data={[
              { 'label': <FormattedHTMLMessage id="behaviorSummary.legend.malicious" />, 'color': '#d80027' },
              { 'label': <FormattedHTMLMessage id="behaviorSummary.legend.suspicious" />, 'color': '#f8e81c' },
              { 'label': <FormattedHTMLMessage id="behaviorSummary.legend.cluster" />, 'color': '#ff9d00' },
            ]}
          />
        </div>
        {
          <ViewSwitcher
            active={this.props.location.query.tab || 'malicious'}
            views={{
              'malicious': <MaliciousActivity
                setLabelForPrediction={this.handleSetLabel}
                nextUrl={this.state.linkToMalicious}
                handleURLChange={this.handleURLChange}
                deleteLabel={this.handleDeleteLabelAction}
              />,
              'suspicious': <SuspiciousActivity
                startDate={time.startTime}
                endDate={time.endTime}
                nextUrl={this.state.linkToSuspicious}
                setLabelForPrediction={this.handleSetLabel}
                handleURLChange={this.handleURLChange}
                deleteLabel={this.handleDeleteLabelAction}
              />,
              'correlations': <ClusterView
                startDate={time.startTime}
                endDate={time.endTime}
                linkToAutocorrelation={this.state.linkToAutocorrelation}
                setLabelForPrediction={this.handleSetLabel}
                router={this.props.router}
              />,
            }}
          />
        }
        {
          changeLabelModal && (
            <Modal>
              <ChangeLabel
                predictionRow={this.state.predictionRow}
                onCancel={this.closeChangeLabel}
                onSave={this.handleSetLabelAction}
                title={<FormattedMessage id="suspicious.setLabel" />}
              />
            </Modal>
          )
        }
      </div>
    );
  }
}
Dashboard.propTypes = {
  'time': PropTypes.shape({
    'startTime': PropTypes.object.isRequired,
    'endTime': PropTypes.object.isRequired,
    'timezone': PropTypes.string,
  }).isRequired,
  'location': PropTypes.object.isRequired,
  'updateLocation': PropTypes.func.isRequired,
  'router': PropTypes.object.isRequired,
  'setLabelForPrediction': PropTypes.func.isRequired,
  'deleteLabel': PropTypes.func.isRequired,
  'fetchBehaviorSummary': PropTypes.func.isRequired,
  'fetchSuspiciousBehavior': PropTypes.func.isRequired,
  'fetchMaliciousBehavior': PropTypes.func.isRequired,
  'refreshMaliciousBehavior': PropTypes.func.isRequired,
  'refreshBehaviorSummary': PropTypes.func.isRequired,
  'refreshSuspiciousBehavior': PropTypes.func.isRequired,
  'systemInfo': PropTypes.object.isRequired,
  'maliciousFilter': PropTypes.object,
};
Dashboard.defaultProps = {
  'maliciousCount': 0,
  'suspiciousCount': 0,
  'systemInfo': {},
  'maliciousFilter': {},
};

const mapStateToProps = state => ({
  'maliciousCount': state.raw.toJS().behaviorSummary.total_malicious_behavior,
  'suspiciousCount': state.raw.toJS().behaviorSummary.total_suspicious_behavior,
  'systemInfo': state.raw.toJS().systemInfo,
  'time': getTime(state),
  'maliciousFilter': state.app.maliciousActivity.toJS().active,
});

const mapDispatchToProps = dispatch => ({
  'updateLocation': location => dispatch(routerActions.push(location)),
  'setLabelForPrediction': (...args) => dispatch(setLabelForPrediction(...args)),
  'deleteLabel': (...args) => dispatch(deleteLabel(...args)),
  'fetchBehaviorSummary': (...args) => dispatch(fetchBehaviorSummary(...args)),
  'fetchSuspiciousBehavior': (...args) => dispatch(fetchSuspiciousBehavior(...args)),
  'fetchMaliciousBehavior': (...args) => dispatch(fetchMaliciousBehavior(...args)),
  'refreshBehaviorSummary': (...args) => dispatch(refreshBehaviorSummary(...args)),
  'refreshSuspiciousBehavior': (...args) => dispatch(refreshSuspiciousBehavior(...args)),
  'refreshMaliciousBehavior': (...args) => dispatch(refreshMaliciousBehavior(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
