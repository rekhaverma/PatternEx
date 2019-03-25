import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import moment from 'moment';
import { isEqual, isEmpty, zipObject } from 'lodash';

import mapTooltipInfo from 'lib/map-tooltip-info';

import { FilterNotification } from '../diagram-filter-notification';

import './d3-timeline-diagram.style.scss';

/**
 * Select content of timeline diagram and removes it
 */
const deleteSvg = () => {
  d3.selectAll('.timeline_diagram > g').remove();
};

const removeTooltip = () => {
  d3.selectAll('.popper-wrap').remove();
};

/**
* Calculate difference of 2 date values
* If difference represents a day, return hour format, otherwise days format
* and add coordinates x and y
* @param {Object} startDate
* @param {Object} endDate
* @return {String}    distance < 1000 miliseconds * 60 seconds * 60 minutes * 24 houres * 2 days
*/
const timeFormat = (startDate, endDate) => {
  const distance = (+new Date(endDate)) - (+new Date(startDate));
  return (distance < 1000 * 60 * 60 * 24 * 2) ? '%H:%M' : '%m-%d-%Y';
};

/**
 * Iterate through data object and return the maximum and minimum values
 * @param {Object} propsData
 * @return {Array}
 */
const getMinMax = (propsData) => {
  if (!isEmpty(propsData)) {
    let data = [];
    Object.keys(propsData).forEach(key => data = [...data, propsData[key]]);
    // inititalize min and max with values from the first data object: data[0]
    let max = data[0].malicious > data[0].suspicious ? data[0].malicious : data[0].suspicious;
    let min = data[0].malicious > data[0].suspicious ? data[0].suspicious : data[0].malicious;

    data.forEach((item) => {
      let itemValues = [];
      Object.keys(item).forEach(key => itemValues = [...itemValues, propsData[key]]);
      const itemMin = Math.min(itemValues[0], itemValues[1]);
      const itemMax = Math.max(itemValues[0], itemValues[1]);
      if (itemMin < min) {
        min = itemMin;
      }
      if (itemMax > max) {
        max = itemMax;
      }
    });
    return [min, max];
  }
  return [0, 100];
};

/**
 * Iterate through data object and create new array of objects like
 * {'date': data value, 'value': label's value}
 * @param {Object} data
 * @param {String} label it should be one of: 'malicious', 'suspicious', 'top_label', 'precision'
 * @return {Array} of objects date-value type
 */
const formatData = (data, label) => Object.keys(data)
  .map(value => ({ 'date': value, 'value': data[value][label] }));

/**
* Iterate through data and add 2 new properties: x and y coordinates
* Workaround: Override array - use same 'date' and 'value' properties's values
* and add x and y coordinates
* @param {Array} items
* @param {function} x (d3)
* @param {function} y (d3)
* @return {Array}
*/
const appendCoordinates = (items, x, y) => {
  const augmentedItems = items.map(item => ({
    ...item,
    'x': x(item.date),
    'y': y(item.value),
  }));
  return augmentedItems;
};

/**
 * Append div containing value and label information
 * @param {Number} value
 * @param {String} label
*/

const tooltipInfo = (value, label) => {
  const tooltipData = d3.select('.popper__point_info')
    .append('div');
  tooltipData.append('span')
    .attr('class', 'highlighted')
    .html(value);
  if (label) {
    tooltipData.append('span')
      .html(mapTooltipInfo(label));
  }
};

/**
 * Add div to diagram container, positionated it by x, y coordinates
 * Fill tooltip content using poitData
 * @param {Number} x
 * @param {Number} y
 * @param {Object} pointData
 * @param {String} label
*/
const d3Tooltip = (x, y, pointData, label) => {
// const d3Tooltip = (x, y, pointData, label, allData) => {
  const tooltip = d3.select('.timeline_diagram_container')
    .append('div')
    .attr('data-placement', 'bottom')
    .attr('class', 'popper-wrap')
    .style('position', 'absolute')
    .style('opacity', 0.8);
  tooltip.append('span')
    .attr('class', 'popper__arrow');
  tooltip.append('div')
    .attr('class', 'popper');
  d3.select('.popper')
    .append('div')
    .attr('class', 'popper__point_info');
  tooltipInfo(moment(pointData.date, 'x').format('MM-DD-YYYY'));
  tooltipInfo(pointData.value, label);

  // const nextProperty = omit(allData[pointData.date], [label]);
  // tooltipInfo(Object.values(nextProperty)[0], Object.keys(nextProperty)[0]);

  const tooltipNode = d3.select('.popper-wrap');

  const tooltipGap = {
    // half of the tooltip width - marginLeft
    'x': (tooltipNode.node().clientWidth / 2) - 20,
    // sqrt(2) * 10 (tooltip top arrow width)
    'y': 14,
  };

  tooltip.style('left', `${x - tooltipGap.x}px`)
    .style('top', `${y + tooltipGap.y}px`);
};

/**
 * Add d3 decorative line on svg
 * @param {Object} svg
 * @param {Number} height
 * @param {Number} position
 */
const addDashedLine = (group, height, position) => {
  group.append('line')
    .attr('class', 'dashed_line')
    .attr('x1', position)
    .attr('y1', 0)
    .attr('x2', position)
    .attr('y2', height)
    .attr('stroke', '#6c6c6c')
    .attr('stroke-dasharray', (3, 3));
};

/**
 * Get x coordinate of xAxis ticks and populate delimiters array with
 * middle value between ticks
 * Draw decorative line for each delimiter's value
 * @param {Object} svg
 * @param {Number} height
 * @return {Array}
 */
const addDashedLineDelimiters = (svg, height, scale) => {
  // calculate position of vertical dashed lines
  const defaultTicksInnerHTML = d3.selectAll('.xAxis > g > text')
    .nodes()
    .map(t => t.innerHTML);

  const defaultTicksPosition = [];

  d3.selectAll('.xAxis > g')
    .each(d => defaultTicksPosition.push(scale(d)));

  const delimiters = [];
  if (defaultTicksPosition.length > 1) {
    for (let i = 0; i < defaultTicksPosition.length; i += 1) {
      if (defaultTicksPosition[i] !== undefined && defaultTicksPosition[i + 1] !== undefined) {
        delimiters.push(((defaultTicksPosition[i] + defaultTicksPosition[i + 1]) / 2));
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

/**
 * Append 2 triangles to d3Element, one on start position and one on end position
 * @param {Object} d3Element
 * @param {Number} start
 * @param {Number} end
 * @return {Object}
 */
const d3Triangles = (d3Element, start, end) => {
  const triangleSize = 80;

  const triangle = d3.symbol()
    .type(d3.symbolTriangle)
    .size(triangleSize);

  d3Element.append('path')
    .attr('d', triangle)
    .attr('class', 'timeRange__triangle start')
    .attr('transform', `translate(${start}, -3)`);
  d3Element.append('path')
    .attr('d', triangle)
    .attr('class', 'timeRange__triangle end')
    .attr('transform', `translate(${end}, -3)`);
  return d3Element;
};

export class TimelineDiagram extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      'config': {},
      'filterDay': {},
    };

    this.svgNode = null;
    this.hoverTimeout = null;
    this.setFilter = this.setFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.drawGraph = this.drawGraph.bind(this);
    this.getSvgNode = this.getSvgNode.bind(this);
    this.xAxis = this.xAxis.bind(this);
    this.yAxis = this.yAxis.bind(this);
    this.showDaySelectedHighlighted = this.showDaySelectedHighlighted.bind(this);
    this.drawTooltip = this.drawTooltip.bind(this);
  }

  componentWillMount() {
    const { config } = this.props;
    this.setConfigProps(config);
  }

  componentDidMount() {
    const { items, tab } = this.props;

    deleteSvg();
    if (!isEmpty(items) && tab !== '') {
      this.drawGraph();
    } else {
      this.drawAxes();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.config, nextProps.config)) {
      this.setConfigProps(nextProps.config);
    }
    if (!isEqual(this.props.startDate, nextProps.startDate)
      || !isEqual(this.props.endDate, nextProps.endDate)) {
      this.drawGraph();
    }
  }

  componentDidUpdate() {
    const { items } = this.props;

    deleteSvg();
    if (!isEmpty(items)) {
      this.drawGraph();
    } else {
      this.drawAxes();
    }
  }

  setFilter(filterDay) {
    removeTooltip();
    this.setState({ filterDay }, this.props.onDayClick(filterDay));
  }

  setConfigProps(config) {
    this.setState({ config });
  }

  /**
 * Attach 'g' tag to svg reference
 * @return {Object}
 */
  getSvgNode() {
    const node = this.svgNode;
    const config = this.state.config;

    return d3.select(node)
      .attr('class', 'timeline_diagram')
      .append('g')
      .attr('transform', `translate(${config.marginLeft}, ${config.marginTop})`)
      .attr('class', 'diagram__group');
  }

  /**
 * Iterate in xAxisTicks to find the x coordinate of the day selected for filtering
 * Search in xAxisDelimiters to find searchedDay's nearest 2 neighbors values
 * and return them
 * @param {Array} xAxisDelimiters - x coordinates of x axis vertical lines
 * @param {Object} xAxisTicks - {'date' - 'date's x_coordinate'}
 * @return {Array}
 */
  getDaySelectedDelimiters(xAxisDelimiters, xAxisTicks) {
    let searchedDay = 0;
    Object.keys(xAxisTicks).forEach((item) => {
      const tickDay = moment(item, 'DD-MM-YYYY');
      if (tickDay.isSame(this.state.filterDay, 'day')) {
        searchedDay = xAxisTicks[item];
      }
    });
    if (searchedDay !== 0) {
      let highlightedZone = [];
      for (let i = 0; i < xAxisDelimiters.length; i += 1) {
        if (i === 0 && searchedDay <= xAxisDelimiters[i]) {
          highlightedZone = [0, xAxisDelimiters[i]];
        } else if (searchedDay >= xAxisDelimiters[i] && searchedDay <= xAxisDelimiters[i + 1]) {
          highlightedZone = [xAxisDelimiters[i], xAxisDelimiters[i + 1]];
        } else if (i === xAxisDelimiters.length - 1
          && searchedDay >= xAxisDelimiters[xAxisDelimiters.length - 1]) {
          highlightedZone = [xAxisDelimiters[xAxisDelimiters.length - 1], 0];
        }
      }
      return highlightedZone;
    }
    return [0, 0];
  }

  clearFilter() {
    this.setState({
      'filterDay': {},
    }, () => this.props.resetDayClick());
  }

  /**
 * Attach 'g' tag which contains x axis, scaled by a start time and an
 * end time
 * @param {Object} svg
 * @param {Object} startDate
 * @param {Object} endDate
 * @return {function} x = d3 scale function
 */
  xAxis(svg, startDate, endDate) {
    const config = this.state.config;
    const width = config.svgWidth - config.marginLeft - config.marginTop;

    const distance = endDate.diff(startDate, 'days');

    const x = d3.scaleTime()
      .range([0, width])
      .domain([new Date(startDate), new Date(endDate)]);
    svg.append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(${config.marginLeft}, 0)`)
      .call(d3.axisTop(x)
        .ticks(distance > 20 ? 8 : null)
        .tickFormat(d3.timeFormat(timeFormat(startDate, endDate))));
    d3.selectAll('.xAxis > g')
      .attr('class', 'tick xAxis__tick');
    return x;
  }

  /**
 * Attach 'g' tag which contains y axis
 * Render ticks based on tab (malicious/ performance)
 * @param {Object} svg
 * @param {Array} minmax
 * @return {Array} y = d3 scale function
 */
  yAxis(svg, minmax = [0, 100]) {
    const { tab } = this.props;

    const config = this.state.config;
    const height = config.svgHeight - config.marginTop - config.marginBottom;

    let y;
    let yPrecision;
    if (tab === 'performance') {
      y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, minmax[1] > 100
          ? minmax[1] + (0.2 * minmax[1])
          : minmax[1] + 10]);
      svg.append('g')
        .attr('class', 'yAxis')
        .call(d3.axisRight(y)
          .ticks(3));
      d3.selectAll('.yAxis > g')
        .attr('class', 'tick yAxis__tick');
      const yTicksValues = d3.selectAll('.yAxis > .tick > text')
        .nodes()
        .map(t => t.innerHTML);
      d3.selectAll('.yAxis > g > text')
        .attr('transform', 'translate(0, -10)')
        .attr('class', 'topLabel');
      d3.selectAll('.yAxis > g')
        .append('text')
        .attr('class', 'precision')
        .data(() => {
          switch (yTicksValues.length) {
            case 3:
              return [0, 0.5, 1];
            case 4:
              return [0, 0.33, 0.66, 1];
            default:
              return [0, 1];
          }
        })
        .text(d => d)
        .attr('transform', 'translate(10, 5)');

      // will need to get (x, y) coordinates for precision points
      yPrecision = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 1]);
    } else {
      y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, minmax[1] > 100
          ? minmax[1] + (0.2 * minmax[1])
          : minmax[1] + 10]);
      svg.append('g')
        .attr('class', 'yAxis')
        .call(d3.axisRight(y)
          .ticks(3));
      d3.selectAll('.yAxis > g')
        .attr('class', 'tick yAxis__tick');
      d3.selectAll('.yAxis > g > text')
        .attr('transform', 'translate(0, -5)');
    }
    return [y, yPrecision];
  }

  /**
 * Attach 'g' tag which contains x axis, scaled by a start time and an
 * end time
 * @param {Object} svg
 * @param {Object} data
 * @param {function} x = d3 scale function
 * @param {function} y = d3 scale function
 * @param {function} yPercent = d3 scale function
 */
  drawLine(svg, data, x, y, yPercent) {
    const { tab, activeView } = this.props;

    const config = this.state.config;
    const height = config.svgHeight
      - config.marginTop
      - config.marginBottom;

    let lineData = [];
    let secondLineData = [];
    let thirdLineData = [];
    if (tab === 'malicious') {
      lineData = formatData(data, 'suspicious');
      secondLineData = formatData(data, 'malicious');
      thirdLineData = formatData(data, 'clusters');
    } else {
      lineData = formatData(data, 'precision');
      secondLineData = formatData(data, 'topLabel');
    }

    const d3Line = d3.line()
      .x(d => x(d.date))
      .y(d => (tab === 'performance' && d.value <= 1
        ? yPercent(d.value)
        : y(d.value)));

    const d3Area = d3.area()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => (tab === 'performance' && d.value <= 1
        ? yPercent(d.value)
        : y(d.value)));

    // path and area for topLabel / precision
    if (tab === 'performance') {
      const firstLineGroup = svg.append('g')
        .attr('class', 'topLabel group');
      firstLineGroup.append('path')
        .data([secondLineData])
        .attr('class', 'line topLabel')
        .attr('d', d3Line);

      firstLineGroup.append('path')
        .data([secondLineData])
        .attr('class', 'area topLabel')
        .attr('d', d3Area)
        .style('fill', 'url(#topLabel)');

      const secondlineGroup = svg.append('g')
        .attr('class', 'precision group');
      secondlineGroup.append('path')
        .data([lineData])
        .attr('class', 'line precision')
        .attr('d', d3Line);
      secondlineGroup.append('path')
        .data([lineData])
        .attr('class', 'area precision')
        .attr('d', d3Area)
        .style('fill', 'url(#precision)');
    } else {
      // path and area for malicious / suspicious
      const firstLineGroup = svg.append('g')
        .attr('class', `suspicious group ${activeView !== 'suspicious' ? 'fade' : ''}`);
      firstLineGroup.append('path')
        .data([lineData])
        .attr('class', 'line suspicious')
        .attr('d', d3Line);
      firstLineGroup.append('path')
        .data([lineData])
        .attr('class', 'area suspicious')
        .attr('d', d3Area)
        .style('fill', 'url(#suspicious)');

      const secondlineGroup = svg.append('g')
        .attr('class', `malicious group ${activeView !== 'malicious' ? 'fade' : ''}`);
      secondlineGroup.append('path')
        .data([secondLineData])
        .attr('class', 'line malicious')
        .attr('d', d3Line);
      secondlineGroup.append('path')
        .data([secondLineData])
        .attr('class', 'area malicious')
        .attr('d', d3Area)
        .style('fill', 'url(#malicious)');

      const thirdlineGroup = svg.append('g')
        .attr('class', `clusters group ${activeView !== 'correlations' ? 'fade' : ''}`);
      thirdlineGroup.append('path')
        .data([thirdLineData])
        .attr('class', 'line clusters')
        .attr('d', d3Line);
      thirdlineGroup.append('path')
        .data([thirdLineData])
        .attr('class', 'area clusters')
        .attr('d', d3Area)
        .style('fill', 'url(#clusters)');
    }
  }

  /**
* For each data object, append a d3 circle on the graph, according to
* it's x and y coordinates
* @param {Object} svg
* @param {Array} data
* @param {String} label
*/
  addPoints(svg, data, label) {
    const { items } = this.props;

    const points = svg.append('g')
      .attr('class', `points ${label}_points`);
    points.selectAll('.pathPoint')
      .data(data)
      .enter().append('circle')
      .attr('class', (d) => {
        if (!isEmpty(this.state.filterDay)
          && moment(d.date, 'x').isSame(this.state.filterDay, 'day')) {
          return `selectedPoint ${label}`;
        }
        return `pathPoint ${label}`;
      })
      .attr('r', (d) => {
        if (d.value !== 0) {
          if (!isEmpty(this.state.filterDay)
            && moment(d.date, 'x').isSame(this.state.filterDay, 'day')) {
            return 6;
          }
          return 5;
        }
        return 0;
      })
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .on('mouseover', function (d) {
        // css
        d3.select(this)
          .classed('active', true)
          .attr('r', 6);
        // tooltip
        this.hoverTimeout = setTimeout(() => {
          removeTooltip();
          d3Tooltip(d.x, d.y, d, label, items);
        }, 200);
      })
      .on('mouseout', function () {
        removeTooltip();
        d3.select(this)
          .classed('active', false)
          .attr('r', 5);
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
      })
      .on('click', (d) => {
        if (isEmpty(this.state.filterDay)) {
          const day = moment(d.date, 'x');
          removeTooltip();
          this.setFilter(day);
        } else {
          this.clearFilter();
        }
      });
  }

  /**
   * Append on svg d3 circles
   * @param {Object} svg
   * @param {Object} data
   * @param {function} x
   * @param {function} y
   * @param {function} yPrecision
 */
  drawTooltip(svg, data, x, y, yPrecision) {
    const { tab, activeView } = this.props;

    let lineData = [];
    let secondLineData = [];
    let thirdLineData = [];
    if (tab === 'malicious') {
      lineData = appendCoordinates(formatData(data, 'suspicious'), x, y);
      secondLineData = appendCoordinates(formatData(data, 'malicious'), x, y);
      thirdLineData = appendCoordinates(formatData(data, 'clusters'), x, y);

      switch (activeView) {
        case 'malicious':
          this.addPoints(svg, secondLineData, 'malicious');
          break;
        case 'suspicious':
          this.addPoints(svg, lineData, 'suspicious');
          break;
        case 'correlations':
          this.addPoints(svg, thirdLineData, 'clusters');
          break;
        default:
          this.addPoints(svg, secondLineData, 'malicious');
          break;
      }
    } else {
      lineData = appendCoordinates(formatData(data, 'precision'), x, yPrecision);
      secondLineData = appendCoordinates(formatData(data, 'topLabel'), x, y);

      this.addPoints(svg, lineData, 'precision');
      this.addPoints(svg, secondLineData, 'topLabel');
    }
  }

  /**
   * Append overlaid dark rectangulars to evidentiate selected day for filtering
   * @param {Object} svg
   * @param {Array} xAxisDelimiters
   * @param {Object} xAxisTicks
 */
  showDaySelectedHighlighted(svg, xAxisDelimiters, xAxisTicks) {
    const config = this.state.config;
    const width = config.svgWidth;
    const height = config.svgHeight;

    const delimiters = this.getDaySelectedDelimiters(xAxisDelimiters, xAxisTicks);

    const darker = d3.select('.diagram__group')
      .append('g')
      .attr('class', 'overlaid_dark_rects');

    if (delimiters[0] === 0 && delimiters[1] === 0) {
      darker.append('rect')
        .attr('x', -(config.marginLeft))
        .attr('y', -(config.marginTop))
        .attr('width', width)
        .attr('height', height);
    } else {
      if (delimiters[0] !== 0) {
        darker.append('rect')
          .attr('x', -(config.marginLeft))
          .attr('y', -(config.marginTop))
          .attr('width', delimiters[0] + config.marginLeft)
          .attr('height', height);
      }
      if (delimiters[1] !== 0) {
        darker.append('rect')
          .attr('x', delimiters[1])
          .attr('y', -config.marginTop)
          .attr('width', (width - delimiters[1]))
          .attr('height', height);
      }
    }
  }

  /**
   * Draw d3 line and triangles as range time
   * Triangles support drag behavior
   * @param {Object} svg
   * @param {Object} timeRangeStart (moment)
   * @param {Object} timeRangeEnd (moment)
 */
  drawRangeTime(svg) {
    const { startDate, endDate } = this.props;
    const config = this.state.config;
    const width = config.svgWidth - (2 * config.marginLeft);
    const height = config.svgHeight - config.marginTop - config.marginBottom;

    const xScale = d3.scaleTime()
      .range([+new Date(startDate), +new Date(endDate)])
      .domain([0, width]);
    const timeRangePath = svg.append('g')
      .attr('class', 'timeRange')
      .attr('transform', `translate(0, ${height})`);

    const startX = this.props.timeRangeStartPosition;
    const endX = this.props.timeRangeEndPosition;

    timeRangePath.append('line')
      .attr('class', 'timeRange timeRangeLine')
      .attr('x1', startX)
      .attr('y1', 0)
      .attr('x2', endX)
      .attr('y2', 0);

    const triangles = d3Triangles(timeRangePath, startX, endX - 7);

    const dragStartTriangle = d3.drag()
      .on('drag', () => {
        const x = d3.event.x;
        if (x > 0 && x < width) {
          timeRangePath.select('.timeRange__triangle.start').attr('transform', `translate(${x}, -3)`);
          timeRangePath.select('.timeRangeLine').attr('x1', x);
        }
      })
      .on('end', () => {
        const x = d3.event.x;
        if (x > 0 && x < width) {
          this.props.updateRangePercent('start', x);
          this.props.setTimeRange('start', moment(xScale(x), 'x'), x);
        }
      });

    const dragEndTriange = d3.drag()
      .on('drag', () => {
        const x = d3.event.x;
        if (x > 0 && x < width) {
          timeRangePath.select('.timeRange__triangle.end').attr('transform', `translate(${x}, -3)`);
          timeRangePath.select('.timeRangeLine').attr('x2', x);
        }
      })
      .on('end', () => {
        const x = d3.event.x;
        if (x > 0 && x < width) {
          this.props.updateRangePercent('end', x);
          this.props.setTimeRange('end', moment(xScale(x), 'x'), x);
        }
      });

    triangles.select('.timeRange__triangle.start').call(dragStartTriangle);
    triangles.select('.timeRange__triangle.end').call(dragEndTriange);
  }

  /**
 * If there is no data, draw just x and y axis
 */
  drawAxes() {
    const { startDate, endDate, tab } = this.props;
    const { config } = this.state;
    const height = config.svgHeight - config.marginTop - config.marginBottom;

    const svg = this.getSvgNode();

    const x = this.xAxis(svg, startDate.startOf('day'), endDate.endOf('day'));
    this.yAxis(svg);
    addDashedLineDelimiters(svg, height, x);

    if (tab === 'malicious') {
      const { timeRangeStart, timeRangeEnd } = this.props;
      this.drawRangeTime(svg, timeRangeStart, timeRangeEnd);
    }
  }

  /**
 * Draw the svg, X and Y axis, lines and areas determined by the data
 */
  drawGraph() {
    const {
      startDate,
      endDate,
      items,
      tab,
    } = this.props;

    const { config } = this.state;
    const height = config.svgHeight - config.marginTop - config.marginBottom;

    const svg = this.getSvgNode();

    const x = this.xAxis(svg, startDate.startOf('day'), endDate.endOf('day'));
    const minmax = getMinMax(items);
    const y = this.yAxis(svg, minmax);

    this.drawLine(svg, items, x, y[0], y[1]);
    this.drawTooltip(svg, items, x, y[0], y[1]);

    const xAxisDelimiters = addDashedLineDelimiters(svg, height, x)[0];
    const xAxisTicks = addDashedLineDelimiters(svg, height, x)[1];
    if (!isEmpty(this.state.filterDay)) {
      this.showDaySelectedHighlighted(svg, xAxisDelimiters, xAxisTicks);
    }

    if (tab === 'malicious') {
      const { timeRangeStart, timeRangeEnd } = this.props;
      this.drawRangeTime(svg, timeRangeStart, timeRangeEnd);
    }
  }

  render() {
    const config = this.state.config;
    const filterActive = this.state.filterDay;
    return (
      <div className="timeline_diagram_container">
        <svg
          ref={node => this.svgNode = node}
          width={config.svgWidth - config.marginLeft}
          height={config.svgHeight}
        >
          <defs>
            <linearGradient id="suspicious" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="40%" style={{ 'stopColor': '#fffa00', 'stopOpacity': 1 }} />
              <stop offset="100%" style={{ 'stopColor': '#fffa00', 'stopOpacity': 0.3 }} />
            </linearGradient>
            <linearGradient id="malicious" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="40%" style={{ 'stopColor': '#ff0000', 'stopOpacity': 1 }} />
              <stop offset="100%" style={{ 'stopColor': '#ff0000', 'stopOpacity': 0.3 }} />
            </linearGradient>
            <linearGradient id="clusters" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="40%" style={{ 'stopColor': '#ff9d00', 'stopOpacity': 1 }} />
              <stop offset="100%" style={{ 'stopColor': '#ff9d00', 'stopOpacity': 0.3 }} />
            </linearGradient>
            <linearGradient id="precision" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="40%" style={{ 'stopColor': '#c700ff', 'stopOpacity': 1 }} />
              <stop offset="100%" style={{ 'stopColor': '#c700ff', 'stopOpacity': 0.3 }} />
            </linearGradient>
            <linearGradient id="topLabel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="40%" style={{ 'stopColor': '#7ed321', 'stopOpacity': 1 }} />
              <stop offset="100%" style={{ 'stopColor': '#7ed321', 'stopOpacity': 0.3 }} />
            </linearGradient>
          </defs>
        </svg>
        {!isEmpty(filterActive)
          ? <FilterNotification date={filterActive} clearFilter={this.clearFilter} />
          : null
        }
      </div>
    );
  }
}

TimelineDiagram.displayName = 'TimelineDiagram';
TimelineDiagram.propTypes = {
  'config': PropTypes.object,
  'startDate': PropTypes.object,
  'endDate': PropTypes.object,
  'tab': PropTypes.string,
  'items': PropTypes.object,
  'onDayClick': PropTypes.func,

  'resetDayClick': PropTypes.func,
  'timeRangeStart': PropTypes.object,
  'timeRangeStartPosition': PropTypes.number,
  'setTimeRange': PropTypes.func,
  'timeRangeEnd': PropTypes.object,
  'timeRangeEndPosition': PropTypes.number,
  'updateRangePercent': PropTypes.func,
  'activeView': PropTypes.string.isRequired,
};
TimelineDiagram.defaultProps = {
  'config': {},
  'startDate': {},
  'endDate': {},
  'tab': 'malicious',
  'items': {},
  'onDayClick': () => null,
  'resetDayClick': () => null,
  'timeRangeStart': {},
  'timeRangeStartPosition': 0,
  'setTimeRange': () => null,
  'timeRangeEnd': {},
  'timeRangeEndPosition': 0,
  'updateRangePercent': () => null,
};

export default TimelineDiagram;
