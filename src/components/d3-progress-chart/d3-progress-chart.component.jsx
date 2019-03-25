import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { smartNumber } from 'lib';

import chordIcons from 'public/icons/chord';
import './d3-progress-chart.style.scss';

const config = {
  'height': 100,
  'width': 100,
  'chordRadius': 50,
  'chordStroke': 3,
  'duration': 750,
  'iconWidth': 25,
  'iconHeight': 16,
  'arcColor': '#727272',
};

const calculateArcData = (percent) => {
  const aux = percent * 2 * Math.PI;
  const offset = Math.PI - (aux / 2);

  return [
    {
      startAngle: offset,
      endAngle: aux + offset,
    }, {
      startAngle: aux + offset,
      endAngle: (2 * Math.PI) + offset,
    }];
};

class D3ProgressBar extends Component {
  constructor(...args) {
    super(...args);

    this.svgNode = null;
    this.wrapper = null;
    this.renderD3 = this.renderD3.bind(this);
    this.appendPieContent = this.appendPieContent.bind(this);
  }

  componentDidMount() {
    this.renderD3();
  }

  componentDidUpdate() {
    this.renderD3();
  }

  getSvgNode() {
    const { className, svgDimensions } = this.props;

    const node = this.svgNode;
    return d3.select(node)
      .select(`.${className}__group`)
      .attr('transform', `translate(${svgDimensions.width / 2}, ${svgDimensions.height / 2})`);
  }

  appendTooltip() {
    const { iconMessage, svgDimensions } = this.props;
    const tooltip = d3.select(this.wrapper)
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
      .html(() => iconMessage);

    tooltip.style('top', `${(svgDimensions.height / 2) + 12}px`);
  }

  appendPieContent(svg) {
    const { className, amount, hasIcon, displayText, svgDimensions, iconMessage } = this.props;

    let textYPosition = -15;
    if (hasIcon) {
      textYPosition = -23;
    }

    svg.select(`.${className}__text`)
      .attr('width', svgDimensions.width - 10)
      .attr('height', 30)
      .attr('transform', `translate(${-(svgDimensions.width - 10) / 2}, ${textYPosition})`)
      .html('')
      .append('xhtml:div')
      .html(displayText || smartNumber(amount));

    if (hasIcon) {
      svg.select(`.${className}__img`)
        .attr('width', config.iconWidth)
        .attr('height', config.iconHeight)
        .attr('xlink:href', chordIcons.exclamationMark)
        .attr('transform', `translate(${(-config.iconWidth / 2) - 2}, 10)`);

      if (iconMessage) {
        svg.select(`.${className}__img`)
          .on('mouseover', () => this.appendTooltip())
          .on('mouseout', () => {
            d3.selectAll('.popper-wrap').remove();
          });
      }
    }
  }

  renderD3() {
    const { amount, maxim } = this.props;
    const svg = this.getSvgNode();

    this.appendPieContent(svg);

    const arc = d3.arc()
      .innerRadius(config.chordRadius - config.chordStroke)
      .outerRadius(config.chordRadius);

    const percent = ((amount * 100) / maxim) / 100;

    const paths = svg.selectAll('path')
      .data(calculateArcData(percent));

    paths.enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => (i % 2 === 0 ? this.props.amountColor : config.arcColor));

    paths.attr('d', arc)
      .attr('fill', (d, i) => (i % 2 === 0 ? this.props.amountColor : config.arcColor));

    paths.exit().remove();
  }

  render() {
    const { className, svgDimensions } = this.props;

    return (
      <div
        className={className}
        ref={ref => this.wrapper = ref}
      >
        <svg
          ref={node => this.svgNode = node}
          width={svgDimensions.width}
          height={svgDimensions.height}
        >
          <g className={`${className}__group`}>
            <foreignObject className={`${className}__text`} />
            <image className={`${className}__img`} />
          </g>
        </svg>
      </div>
    );
  }
}

D3ProgressBar.propTypes = {
  amount: PropTypes.number.isRequired,
  maxim: PropTypes.number.isRequired,
  className: PropTypes.string,
  hasIcon: PropTypes.bool,
  amountColor: PropTypes.string,
  displayText: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.element,
  ]),
  svgDimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  iconMessage: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]),
};

D3ProgressBar.defaultProps = {
  className: 'd3-progress-chart',
  hasIcon: false,
  amountColor: '#ff5d3a',
  displayText: '',
  svgDimensions: {
    width: 100,
    height: 100,
  },
  iconMessage: '',
};

export default D3ProgressBar;
