import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import './d3-legend.style.scss';

class D3Legend extends PureComponent {
  constructor(...args) {
    super(...args);

    this.svgNode = null;
    this.renderD3 = this.renderD3.bind(this);
  }

  componentDidMount() {
    const { data } = this.props;
    if (data.length > 0) {
      this.renderD3(data);
    }
  }

  componentDidUpdate() {
    const { data } = this.props;
    if (data.length > 0) {
      this.renderD3(data);
    }
  }

  renderD3(data) {
    const node = this.svgNode;
    const svg = d3.select(node);

    const legend = svg.select('.legend')
      .attr('transform', 'translate(10, 0)');
    const legendCirclesData = legend
      .selectAll('circle')
      .data(data);

    legendCirclesData.enter()
      .append('circle')
      .attr('fill', d => d.color)
      .attr('r', '6')
      .attr('cy', (d, i) => (20 * (i + 1)) - 5)
      .on('mouseenter', d => this.props.onInspectItem(d.id))
      .on('mouseleave', () => this.props.onLeaveItem());

    legendCirclesData
      .attr('fill', d => d.color)
      .attr('r', '6')
      .attr('cy', (d, i) => (20 * (i + 1)) - 5)
      .on('mouseenter', d => this.props.onInspectItem(d.id))
      .on('mouseleave', () => this.props.onLeaveItem());

    legendCirclesData.exit().remove();

    // append percentages
    const percentages = svg.select('.legend__percentages')
      .attr('transform', 'translate(20, 0)');
    const percentagesData = percentages
      .selectAll('text')
      .data(data);

    percentagesData.enter()
      .append('text')
      .text(d => `${+d.percent.toFixed(2)}%`)
      .attr('y', (d, i) => 20 * (i + 1))
      .attr('x', 10)
      .on('mouseenter', d => this.props.onInspectItem(d.id))
      .on('mouseleave', () => this.props.onLeaveItem());

    percentagesData
      .text(d => `${+d.percent.toFixed(2)}%`)
      .attr('y', (d, i) => 20 * (i + 1))
      .attr('x', 10)
      .on('mouseenter', d => this.props.onInspectItem(d.id))
      .on('mouseleave', () => this.props.onLeaveItem());
    percentagesData.exit().remove();

    // append labels
    const labels = svg.select('.legend__labels')
      .attr('transform', 'translate(60, 0)');
    const labelsData = labels
      .selectAll('text')
      .data(data);

    labelsData
      .enter()
      .append('text')
      .text(d => d.label)
      .attr('y', (d, i) => 20 * (i + 1))
      .attr('x', 10)
      .on('mouseenter', d => this.props.onInspectItem(d.id))
      .on('mouseleave', () => this.props.onLeaveItem());

    labelsData
      .text(d => d.label)
      .attr('y', (d, i) => 20 * (i + 1))
      .attr('x', 10)
      .on('mouseenter', d => this.props.onInspectItem(d.id))
      .on('mouseleave', () => this.props.onLeaveItem());
    labelsData.exit().remove();
  }

  render() {
    return (
      <div className="legendContainer">
        <svg ref={node => this.svgNode = node} className="legendContainer__svg">
          <g className="legend">
            <g className="legend__percentages" />
            <g className="legend__labels" />
          </g>
        </svg>
      </div>
    );
  }
}

D3Legend.displayName = 'D3Legend';
D3Legend.propTypes = {
  'data': PropTypes.array,
  'onInspectItem': PropTypes.func,
  'onLeaveItem': PropTypes.func,
};
D3Legend.defaultProps = {
  'data': [],
  'onInspectItem': () => null,
  'onLeaveItem': () => null,
};

export default D3Legend;
