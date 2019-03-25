
import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import moment from 'moment';

import { FormattedHTMLMessage } from 'react-intl';

import { sidebarMenuWidth } from 'config';
import { pipelineToName } from 'lib/decorators';

import NoData from 'components/no-data';

const pieItems = {
  'outerRadius': 100,
  'innerRadius': 65,
  'pieTextHeight': 13,
  'legendMarginTop': 30,
};

const margin = {
  'left': 30,
};

class PieChart extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      'svgWidth': parseInt((window.innerWidth - sidebarMenuWidth) / 2, 10),
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
    const { tags } = this.props.data;
    this.renderD3(tags);
    this.addLegend(tags);
  }

  componentDidUpdate() {
    const { tags } = this.props.data;
    this.renderD3(tags);
    this.addLegend(tags);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    if (window.innerWidth <= 1060) {
      this.setState({
        'svgWidth': parseInt((window.innerWidth - sidebarMenuWidth - (2 * margin.left)), 10),
      });
    } else {
      this.setState({
        'svgWidth': parseInt((window.innerWidth - sidebarMenuWidth) / 2, 10),
      });
    }
  }

  addLegend(data) {
    const { svgWidth } = this.state;
    const node = this.svgNode;
    const svg = d3.select(node);

    const legend = svg.select('.legend');
    legend.attr('transform', `translate(${svgWidth / 1.7}, 0)`);

    // append circles colored in coresponding threat's color
    const circleGroupData = legend.selectAll('circle')
      .data(data);
    circleGroupData.enter()
      .append('circle')
      .attr('fill', d => d.color)
      .attr('r', '6')
      .attr('cy', (d, i) => (20 * (i + 1)) - 5);
    circleGroupData
      .attr('fill', d => d.color)
      .attr('r', '6')
      .attr('cy', (d, i) => (20 * (i + 1)) - 5);
    circleGroupData.exit().remove();

    // append threats names
    const namesGroupData = legend.selectAll('text')
      .data(data);
    namesGroupData.enter()
      .append('text')
      .text(d => d.label)
      .attr('y', (d, i) => 20 * (i + 1))
      .attr('x', 10);
    namesGroupData
      .text(d => d.label)
      .attr('y', (d, i) => 20 * (i + 1))
      .attr('x', 10);
    namesGroupData.exit().remove();

    // append percentages
    const percentages = svg.select('.percentages');
    percentages.attr('transform', `translate(${svgWidth / 1.2}, 0)`);

    const entitiesNumber = data.reduce((acc, currentItem) => acc + currentItem.count, 0);

    const percentagesGroupData = percentages.selectAll('text')
      .data(data);

    percentagesGroupData.enter()
      .append('text')
      .text(d => `${((d.count * 100) / entitiesNumber).toFixed(2)}%`)
      .attr('y', (d, i) => 20 * (i + 1));
    percentagesGroupData
      .text(d => `${((d.count * 100) / entitiesNumber).toFixed(2)}%`)
      .attr('y', (d, i) => 20 * (i + 1));
    percentagesGroupData.exit().remove();
  }

  renderD3(data) {
    const { svgWidth, svgHeight } = this.state;
    const node = this.svgNode;

    const arc = d3.arc()
      .innerRadius(pieItems.innerRadius)
      .outerRadius(pieItems.outerRadius);
    const d3pie = d3.pie()
      .sort(null)
      .value(d => d.count);

    const svg = d3.select(node);
    const pie = svg.select('.pie')
      .attr('transform', `translate(${svgWidth / 3}, ${svgHeight / 2})`);

    const pieText = pie.selectAll('text')
      .data([pipelineToName(this.props.pipeline)]);
    pieText
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .text(d => d);
    pieText
      .text(d => d);
    pieText.exit().remove();

    const piechartData = pie.selectAll('path')
      .data(d3pie(data));

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
  }

  render() {
    const { tags, totalCount } = this.props.data;

    const entitiesNumber = tags.length > 0 ? tags.reduce((acc, item) => acc + item.count, 0) : 0;

    const title = (
      <div className={`${this.props.className}__chartTitle`}>
        <FormattedHTMLMessage
          id="pipeline.piechart.title"
          values={{
            'threats': entitiesNumber,
            'entities': totalCount,
            'date': moment(this.props.calendarDay).format('MM - DD - YYYY'),
          }}
        />
      </div>
    );

    if (tags.length > 0) {
      return (
        <div className={`${this.props.className}__chart`}>
          {title}
          <svg
            ref={node => this.svgNode = node}
            className="piechart"
            width={this.state.svgWidth - margin.left}
            height={this.state.svgHeight}
          >
            <g className="pie" />
            <g className="legend" />
            <g className="percentages" />
          </svg>
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

PieChart.displayName = 'PieChart';
PieChart.propTypes = {
  'className': PropTypes.string,
  'data': PropTypes.object,
  'calendarDay': PropTypes.object,
  'pipeline': PropTypes.string,
};
PieChart.defaultProps = {
  'className': '',
  'data': {},
  'calendarDay': {},
  'pipeline': '',
};

export default PieChart;

