import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { radius } from './config';

import './d3-piechart.style.scss';

class D3Piechart extends PureComponent {
  constructor(...args) {
    super(...args);

    this.svgNode = null;
    this.renderD3 = this.renderD3.bind(this);
  }

  componentDidMount() {
    const { data } = this.props;
    this.renderD3(data);
  }

  componentDidUpdate() {
    const { data } = this.props;
    this.renderD3(data);
  }

  renderD3(data) {
    const node = this.svgNode;
    const svg = d3.select(node);
    const { hoveredSlice } = this.props;

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius * 2);

    const pie = d3.pie()
      .sort(null)
      .value(d => d.percent);

    const piechart = svg.select('.chart__piechart')
      .attr('transform', `translate(${node.clientWidth / 2}, ${node.clientHeight / 2})`);

    const piechartData = piechart
      .selectAll('.chart__piechart')
      .data(pie(data));

    // enter
    piechartData
      .enter()
      .append('path')
      .attr('class', 'chart__piechart')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .each(function (d) {
        if (d.data.id === hoveredSlice) {
          d3.select(this)
            .attr('stroke', 'transparent')
            .attr('class', 'chart__piechart +isHovered')
            .transition()
            .duration(1000)
            .style('filter', 'url(#sliceShadow)')
            .attr('d', d3.arc().innerRadius(0).outerRadius((radius * 2) + 5));
        } else {
          d3.select(this).transition().duration(800)
            .attr('d', arc)
            .style('filter', '')
            .attr('class', 'chart__piechart');
        }
      });

    // update
    piechartData
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .each(function (d) {
        if (d.data.id === hoveredSlice) {
          d3.select(this)
            .attr('stroke', 'transparent')
            .attr('class', 'chart__piechart +isHovered')
            .transition()
            .duration(1000)
            .style('filter', 'url(#sliceShadow)')
            .attr('d', d3.arc().innerRadius(0).outerRadius((radius * 2) + 5));
        } else {
          d3.select(this).transition().duration(800)
            .attr('d', arc)
            .style('filter', '')
            .attr('class', 'chart__piechart');
        }
      });

    // exit
    piechartData.exit().remove();
  }

  render() {
    return (
      <div className="pieContainer">
        <svg ref={node => this.svgNode = node} className="chart">
          <filter id="sliceShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <g className="chart__piechart" />
        </svg>
      </div>
    );
  }
}

D3Piechart.displayName = 'D3Piechart';
D3Piechart.propTypes = {
  'data': PropTypes.array,
  'hoveredSlice': PropTypes.string,
};
D3Piechart.defaultProps = {
  'data': [],
  'hoveredSlice': '',
};

export default D3Piechart;
