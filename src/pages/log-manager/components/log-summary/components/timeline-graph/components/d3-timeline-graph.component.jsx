import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';

const capitalize = word => word.charAt(0).toUpperCase() + word.slice(1);
const noDataMessage = 'There is no data to be displayed';

const timeFormat = (startDate, endDate) => {
  const distance = (+new Date(endDate)) - (+new Date(startDate));
  return (distance < 1000 * 60 * 60 * 24 * 2) ? '%H:%M' : '%m-%d-%Y';
};

const bytesToString = (bytes) => {
  const fmt = d3.format('.0f');
  if (bytes < 1024) {
    return `${fmt(bytes)} B`;
  } else if (bytes < 1024 * 1024) {
    return `${fmt(bytes / 1024)} kB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${fmt(bytes / 1024 / 1024)} MB`;
  }
  return `${fmt(bytes / 1024 / 1024 / 1024)} GB`;
};

const addDashedLine = (group, height, position) => {
  group.append('line')
    .attr('x1', position)
    .attr('y1', 0)
    .attr('x2', position)
    .attr('y2', height);
};

const deleteSvgNodes = () => {
  d3.selectAll('.d3-timeline-graph__xAxis > *').remove();
  d3.selectAll('.d3-timeline-graph__yAxis > *').remove();
  d3.selectAll('.d3-timeline-graph__lines > *').remove();
  d3.selectAll('.d3-timeline-graph__points > *').remove();
  d3.selectAll('.d3-timeline-graph__dashedLineGroup').remove();
};

const appendTooltip = (xPos, yPos, data, key) => {
  const tooltip = d3.select('.d3-timeline-graph')
    .append('div')
    .attr('data-placement', 'bottom')
    .attr('class', 'popper-wrap')
    .style('position', 'absolute');
  tooltip.append('span')
    .attr('class', 'popper__arrow');
  tooltip.append('div')
    .attr('class', 'popper')
    .append('div')
    .attr('class', 'popper__info')
    .append('span')
    .html(() => `${capitalize(key)}: ${key === 'storage' ? bytesToString(data[key]) : data[key].toLocaleString()}`);
  tooltip.style('left', `${xPos - 17}px`)
    .style('top', `${yPos + 15}px`);
};

class D3TimelineGraph extends Component {
  constructor(...args) {
    super(...args);

    this.svgNode = null;
    this.renderD3 = this.renderD3.bind(this);
  }

  componentDidMount() {
    this.renderD3();
  }

  componentDidUpdate() {
    deleteSvgNodes();
    this.renderD3();
  }

  getSvgNode() {
    const { config, className } = this.props;

    const node = this.svgNode;
    return d3.select(node)
      .select(`.${className}__group`)
      .attr('transform', `translate(${config.marginLeft}, ${config.marginTop})`);
  }

  xAxis(svg, firstDay, lastDay) {
    const { config, className } = this.props;
    const width = config.svgWidth - (config.marginLeft * 2);
    const height = config.svgHeight - config.marginTop - config.marginBottom;

    const startDate = firstDay.startOf('day');
    const endDate = lastDay.endOf('day');

    const distance = endDate.diff(startDate, 'days');

    const x = d3.scaleTime()
      .range([0, width])
      .domain([new Date(startDate), new Date(endDate)]);

    svg.select(`.${className}__xAxis`)
      .attr('transform', `translate(${config.marginLeft}, ${height})`)
      .call(d3.axisTop(x)
        .ticks(distance > 20 ? 8 : null)
        .tickFormat(d3.timeFormat(timeFormat(startDate, endDate))));

    return x;
  }

  yAxis(svg, label = '', data = []) {
    const { config, className } = this.props;
    const height = config.svgHeight - config.marginTop - config.marginBottom;

    const y = d3.scaleLinear()
      .range([height, config.marginBottom])
      .domain([0, d3.max(data, d => Math.max(d[label])) || 100]);

    const axisRight = d3.axisRight(y)
      .ticks(3)
      .tickFormat(bytesToString);
    const axisLeft = d3.axisLeft(y)
      .ticks(3)
      .tickFormat(d3.format(','));

    svg.select(label !== '' ? `.${className}__yAxis.${label}` : `.${className}__yAxis`)
      .attr('transform', `translate(${config.marginLeft}, 0)`)
      .call(label === 'storage' ? axisRight : axisLeft);

    return y;
  }

  drawLine(svg, x, y, key, data) {
    const { className } = this.props;

    const d3line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d[key]));

    const lineGroup = svg.select(`.${className}__lines`);
    const lineGroupData = lineGroup.selectAll(`.${key}-line`)
      .data([data]);
    lineGroupData.enter()
      .append('path')
      .attr('class', `${key}-line`)
      .attr('d', d3line);
    lineGroupData
      .attr('d', d3line(data));
    lineGroupData.exit().remove();
  }

  drawPoints(svg, x, y, key, data) {
    const { config, className } = this.props;

    const pointsGroup = svg.select(`.${className}__points`);
    const pointsGroupData = pointsGroup.selectAll(`.point.${key}-point`)
      .data(data);
    pointsGroupData.enter()
      .append('circle')
      .attr('class', `point ${key}-point`)
      .attr('r', 7)
      .attr('fill', config.color[key])
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d[key]));

    pointsGroupData
      .attr('fill', config.color[key])
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d[key]));

    pointsGroup
      .selectAll(`.point.${key}-point`)
      .on('mouseover', (d) => {
        d3.selectAll('.popper-wrap').remove();
        appendTooltip(x(d.date), y(d[key]), d, key);
      })
      .on('mouseout', () => {
        d3.selectAll('.popper-wrap').remove();
      });

    pointsGroupData.exit().remove();
  }

  addDashedLineDelimiters(svg, height, scale) {
    const { className } = this.props;

    let tickWidth = 0;

    d3.selectAll(`.${className}__xAxis > g > text`)
      .nodes()
      .map((t) => {
        if (t instanceof SVGElement) {
          tickWidth = t.getBoundingClientRect().width;
        }
        return t.innerHTML;
      });

    let defaultTicksPosition = [];

    d3.selectAll(`.${className}__xAxis > g > text`)
      .each(d => defaultTicksPosition = [...defaultTicksPosition, scale(d)]);

    let delimiters = [];

    if (defaultTicksPosition.length > 1) {
      defaultTicksPosition.forEach((tick, i) => {
        if (defaultTicksPosition[i] && defaultTicksPosition[i + 1]) {
          delimiters = [
            ...delimiters,
            ((defaultTicksPosition[i] + defaultTicksPosition[i + 1] + tickWidth) / 2),
          ];
        }
      });
    }

    const dashedLines = svg.append('g')
      .attr('class', `${className}__dashedLineGroup`);

    delimiters.forEach((position) => {
      addDashedLine(dashedLines, height, position);
    });
  }

  addMessage(svg, message) {
    const { className, config } = this.props;

    const xPos = (config.svgWidth - (config.marginLeft * 4)) / 2;
    const yPos = (config.svgHeight - config.marginTop - config.marginBottom) / 2;

    const textNode = svg
      .select(`.${className}__message`)
      .attr('transform', `translate(${xPos}, ${yPos})`);

    let index = 0;
    const appendText = () => {
      textNode
        .text(message.substring(0, index));
      index += 1;

      if (index <= message.length) {
        setTimeout(appendText, 0);
      }
    };

    appendText();
  }

  renderD3() {
    const { startDate, endDate, data, config } = this.props;
    const height = config.svgHeight - config.marginTop - config.marginBottom;

    const svg = this.getSvgNode();

    const x = this.xAxis(svg, startDate, endDate);

    if (data.length > 0) {
      const yAxisLabels = Object.keys(data[0]).filter(label => label !== 'date');

      yAxisLabels.forEach((yAxisLabel) => {
        const y = this.yAxis(svg, yAxisLabel, data);
        this.drawLine(svg, x, y, yAxisLabel, data);
        this.drawPoints(svg, x, y, yAxisLabel, data);
        this.addMessage(svg, '');
      });
    } else {
      this.yAxis(svg);
      this.addMessage(svg, noDataMessage);
    }
    this.addDashedLineDelimiters(svg, height, x);
  }

  render() {
    const { config, className } = this.props;

    return (
      <div className={className}>
        <svg ref={node => this.svgNode = node} width={config.svgWidth} height={config.svgHeight}>
          <g className={`${className}__group`}>
            <g className={`${className}__xAxis`} />
            <g className={`${className}__yAxis`} />
            <g className={`${className}__yAxis entities`} />
            <g className={`${className}__yAxis storage`} />
            <g className={`${className}__lines`} />
            <g className={`${className}__points`} />
            <text className={`${className}__message`} />
          </g>
        </svg>
      </div>
    );
  }
}

D3TimelineGraph.displayName = 'D3TimelineGraph';
D3TimelineGraph.propTypes = {
  'config': PropTypes.object,
  'data': PropTypes.array,
  'startDate': PropTypes.object,
  'endDate': PropTypes.object,
  'className': PropTypes.string,
};

D3TimelineGraph.defaultProps = {
  'config': {},
  'data': [],
  'startDate': {},
  'endDate': {},
  'className': 'd3-timeline-graph',
};

export default D3TimelineGraph;
