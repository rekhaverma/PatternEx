import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import isSameDate from 'lib/is-same-date.js';

import { isEmpty } from 'lodash';
import { TimelineDiagram } from 'components/d3-timeline-diagram';

import { sidebarMenuWidth } from 'config';
import { defaultEndDate, defaultStartDate } from './constants';

const orderDataByKey = object => Object.keys(object)
  .sort((a, b) => a - b)
  .reduce((_sortedObj, key) => ({
    ..._sortedObj,
    [key]: object[key],
  }), {});

class TimelineDiagramContainer extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      'config': {
        'svgWidth': parseInt(window.innerWidth - sidebarMenuWidth, 10),
        'svgHeight': 160,
        'marginLeft': 20,
        'marginTop': 20,
        'marginBottom': 5,
      },
      'timeRangeStart': defaultStartDate,
      'timeRangeEnd': defaultEndDate,
      'timeRangeStartPosition': 0,
      'timeRangeEndPosition': 0,

      'rangePercentStart': 0,
      'rangePercentEnd': 100,
    };

    this.updateDimensions = this.updateDimensions.bind(this);
    this.updateRangePercent = this.updateRangePercent.bind(this);
    this.setTimeRangePosition = this.setTimeRangePosition.bind(this);
    this.setTimeRange = this.setTimeRange.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentDidMount() {
    this.updateDimensions();
  }

  componentWillReceiveProps(nextProps) {
    const { config } = this.state;
    if (isSameDate(nextProps.startDate, this.props.startDate)) {
      this.setTimeRange('start', nextProps.startDate, 0);
    }
    if (isSameDate(nextProps.endDate, this.props.endDate)) {
      this.setTimeRange('end', nextProps.endDate, config.svgWidth - (2 * config.marginLeft));
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  setTimeRange(label, timeRange, x) {
    if (label === 'start') {
      this.setState({
        'timeRangeStart': timeRange,
        'timeRangeStartPosition': x,
      });
    } else {
      this.setState({
        'timeRangeEnd': timeRange,
        'timeRangeEndPosition': x,
      });
    }
  }

  setTimeRangePosition(timeRangePosition) {
    const actualWidth = timeRangePosition - this.state.config.marginLeft;
    this.setState({
      'timeRangeStartPosition': (actualWidth * this.state.rangePercentStart) / 100,
      'timeRangeEndPosition': (actualWidth * this.state.rangePercentEnd) / 100,
    });
  }

  updateRangePercent(label, x) {
    const { config } = this.state;
    if (label === 'start') {
      this.setState({
        ...this.state,
        'rangePercentStart': (x * 100) / (config.svgWidth - config.marginLeft),
      });
    } else {
      this.setState({
        ...this.state,
        'rangePercentEnd': (x * 100) / (config.svgWidth - config.marginLeft),
      });
    }
  }

  /**
  * Graph must be responsive
  */
  updateDimensions() {
    const config = this.state.config;
    const fullWidth = parseInt(window.innerWidth - sidebarMenuWidth, 10);

    if (fullWidth - config.marginLeft !== config.svgWidth) {
      this.setState({
        'config': {
          ...this.state.config,
          'svgWidth': fullWidth - config.marginLeft,
        },
      }, () => {
        const updatedConfig = this.state.config;
        const width = updatedConfig.svgWidth - updatedConfig.marginLeft;

        this.setTimeRangePosition(width);
      });
    }
  }

  render() {
    const { tab, items } = this.props;
    let { startDate, endDate } = this.props;

    if (!isEmpty(startDate) && !isEmpty(endDate)) {
      startDate = moment(startDate.startOf('day').format());
      endDate = moment(endDate.startOf('day').format());
    }

    return (
      <TimelineDiagram
        config={this.state.config}
        startDate={startDate}
        endDate={endDate}
        tab={tab}
        items={orderDataByKey(items)}
        onDayClick={this.props.onDayClick}
        resetDayClick={this.props.resetDayClick}
        timeRangeStart={this.state.timeRangeStart}
        timeRangeStartPosition={this.state.timeRangeStartPosition}
        setTimeRange={this.setTimeRange}
        timeRangeEnd={this.state.timeRangeEnd}
        timeRangeEndPosition={this.state.timeRangeEndPosition}
        updateRangePercent={this.updateRangePercent}
        activeView={this.props.activeView}
      />
    );
  }
}

TimelineDiagramContainer.displayName = 'TimelineDiagramContainer';
TimelineDiagramContainer.propTypes = {
  'startDate': PropTypes.object,
  'endDate': PropTypes.object,
  'tab': PropTypes.string,
  'items': PropTypes.object,
  'onDayClick': PropTypes.func,
  'resetDayClick': PropTypes.func,
  'activeView': PropTypes.oneOf(['malicious', 'suspicious', 'correlations']),
};
TimelineDiagramContainer.defaultProps = {
  'startDate': defaultStartDate,
  'endDate': defaultEndDate,
  'tab': 'malicious',
  'items': {},
  'onDayClick': () => null,
  'resetDayClick': () => null,
  'activeView': 'malicious',
};

export default TimelineDiagramContainer;
