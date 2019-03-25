import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { FormattedHTMLMessage } from 'react-intl';

import { isEqual, omit, zipObject } from 'lodash';
import moment from 'moment';

import NoData from 'components/no-data';
import { sidebarMenuWidth } from 'config';
import { mapTagToColor } from 'lib';

import './barchart.style.scss';

const margin = {
  'top': 15,
  'left': 15,
};

/**
 * Return the maximum value of all objects in data array
 * Initialise the maximum with the first object numeric property, and then
 * iterate in all objects to find if there's a bigger value
 *
 * @param {Array} data       Array of objects
 * @returns {Number}
 */
const maxTotalCount = (threatsArray) => {
  let maxValue = 0;
  threatsArray.forEach((threatObject) => {
    const max = d3.max(Object.values(threatObject).slice(1));
    if (max > maxValue) {
      maxValue = max;
    }
  });
  return maxValue + 10;
};

const timeFormat = (startDate, endDate) => {
  const distance = (+new Date(endDate)) - (+new Date(startDate));
  return (distance < 1000 * 60 * 60 * 24 * 2) ? '%H:%M' : '%m-%d-%Y';
};

const appendTooltip = (xPos, yPos, className) => {
  const tooltip = d3.select(`.${className}__chart`)
    .append('div')
    .attr('data-placement', 'right')
    .attr('class', 'barchart__tooltip popper-wrap')
    .style('position', 'fixed');
  tooltip.append('span')
    .attr('class', 'popper__arrow');
  tooltip.append('div')
    .attr('class', 'barchart__popper popper');

  tooltip.style('left', `${xPos + 10}px`)
    .style('top', `${yPos}px`);
};

const appendTooltipData = (data) => {
  const tooltipBox = d3.select('.popper');

  Object.keys(data).forEach((key) => {
    const tooltipInfo = tooltipBox.append('div')
      .attr('class', 'popper__info');
    tooltipInfo.append('span')
      .html(() => data[key]);
    tooltipInfo.append('span')
      .html(() => key);
  });
};

const removeTooltip = () => {
  d3.selectAll('.barchart__tooltip').remove();
};

const addDashedLine = (group, height, position) => {
  group.append('line')
    .attr('class', 'dashed_line')
    .attr('x1', position)
    .attr('y1', 0)
    .attr('x2', position)
    .attr('y2', height - (3 * margin.top))
    .attr('stroke', '#6c6c6c')
    .attr('stroke-dasharray', (3, 3));
};

const addDashedLineDelimiters = (svg, height, scale) => {
  // calculate position of vertical dashed lines
  const defaultTicksInnerHTML = d3.selectAll('.axis__xaxis > g > text')
    .nodes()
    .map(t => t.innerHTML);

  const defaultTicksPosition = [];

  d3.selectAll('.axis__xaxis > g')
    .each(d => defaultTicksPosition.push(scale(d)));

  const delimiters = [];
  if (defaultTicksPosition.length > 1) {
    for (let i = 0; i < defaultTicksPosition.length; i += 1) {
      if (defaultTicksPosition[i] !== undefined && defaultTicksPosition[i + 1] !== undefined) {
        delimiters.push((((defaultTicksPosition[i] + defaultTicksPosition[i + 1]) - 10) / 2));
      }
    }
  }
  const ticksInfo = zipObject(defaultTicksInnerHTML, defaultTicksPosition);
  // style: append dashed lines

  const dashedLines = svg.append('g')
    .attr('class', 'dashed_line_group');

  delimiters.forEach((position) => {
    addDashedLine(dashedLines, height, position);
  });

  return [delimiters, ticksInfo];
};

export default class BarChart extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      'svgWidth': parseInt((window.innerWidth - sidebarMenuWidth - (margin.left)) / 2, 10),
      'svgHeight': 250,
    };

    this.svgNode = null;
    this.renderD3 = this.renderD3.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentDidMount() {
    const { data } = this.props;
    this.renderD3(data);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.data, nextProps.data)
      || !isEqual(this.props.calendarDay, nextProps.calendarDay)) {
      this.renderD3(nextProps.data);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!isEqual(this.props.data, nextProps.data)
      || !isEqual(this.props.calendarDay, nextProps.calendarDay)) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const { isRealTimeMode, data } = this.props;
    let svgWidth;
    if (isRealTimeMode && data.length > 6) {
      svgWidth = (data.length * 240) - (2 * margin.left);
    } else {
      svgWidth = parseInt((window.innerWidth - sidebarMenuWidth - (margin.left)) / 2, 10);
    }
    this.renderD3(data, svgWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    const barChartWidth = window.innerWidth - sidebarMenuWidth - (3 * margin.left);
    if (window.innerWidth <= 1060) {
      this.setState({
        'svgWidth': parseInt(barChartWidth, 10),
      });
    } else {
      this.setState({
        'svgWidth': parseInt(barChartWidth / 2, 10),
      });
    }
  }

  xAxis(barchart, calendarDay, ticksData, isRealTimeMode, svgWidth) {
    const { svgHeight } = this.state;

    let startDate;
    let endDate = calendarDay;
    if (isRealTimeMode) {
      startDate = moment(ticksData[0]).subtract(2, 'hour');
      endDate = moment(endDate).add(1, 'hour');
    } else {
      startDate = moment.utc(endDate).subtract(7, 'days').startOf('day');
      endDate = moment.utc(endDate).add(1, 'day').endOf('day');
    }

    let x = d3.scaleTime()
      .range([0, svgWidth - (2 * margin.left)])
      .domain([new Date(startDate.utc().format('DD, MMM, YYYY')), new Date(endDate.utc().format('DD, MMM, YYYY'))]);

    if (isRealTimeMode) {
      x = d3.scaleTime()
        .range([0, svgWidth - (2 * margin.left)])
        .domain([new Date(startDate), new Date(endDate)]);
    }
    const axisBottom = d3.axisBottom(x);
    if (isRealTimeMode) {
      axisBottom
        .ticks(d3.timeHour.every(2))
        .tickFormat(d3.timeFormat(timeFormat(startDate, endDate)));
    } else {
      axisBottom
        .ticks(d3.timeDay.every(1))
        .tickFormat(d3.timeFormat(timeFormat(startDate, endDate)));
    }

    barchart.selectAll('.axis__xaxis').remove();
    d3.selectAll('.dashed_line_group').remove();
    barchart.append('g')
      .attr('class', 'axis__xaxis')
      .attr('transform', `translate(0, ${svgHeight - (3 * margin.top)})`)
      .call(axisBottom);

    barchart.selectAll('.axis__xaxis')
      .selectAll('text')
      .attr('x', '-7');
    if (!isRealTimeMode) {
      barchart.selectAll('.axis__xaxis')
        .selectAll('text')
        .attr('display', (d, i) => {
          if (i === 0 || i === 8) {
            return 'none';
          }
          return 'block';
        });
    } else {
      barchart.selectAll('.axis__xaxis')
        .selectAll('text')
        .attr('display', (d, i) => {
          if (i === 0) {
            return 'none';
          }
          return 'block';
        });
    }

    return x;
  }

  yAxis(axis, max = 600, svgWidth) {
    const { svgHeight } = this.state;

    const y = d3.scaleLinear()
      .range([svgHeight - (3 * margin.top), 0])
      .domain([0, max]);
    const axisLeft = d3.axisLeft(y).ticks(7);

    axis.selectAll('.axis__yaxis').remove();
    axis.append('g')
      .attr('class', 'axis__yaxis')
      .attr('transform', `translate(${2 * margin.left}, 0)`)
      .call(axisLeft);

    // decorative horizontal lines
    const customAxisLeft = d3.axisLeft(y)
      .ticks(7)
      .tickFormat('')
      .tickSize(-svgWidth + (4 * margin.left));

    axis.selectAll('.axis__grid').remove();
    const grid = axis.append('g')
      .attr('class', 'axis__grid')
      .attr('transform', `translate(${2 * margin.left}, 0)`)
      .call(customAxisLeft);
    grid.selectAll('.tick:not(:first-of-type) line')
      .attr('stroke-dasharray', '5,4');

    return y;
  }

  appendStacks(xScale, yScale, data, svgWidth) {
    const { className } = this.props;
    const node = this.svgNode;

    const svg = d3.select(node);
    svg.selectAll('.stackGroup').remove();

    // get all keys, excluding the first one, which represents a date value
    const threats = data.map(item => Object.keys(item).slice(1));

    // create array of all threats name unduplicated
    const allThreats = threats.reduce((threatsNames, dayThreats) => {
      dayThreats.forEach((threat) => {
        if (!threatsNames.includes(threat)) {
          threatsNames.push(threat);
        }
      });
      return threatsNames;
    }, []);

    let barWidth = 0;
    if (this.props.isRealTimeMode) {
      barWidth = data.length > 4
        ? ((this.state.svgWidth - (3 * margin.left)) / data.length) - 20
        : 100;
    } else {
      barWidth = ((svgWidth - (3 * margin.left)) / 7) - 20;
    }

    const stacks = svg.selectAll('.stackGroup')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'stackGroup')
      .attr('width', barWidth)
      .attr('transform', (d) => {
        const currentThreatsNumber = Object.keys(omit(d, 'date')).length;
        const halfBarWidth = (currentThreatsNumber * (barWidth / allThreats.length)) / 2;
        if (xScale(new Date(d.date)) - halfBarWidth > 0) {
          return `translate(${(xScale(new Date(d.date))) - halfBarWidth - 20}, 0)`;
        }
        return null;
      });

    stacks.selectAll('rect')
      .data(d => Object.keys(d).slice(1).map(key => ({
        'key': key,
        'value': d[key],
      })))
      .enter()
      .append('rect')
      .attr('x', (d, i) => ((barWidth / allThreats.length) * i) + 1)
      .attr('y', d => yScale(d.value))
      .attr('width', barWidth / allThreats.length)
      .attr('height', d => this.state.svgHeight - yScale(d.value) - (3 * margin.top))
      .attr('fill', d => mapTagToColor(d.key.toLowerCase()));

    const tooltip = d3.select('.pipeline__chart')
      .append('div')
      .attr('class', 'barchart__tooltip popper-wrap')
      .style('opacity', 0);

    stacks
      .on('mouseover', (d) => {
        const pageX = event.x;
        const pageY = event.y;

        tooltip.transition().duration(200).style('opacity', 0.9).attr('width', '100%');

        appendTooltip(pageX, pageY, className);
        appendTooltipData(omit(d, 'date'));
      })
      .on('mouseout', () => {
        removeTooltip();
        tooltip.transition().duration(500).style('opacity', 0);
      });
  }

  renderD3(data, svgWidth) {
    const { calendarDay, isRealTimeMode } = this.props;
    const node = this.svgNode;

    const svg = d3.select(node);
    const axis = svg.select('.axis');

    const yScale = this.yAxis(axis, maxTotalCount(data), svgWidth);

    const ticksData = [];
    data.forEach((stack) => {
      if (!ticksData.includes(stack.date)) {
        ticksData.push(stack.date);
      }
    });

    const xScale = this.xAxis(axis, calendarDay, ticksData, isRealTimeMode, svgWidth);

    this.appendStacks(xScale, yScale, data, svgWidth);
    addDashedLineDelimiters(svg, this.state.svgHeight, xScale);
  }

  render() {
    const { data, isRealTimeMode } = this.props;
    const { svgWidth, svgHeight } = this.state;

    const title = (
      <div className={`${this.props.className}__chartTitle`}>
        <FormattedHTMLMessage
          id="pipeline.barchart.title"
          values={{
            'number': isRealTimeMode ? 'hours' : 'days',
            'duration': isRealTimeMode ? '24' : '7',
          }}
        />
      </div>
    );

    if (data.length > 0) {
      return (
        <div className={`${this.props.className}__chart`}>
          {title}
          <div className="bar-chart-svg">
            <svg
              ref={node => this.svgNode = node}
              className="barchart"
              width={svgWidth - margin.left}
              height={svgHeight}
            >
              <g className="axis" />
            </svg>
          </div>
        </div>
      );
    }
    return (
      <div className={`${this.props.className}__chart--noData`}>
        {title}
        <NoData
          message={
            <FormattedHTMLMessage
              id={`${this.props.className}.chart.noData`}
            />}
        />
      </div>
    );
  }
}

BarChart.displayName = 'BarChart';
BarChart.propTypes = {
  'className': PropTypes.string,
  'data': PropTypes.array,
  'calendarDay': PropTypes.object,
  'isRealTimeMode': PropTypes.bool,
};
BarChart.defaultProps = {
  'className': '',
  'data': [],
  'calendarDay': {},
  'isRealTimeMode': false,
};
