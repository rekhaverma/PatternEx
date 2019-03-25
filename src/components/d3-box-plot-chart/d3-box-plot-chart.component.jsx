import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { FormattedMessage } from 'react-intl';

import './d3-box-plot-chart.style.scss';

const isUndefind = value => (value === undefined
  || value === 'undefined'
  || value === null);

class BoxPlot extends PureComponent {
  constructor() {
    super();
    this.svgNode = null;
    this.tooltip = null;
    this.drawBoXPlot = this.drawBoxPlot.bind(this);
  }
  componentDidMount() {
    this.drawBoxPlot();
  }
  drawBoxPlot() {
    const { histogram, value, feature } = this.props;
    const node = this.svgNode;
    const tooltipNode = this.tooltip;

    const minValue = parseFloat(histogram.min);
    const maxValue = parseFloat(histogram.max);
    const twentyFifthVal = parseFloat(histogram['25th_perc']);
    const seventyFifthVal = parseFloat(histogram['75th_perc']);
    const avgValue = parseFloat(histogram.mean);
    const featureValue = parseFloat(value);

    const isHistogramEmpty = Object.keys(histogram).length === 0;

    const svg = d3.select(node);
    const tooltip = d3.select(tooltipNode);

    let featurePointerLocation = 87.5;
    let featureMeanPointerLocation = 87.5;
    const totalWidth = parseInt(node.getBoundingClientRect().width, 10) - 75;
    const offset = 25;

    if (isUndefind(value) || isHistogramEmpty) {
      svg.append('text')
        .text(isHistogramEmpty ? 'Histogram is not available' : 'Feature value is not available')
        .attr('size', 20)
        .attr('fill', '#A1A8A9')
        .attr('x', offset)
        .attr('y', 30);
      return;
    }

    const scalingFactor = maxValue === minValue ? 1 : totalWidth / (maxValue - minValue);


    let part1Width;
    let part2Width;

    if (!isUndefind(twentyFifthVal) && !isUndefind(seventyFifthVal) && minValue !== maxValue) {
      part1Width = scalingFactor * (twentyFifthVal - minValue);
      /* (scalingFactor * (twentyFifthVal - minValue) > 2 ?
        scalingFactor * (twentyFifthVal - minValue) : 2); */
      part2Width = scalingFactor * (seventyFifthVal - twentyFifthVal);
      /* (scalingFactor * (seventyFifthVal - twentyFifthVal) < 5 ?
        (part1Width + 5) : (scalingFactor * (seventyFifthVal - minValue))); */
    } else {
      part1Width = 5;
      part2Width = totalWidth - 5;
    }

    svg.append('line')
      .attr('class', feature)
      .attr('x1', offset)
      .attr('x2', offset + part1Width)
      .attr('y1', 30)
      .attr('y2', 30)
      .attr('stroke-width', 10)
      .attr('stroke', '#3b3b3b');

    svg.append('text')
      .text(minValue)
      .attr('size', 20)
      .attr('fill', '#A1A8A9')
      .attr('x', offset - 10)
      .attr('y', 20);

    svg.append('line')
      .attr('class', feature)
      .attr('x1', offset + part1Width)
      .attr('x2', offset + totalWidth)
      .attr('y1', 30)
      .attr('y2', 30)
      .attr('stroke-width', 10)
      .attr('stroke', '#3b3b3b');

    svg.append('text')
      .text(parseFloat(maxValue).toFixed(2))
      .attr('size', 20)
      .attr('fill', '#A1A8A9')
      .attr('x', (offset + totalWidth) - 10)
      .attr('y', 20);

    svg.append('rect')
      .attr('class', feature)
      .attr('x', offset + part1Width)
      .attr('width', offset + part2Width)
      .attr('y', 25)
      .attr('height', 15)
      .attr('fill', '#FFAE9D')
      .attr('stroke', '#ff5d3a')
      .attr('stroke-width', '2px')
      .attr('stroke-dasharray', '4');

    if (!isUndefind(featureValue)) {
      featurePointerLocation = scalingFactor * (featureValue - minValue);
      featureMeanPointerLocation = scalingFactor * (avgValue - minValue);

      svg.append('text')
        .attr('class', 'actual')
        .attr('font-family', 'patternex')
        .attr('fill', 'white')
        .attr('x', offset + featurePointerLocation)
        .attr('y', '50')
        .text('\uE93B');

      svg.append('text')
        .attr('class', 'mean')
        .attr('font-family', 'patternex')
        .attr('fill', 'yellow')
        .attr('x', offset + featureMeanPointerLocation)
        .attr('y', '50')
        .text('\uE93A');
    }

    svg.selectAll(`.${feature}`)
      .on('mousemove', () => {
        tooltip.style('display', 'block');
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });
  }
  render() {
    const { title, histogram, value, onListedFeatureSelect } = this.props;
    const mean = parseFloat(histogram.mean).toFixed(2);
    const std = parseFloat(histogram.std).toFixed(2);
    const featureValue = parseFloat(value).toFixed(2);
    const deviation = std !== '0.00' ? parseFloat(((featureValue - mean) / std)).toFixed(2) : 'NA';
    const isHistogramEmpty = Object.keys(histogram).length === 0;
    const graphProperties = !isHistogramEmpty && !isUndefind(value) ? {
      'displayName': title,
      'min': parseFloat(histogram.min).toFixed(2),
      'max': parseFloat(histogram.max).toFixed(2),
      'twentyfive': parseFloat(histogram['25th_perc']).toFixed(2),
      'seventyfive': parseFloat(histogram['75th_perc']).toFixed(2),
      deviation,
      featureValue,
    } : null;
    return (
      <div className="d3-box-plot">
        <div
          className="d3-box-plot__tooltip"
          ref={node => this.tooltip = node}
        >
          <div className="percentile">
            <div className="icon-section" />
            <span className="label-section">
              <FormattedMessage id="evp.percentiles" />
            </span>
            <span className="value-section">
              {parseFloat(histogram['25th_perc']).toFixed(2)} to {parseFloat(histogram['75th_perc']).toFixed(2)}
            </span>
          </div>
          <div className="actual">
            <span className="icon-actual" />
            <span className="label-section">
              <FormattedMessage id="evp.actual" />
            </span>
            <span className="value-section">
              { parseFloat(value).toFixed(2)}
            </span>
          </div>
          <div className="mean">
            <span className="icon-mean" />
            <span className="label-section">
              <FormattedMessage id="evp.mean" />
            </span>
            <span className="value-section">
              {parseFloat(histogram.mean).toFixed(2)}
            </span>
          </div>
          <div className="standard">
            <span className="icon-section" />
            <span className="label-section">
              <FormattedMessage id="evp.deviation" />
            </span>
            <span className="value-section">
              {parseFloat(histogram.std).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="d3-box-plot__chart" onClick={() => onListedFeatureSelect(graphProperties)}>
          <span className="feature" title={title} > { title } </span>
          <svg
            ref={node => this.svgNode = node}
          />
          {
            value === null || isHistogramEmpty ? '' : (
              <div className="stats">
                <div
                  className="diff"
                  title="Difference between Actual and Mean (in SD)"
                >
                  <span className={`value ${parseFloat(Math.abs(deviation), 10) > 1 ? 'alert' : ''}`}>
                    { deviation }
                  </span>
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

BoxPlot.propTypes = {
  'title': PropTypes.string,
  'histogram': PropTypes.object,
  'value': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  'onListedFeatureSelect': PropTypes.func.isRequired,
  'feature': PropTypes.string,
};

BoxPlot.defaultProps = {
  'title': '',
  'histogram': {},
  'value': '',
  'feature': '',
};

export default BoxPlot;
