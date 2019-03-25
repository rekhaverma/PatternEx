import React from 'react';
import PropTypes from 'prop-types';
import moment, { isMoment } from 'moment';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { createURL } from 'lib';
import { FormattedHTMLMessage } from 'react-intl';
import TopCard, { REPORT, PRECISIONS, LABELS } from 'components/top-card';

import {
  getSystemInfo,
  filterByPipeline,
  getTotalLabels,
  getTotalPrecision,
  getLatestDayDate,
  getTime,
} from 'model/selectors';

import { fetchPerformanceData } from 'model/actions/performance';
import Tabs from 'components/tabs';
import DateRange from 'components/date-range';
import { TimelineLegend } from 'components/d3-timeline-diagram';

import { TimelineDiagramContainer } from 'containers/d3-timeline-diagram-container';

import PerformanceDetails from './containers/performance-details';
import { getStartDateByClientName } from './config.js';

const orderDataByKey = object => Object.keys(object)
  .sort((a, b) => a - b)
  .reduce((_sortedObj, key) => ({
    ..._sortedObj,
    [key]: object[key],
  }), {});

class Performance extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.updateDateRange = this.updateDateRange.bind(this);
  }

  componentDidMount() {
    const { custormerName, time } = this.props;

    const { defaultStart, defaultEnd } = getStartDateByClientName(custormerName);

    const startDate = time.startTime || defaultStart;
    const endDate = time.endTime || defaultEnd;

    if (isMoment(startDate) && isMoment(endDate)) {
      this.props.fetchPerformanceData(startDate.format('X'), endDate.format('X'));
    }
  }

  updateDateRange(startDate, endDate) {
    const { time } = this.props;
    if (!(time.startTime === startDate && time.endTime === endDate)) {
      const { location } = this.props;
      const nextLocation = createURL(
        location.pathname,
        { ...location.query, 'start_time': startDate.format('MM-DD-YYYY'), 'end_time': endDate.format('MM-DD-YYYY') },
      );

      this.props.updateLocation(nextLocation);
      if (isMoment(startDate) && isMoment(endDate)) {
        this.props.fetchPerformanceData(startDate.utc().format('X'), endDate.utc().format('X'));
      }
    }
  }

  render() {
    const { performanceData, rowsData, totalLabels, totalPrecision, mostRecentDate } = this.props;
    const { startTime, endTime } = this.props.time;
    const lastUpdate = moment(this.props.last_update).format('MMM Do YYYY');

    return (
      <div className="dashboard">
        <div className="dashboard__row">
          <TopCard
            icon={REPORT}
            mainText={<FormattedHTMLMessage id="card.report.main" />}
            topText={<FormattedHTMLMessage
              id="card.report.top"
              values={{
                'date': lastUpdate,
              }}
            />}
            footer={<FormattedHTMLMessage id="card.performance.bottom" />}
            footerType="details"
            nextUrl="/dashboard"
          />
          <TopCard
            icon={PRECISIONS}
            mainText={<FormattedHTMLMessage id="card.precisions.main" values={{ 'count': totalPrecision }} />}
            topText={<FormattedHTMLMessage id="performance.precision.top" values={{ 'date': mostRecentDate }} />}
            nextUrl="/behavior/malicious"
          />
          <TopCard
            icon={LABELS}
            mainText={<FormattedHTMLMessage id="card.labels.main" values={{ 'count': totalLabels }} />}
            topText={<FormattedHTMLMessage id="performance.label.top" values={{ 'date': mostRecentDate }} />}
            nextUrl="/behavior/suspicious"
          />
        </div>
        <div className="dashboard__d3_diagram">
          <TimelineDiagramContainer
            startDate={startTime}
            endDate={endTime}
            tab="performance"
            items={orderDataByKey(performanceData)}
          />
        </div>
        <div className="dashboard__bar">
          <div>
            <DateRange
              startDate={startTime}
              endDate={endTime}
              updateDateRange={this.updateDateRange}
            />
          </div>
          <Tabs
            className="tabsV2"
            items={[
              { 'id': '1', 'title': 'Performance Details' },
            ]}
            style={{
              'margin': 'auto',
              'transform': 'translateX(-50%)',
            }}
          />
          <TimelineLegend
            data={[
              { 'label': <FormattedHTMLMessage id="performance.legend.precision" />, 'color': '#a40cb4' },
              { 'label': <FormattedHTMLMessage id="performance.legend.label" />, 'color': '#6d9a3d' },
            ]}
          />
        </div>
        <PerformanceDetails
          startDate={startTime}
          endDate={endTime}
          mostRecentDate={mostRecentDate}
          rowsData={rowsData}
        />
      </div>
    );
  }
}

Performance.propTypes = {
  'location': PropTypes.object.isRequired,
  'fetchPerformanceData': PropTypes.func,
  'updateLocation': PropTypes.func,
  'performanceData': PropTypes.object,
  'rowsData': PropTypes.object,
  'custormerName': PropTypes.string,
  'mostRecentDate': PropTypes.string,
  'totalPrecision': PropTypes.number,
  'totalLabels': PropTypes.number,
  'last_update': PropTypes.string,
  'time': PropTypes.shape({
    'startTime': PropTypes.object.isRequired,
    'endTime': PropTypes.object.isRequired,
    'timezone': PropTypes.string,
  }).isRequired,
};

Performance.defaultProps = {
  'fetchPerformanceData': () => { },
  'updateLocation': () => { },
  'performanceData': {},
  'rowsData': {},
  'custormerName': '',
  'mostRecentDate': moment().utc().format('MM-DD-YYYY'),
  'totalPrecision': 0,
  'totalLabels': 0,
  'last_update': '',
};

const mapStateToProps = state => ({
  'totalPrecision': getTotalPrecision(state),
  'totalLabels': getTotalLabels(state),
  'performanceData': getSystemInfo(state),
  'rowsData': filterByPipeline(state),
  'last_update': state.raw.toJS().systemInfo.update_time,
  'custormerName': state.raw.toJS().systemInfo.customer_name,
  'mostRecentDate': getLatestDayDate(state),
  'time': getTime(state),
});

const mapDispatchToProps = dispatch => ({
  'fetchPerformanceData': (startTime, endTime) => { dispatch(fetchPerformanceData(startTime, endTime)); },
  'updateLocation': location => dispatch(routerActions.push(location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Performance);
