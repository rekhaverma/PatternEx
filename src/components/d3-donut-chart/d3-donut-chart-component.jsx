import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { pipelineToName } from 'lib/decorators';
import './d3-donut-chart-style.scss';

const pieItems = {
  'outerRadius': 100,
  'innerRadius': 65,
  'pieTextHeight': 13,
  'legendMarginTop': 30,
};

/**
 * Select content of donut chart diagram and removes it
 */
const deleteNodeContent = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
  return node;
};

class DonutChart extends PureComponent {
  constructor(...args) {
    super(...args);

    this.svgNode = null;
    this.renderD3 = this.renderD3.bind(this);
  }

  componentDidMount() {
    const { data } = this.props;
    this.renderD3(data);
    this.addLegend(data);
  }

  componentDidUpdate() {
    const { data } = this.props;
    deleteNodeContent(this.pieChart);
    deleteNodeContent(this.pieChartLegend);
    deleteNodeContent(this.pieChartPercentages);
    this.renderD3(data);
    this.addLegend(data);
  }

  addLegend(data) {
    const node = this.svgNode;
    const svg = d3.select(node);

    const width = 700;

    const legend = svg.select('.legend')
      .attr('transform', `translate(${width / 1.7}, ${pieItems.legendMarginTop})`);

    legend
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('fill', d => d.color)
      .attr('r', '6')
      .attr('cy', (d, i) => (20 * (i + 1)) - 5);

    legend
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(d => d.label)
      .attr('y', (d, i) => 20 * (i + 1))
      .attr('x', 10);

    const percentages = svg.select('.percentages')
      .attr('transform', `translate(${width / 1.2}, ${pieItems.legendMarginTop})`);

    const itemsNumber = data.reduce((acc, current) => acc + parseInt(current.count, 10), 0);

    percentages
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(d => `${((d.count * 100) / itemsNumber).toFixed(2)}%`)
      .attr('y', (d, i) => 20 * (i + 1));
  }

  addPiechartText() {
    const { startDate, endDate, pipeline } = this.props;

    const svg = d3.select(this.svgNode);
    const piechart = svg.select('.piechart');

    const pieText = [
      pipeline !== '' ? `${pipelineToName(pipeline)} for` : '',
      `${startDate.format('MM-DD-YYYY')}`,
      'to',
      `${endDate.format('MM-DD-YYYY')}`];

    const text = piechart.selectAll('text')
      .data(pieText);

    text.enter()
      .append('text')
      .attr('class', 'enter')
      .attr('x', (d, i) => {
        switch (i) {
          case 0:
            return -32;
          case 1:
          case 3:
            return -30;
          default:
            return 0;
        }
      })
      .attr('y', (d, i) => i * pieItems.pieTextHeight)
      .text(d => d);

    text.text(d => d);

    text.exit().remove();
  }

  renderD3(data) {
    const node = this.svgNode;
    const { width, height } = this.props.config;
    const { showPieText } = this.props;

    const arc = d3.arc()
      .innerRadius(pieItems.innerRadius)
      .outerRadius(pieItems.outerRadius);
    const pie = d3.pie()
      .sort(null)
      .value(d => d.count);

    const svg = d3.select(node);
    const piechart = svg.select('.piechart')
      .attr('transform', `translate(${width / 3}, ${height / 2})`);

    const piechartData = piechart.selectAll('path')
      .data(pie(data));

    // enter
    piechartData
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color);

    // update
    piechartData
      .attr('d', arc)
      .attr('fill', d => d.data.color);

    // exit
    piechartData.exit().remove();

    if (showPieText) {
      this.addPiechartText();
    }
  }

  render() {
    const { config } = this.props;

    return (
      <div>
        <svg
          ref={node => this.svgNode = node}
          className="pipeline__chart"
          width={config.width}
          height={config.height}
        >
          <g className="piechart" ref={node => this.pieChart = node} />
          <g className="legend" ref={node => this.pieChartLegend = node} />
          <g className="percentages" ref={node => this.pieChartPercentages = node} />
        </svg>
      </div>
    );
  }
}

DonutChart.displayName = 'DonutChart';
DonutChart.propTypes = {
  'config': PropTypes.object,
  'data': PropTypes.array,
  'showPieText': PropTypes.bool,
  'startDate': PropTypes.object,
  'endDate': PropTypes.object,
  'pipeline': PropTypes.string,
};
DonutChart.defaultProps = {
  'config': {},
  'data': [],
  'showPieText': false,
  'startDate': {},
  'endDate': {},
  'pipeline': '',
};

export default DonutChart;
