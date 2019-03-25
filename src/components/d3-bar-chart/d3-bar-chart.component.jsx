import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { isEmpty } from 'lodash';

import './d3-bar-chart-style.scss';

/**
 * Color for data with legend others
 */
const othersSliceColor = '#909090';

const margin = {
  left: 40,
  top: 50,
  bottom: 50,
};

/**
 * Select content of bar chart diagram and removes it
 */
const deleteSvg = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
  return node;
};

/**
* Sorts the data passed to it
*/
const sortData = items =>
  items.sort((a, b) =>
    a.value - b.value);

class BarChartDiagram extends PureComponent {
  constructor(...args) {
    super(...args);

    this.drawGraph = this.drawGraph.bind(this);
    this.getSvgNode = this.getSvgNode.bind(this);
    this.xAxis = this.xAxis.bind(this);
    this.yAxis = this.yAxis.bind(this);
    this.drawAxes = this.drawAxes.bind(this);
    this.drawBars = this.drawBars.bind(this);
    this.drawBarText = this.drawBarText.bind(this);
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
      .attr('class', 'bar_chart_diagram')
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('class', 'diagram__group');
  }

  /**
  * Attach 'g' tag which contains x axis
  * @param {Object} svg
  * @return {function} x = d3 scale function
  */
  xAxis(svg, items) {
    const { config } = this.props;
    const width = config.svgWidth - margin.left - 150;
    const height = config.svgHeight - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .range([0, width])
      .round(true)
      .padding(0.5);

    const xAxis = d3.axisBottom(x);

    x.domain(items.map(d =>
      d.name));

    svg.append('g')
      .attr('class', 'xAxis axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('.tick text');

    d3.selectAll('.xAxis > g')
      .attr('class', 'tick xAxis__tick');

    d3.selectAll('g.xAxis g.tick line')
      .attr('y2', (d, index) => {
        // d for the tick line is the value
        // of that tick
        // (a number between 0 and 1, in this case)
        if (index % 2) { // if it's an even multiple of 10%
          return 25;
        }
        return 10;
      });

    d3.selectAll('g.xAxis g.tick text')
      .attr('y', (d, index) => {
        if (index % 2) { return 27; }
        return 10;
      });

    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    return x;
  }

  /**
  * Attach 'g' tag which contains y axis
  * @param {Object} svg
  * @param {array} items
  * @return {function} y = d3 scale function
  */
  yAxis(svg, items) {
    const { config, yAxisText = '' } = this.props;
    const height = config.svgHeight - margin.top - margin.bottom;
    const width = config.svgWidth - margin.left - 150;

    const y = d3.scaleLinear()
      .range([height, 0]);

    y.domain([0, (d3.max(items, d =>
      d.value)) + 5 || 0]);
    const yAxis = d3.axisLeft(y)
      .tickSize(-width)
      .ticks(7)
      .tickFormat(d3.format('d'));

    svg.append('g')
      .attr('class', 'y-axis axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .style('font-size', '12')
      .text(yAxisText);

    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .ticks(7));

    return y;
  }

  /**
  * Draw axis of chart
  * @param {array} items
  */
  drawAxes(items = []) {
    const svg = this.getSvgNode();
    const y = this.yAxis(svg, items);
    const x = this.xAxis(svg, items);
    return { x, y };
  }

  /**
  * Draw bars of chart
  * @param {object} x - x axis function
  * @param {object} y - y axis function
  * @param {array} items
  */
  drawBars(x, y, items) {
    const svg = this.getSvgNode();
    const { config } = this.props;
    const height = config.svgHeight - margin.top - margin.bottom;

    svg.selectAll('.bar')
      .data(items)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value))
      .style('fill', d => d.color || othersSliceColor);

    this.drawBarText(height, x, y, items);
  }

  /**
  * Add text to the bars
  * @param {number} height - height of chart
  * @param {object} x - x axis
  * @param {object} y - y axis
  * @param {array} items - data array
  */
  drawBarText(height, x, y, items) {
    const svg = this.getSvgNode();
    svg.selectAll('.bartext')
      .data(items)
      .enter().append('text')
      .attr('class', 'bartext')
      .attr('text-anchor', 'middle')
      .attr('x', d =>
        x(d.name) + (x.bandwidth() / 2))
      .attr('y', d =>
        Math.min(height - 10, y(d.value) + 20))
      .text(d =>
        d.value);
  }

  /**
  * Add legend to the chart
  * @param {array} items - data array
  */
  drawLegend(items) {
    const svg = this.getSvgNode();
    const { config } = this.props;
    const width = config.svgWidth - margin.left;

    const legend = svg.selectAll('.legend')
      .data(items)
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(-120,${i * 19})`);

    legend.append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', d => d.color || othersSliceColor);

    legend.append('text')
      .attr('x', width + 5)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text(d => d.name);
  }

  /**
  * Draw the svg, X and Y axis, lines and areas determined by the data
  */
  drawGraph() {
    deleteSvg(this.svgNode);
    const svg = this.getSvgNode();
    let { items } = this.props;
    const { config, drawLegend } = this.props;

    if (items && items.length) {
      const { header, maxSlice } = this.props;
      const { svgWidth } = config;
      if (maxSlice && items.length > maxSlice) {
        items = sortData(items);

        const sliceCounter = (maxSlice - 1);
        const remCounter = items.length - sliceCounter;

        if (remCounter) {
          let othersCount = 0;
          items.slice(0, remCounter).forEach((data) => {
            othersCount += data.value;
          });

          items = items.slice(-sliceCounter);
          items.push({ name: 'Others', value: othersCount });
        }
      }

      const { x, y } = this.drawAxes(items);
      this.drawBars(x, y, items);
      if (drawLegend) {
        this.drawLegend(items);
      }

      svg.append('text')
        .attr('class', 'header')
        .attr('text-anchor', 'middle')
        .text(header)
        .attr('x', function () {
          return (svgWidth - this.getComputedTextLength()) / 2;
        })
        .attr('y', margin.top / -2);
    }
  }

  render() {
    const { config } = this.props;
    return (
      <div className="bar_chart_diagram_container graphSection">
        <svg
          ref={node => this.svgNode = node}
          width={config.svgWidth}
          height={config.svgHeight}
        >
          <defs />
        </svg>
      </div>
    );
  }
}

BarChartDiagram.displayName = 'BarChartDiagram';
BarChartDiagram.propTypes = {
  'config': PropTypes.object,
  'items': PropTypes.array,
  'yAxisText': PropTypes.string,
  'header': PropTypes.string,
  'maxSlice': PropTypes.number,
  'drawLegend': PropTypes.bool,
};
BarChartDiagram.defaultProps = {
  'config': {},
  'items': [],
  'yAxisText': '',
  'header': '',
  'maxSlice': 10,
  'drawLegend': false,
};

export default BarChartDiagram;
