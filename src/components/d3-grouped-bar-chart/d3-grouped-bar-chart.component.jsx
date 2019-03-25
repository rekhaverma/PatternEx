import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { isEmpty } from 'lodash';

import './d3-grouped-bar-chart-style.scss';

const margin = {
  'top': 30,
  'right': 50,
  'bottom': 50,
  'left': 30,
};

/**
 * Select content of timeline diagram and removes it
 */
const deleteSvg = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
  return node;
};

class GroupedBarChart extends PureComponent {
  constructor(...args) {
    super(...args);

    this.drawGraph = this.drawGraph.bind(this);
    this.getSvgNode = this.getSvgNode.bind(this);
    this.drawAxisAndBars = this.drawAxisAndBars.bind(this);
  }

  componentDidMount() {
    const { items } = this.props;
    if (!isEmpty(items)) {
      this.drawGraph();
    }
  }

  componentDidUpdate() {
    const { items } = this.props;

    deleteSvg(this.svgNode);
    if (!isEmpty(items)) {
      this.drawGraph();
    }
  }

  /**
   * Attach 'g' tag to svg reference
   * @return {Object}
   */
  getSvgNode() {
    const node = this.svgNode;
    return d3.select(node)
      .attr('class', 'grouped_bar_chart_diagram')
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('class', 'diagram__group');
  }

  /**
   * Draw axis of the graph
   * @param {object} chartGroup - g element of svg
   * @param {number} height - height of the chart
   * @param {number} width - width of the chart
   * @param {array} items - data
   * @param {array} keys - keys of item object
   * @return {Object}
   */
  drawAxisAndBars(chartGroup, height, width, items, keys) {
    const { colors } = this.props;
    const x0 = d3.scaleBand()
      .rangeRound([0, width - (margin.left + margin.right) - 120])
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .padding(0.05);

    const y = d3.scaleLinear()
      .rangeRound([height - margin.top, 0]);

    x0.domain(items.map(d => d.name));
    y.domain([0, d3.max(items, d => d3.max(keys, key => d[key]))]).nice();

    chartGroup.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${height - margin.top})`)
      .call(d3.axisBottom(x0));

    chartGroup.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(y).ticks(null, 's').tickSize(-width + (margin.left + margin.right) + 120, 0, 0)
        .tickFormat(d => d))
      .append('text')
      .attr('x', 2)
      .attr('y', y(y.ticks().pop()) + 0.5);

    chartGroup.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y));

    chartGroup.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height - margin.top})`)
      .call(d3.axisBottom(x0));

    const xBands = chartGroup.append('g')
      .selectAll('g')
      .data(items)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${x0(d.name)},0)`);

    items.forEach((item, index) => {
      const dataKeys = [];

      Object.keys(item).forEach((key) => {
        if (item[key] > 0) {
          dataKeys.push(key);
        }
      });

      x1.domain(dataKeys).rangeRound([0, x0.bandwidth()]);

      d3.select(xBands._groups[0][index]).selectAll('rect')
        .data(() => dataKeys.map(key => ({ key, value: item[key] })))
        .enter()
        .append('rect')
        .attr('x', d => x1(d.key))
        .attr('y', d => y(d.value))
        .attr('width', x1.bandwidth())
        .attr('height', d => height - margin.top - y(d.value))
        .attr('fill', (d, i) => colors[i]);
    });

    return { x0, x1, y };
  }

  /**
   * Draw legend of the chart
   * @param {object} chartGroup - g element of svg
   * @param {number} width - width of the chart
   * @param {array} keys - keys of item object
   */
  drawLegend(chartGroup, width, keys) {
    const { colors } = this.props;
    const legend = chartGroup.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(-90,-60)')
      .selectAll('g')
      .data(keys.slice().reverse())
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0,${i * 20})`);


    legend.append('circle')
      .attr('fill', (d, i) => colors[i])
      .attr('r', '6')
      .attr('cx', width - 63)
      .attr('cy', '10');

    legend.append('text')
      .attr('x', width - 53)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d);
  }

  /**
   * Draw graph
   */
  drawGraph() {
    const { items, config } = this.props;
    let keys = [];
    if (items && items.length) {
      keys = Object.keys(items[0]);
      keys.splice(keys.indexOf('name'), 1);
    }

    const chartWidth = config.svgWidth - (margin.left + margin.right);
    const chartHeight = config.svgHeight - (margin.top + margin.bottom);
    const svg = this.getSvgNode();

    const chartGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    this.drawAxisAndBars(chartGroup, chartHeight, chartWidth, items, keys);

    this.drawLegend(chartGroup, chartWidth, keys);
  }

  render() {
    const config = this.props.config;
    return (
      <div className="grouped_bar_chart_container graphSection" style={{ 'maxWidth': config.svgWidth }}>
        <svg
          ref={node => this.svgNode = node}
          width={config.svgWidth - margin.left - margin.right}
          height={config.svgHeight - margin.top}
        />
      </div>
    );
  }
}

GroupedBarChart.displayName = 'GroupedBarChart';
GroupedBarChart.propTypes = {
  'config': PropTypes.object,
  'items': PropTypes.array,
  'colors': PropTypes.array,
};
GroupedBarChart.defaultProps = {
  'config': {},
  'items': [],
  'colors': [],
};

export default GroupedBarChart;
