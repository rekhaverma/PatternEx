import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { isEqual, isEmpty } from 'lodash';

import chordIcons from 'public/icons/chord';
import { behaviours } from 'config';

const d3Items = {
  'links': {
    'width': 1,
    'color': '#cccccc',
    'predicted': '#f81c1c',
  },
  'icons': {
    'width': 25,
    'height': 21,
    'backgroundRadius': 15,
    'defaultColor': '#979797',
    'selectedColor': '#ff5d3a',
  },
};

/**
* Return corresponding icon to it's behavior
* @param {String} iconName
* @param {String} behavior
*/
const getIconColor = (iconName, behavior) => {
  if (behavior !== null && behavior !== undefined) {
    if (behavior.toLowerCase() === behaviours.MALICIOUS) {
      return chordIcons[`${iconName}R`];
    }
    if (behavior.toLowerCase() === behaviours.SUSPICIOUS) {
      return chordIcons[`${iconName}Y`];
    }
    // 'Unknown'
    return chordIcons[`${iconName}`];
  }
  return chordIcons[`${iconName}`];
};

/**
 * Append content on tooltip
 * @param {Number} value
 * @param {String} label
*/
const tooltipInfo = (value) => {
  const tooltipData = d3.select('.popper__point_info')
    .append('div');
  tooltipData.append('span')
    .attr('class', 'highlighted')
    .html(value);
};

/**
 * Add div to diagram container, positionated by x, y coordinates
 * @param {Number} x
 * @param {Number} y
 * @param {Object} data
*/
const d3Tooltip = (x, y, data) => {
  const tooltip = d3.select('.spiderGraph__component')
    .append('div')
    .attr('data-placement', 'bottom')
    .attr('class', 'popper-wrap')
    .style('position', 'absolute')
    .style('left', `${x}px`)
    .style('top', `${y}px`)
    .style('opacity', 0.8);
  tooltip.append('div')
    .attr('class', 'popper');
  d3.select('.popper')
    .append('div')
    .attr('class', 'popper__point_info');

  tooltipInfo(data.id);
};

export class D3SpiderGraph extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      'config': {},
      'translate': {
        'x': 10,
        'y': 10,
        'scale': '',
      },
    };

    this.svgNode = null;
    this.hoverTimeout = null;
    this.getSvgNode = this.getSvgNode.bind(this);
    this.setConfigProps = this.setConfigProps.bind(this);
    this.renderD3 = this.renderD3.bind(this);
  }

  componentWillMount() {
    const { config } = this.props;
    this.setConfigProps(config);
  }

  componentDidMount() {
    const { config, data } = this.props;
    this.renderD3(config, data);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.config, nextProps.config)) {
      this.setConfigProps(nextProps.config);
    }
    if (!isEqual(this.props.data, nextProps.data)) {
      this.renderD3(nextProps.config, nextProps.data);
    }
  }

  componentDidUpdate() {
    const { data, config } = this.props;

    if (!isEmpty(data)) {
      this.renderD3(config, data);
    }
  }

  setConfigProps(config) {
    this.setState({ config }, () => { this.renderD3(this.state.config, this.props.data); });
  }

  /**
* Attach 'g' tag to svg reference
* @return {Object}
*/
  getSvgNode() {
    const node = this.svgNode;
    const { config, translate } = this.state;

    const svg = d3.select(node)
      .attr('class', 'spiderGraph__svg');

    const g = svg.select('.diagram__group')
      .attr('transform', () => {
        const translateValue = translate.scale === ''
          ? `translate(${translate.x}, ${translate.y})`
          : `translate(${translate.x}, ${translate.y}) scale(${translate.scale})`;
        return translateValue;
      });

    const zoomActions = () => {
      g.attr('transform', d3.event.transform);
    };

    const zoomHandler = d3.zoom()
      // min and max allowed scale factor
      .scaleExtent([0.4, 2.75])
      // dragging limits
      .translateExtent([[-500, 0],
        [this.props.clientWidth + 200, config.svgHeight]])
      .on('zoom', zoomActions);

    zoomHandler(svg);

    return g;
  }

  renderD3(config, data) {
    const svg = this.getSvgNode();

    const center = {
      'x': this.props.clientWidth / 2,
      'y': config.svgHeight / 2,
    };

    // add links on svg
    const linksGroup = svg.select('.links');
    const linksGroupData = linksGroup.selectAll('line')
      .data(data.links);

    linksGroupData
      .enter()
      .append('line')
      .attr('stroke-width', d3Items.links.width)
      .attr('stroke', (d) => {
        if (d.isPredicted) {
          return d3Items.links.predicted;
        }
        return d3Items.links.color;
      });

    linksGroupData
      .attr('stroke-width', d3Items.links.width)
      .attr('stroke', (d) => {
        if (d.isPredicted) {
          return d3Items.links.predicted;
        }
        return d3Items.links.color;
      });

    linksGroupData.exit().remove();


    // add background circles for icons
    const bgCirclesGroup = svg.select('.nodes');
    const bgCirclesGroupData = bgCirclesGroup.selectAll('circle')
      .data(data.nodes);

    const { selectedEntity } = this.props;
    bgCirclesGroupData
      .enter()
      .append('circle')
      .attr('fill', (d) => {
        if (d.is_central_entity) {
          return '#ffffff';
        }
        return '#1b1b1b';
      })
      .attr('r', Object.keys(config).includes('iconsWidth')
        ? (config.iconsWidth / 2) + 4
        : (d3Items.icons.width / 2) + 4)
      .attr('stroke', d3Items.icons.selectedColor)
      .attr('stroke-width', (d) => {
        if (selectedEntity) {
          if (d.id.toString() === selectedEntity.toString()) {
            return 2;
          }
        }
        return 0;
      });

    bgCirclesGroupData
      .attr('fill', (d) => {
        if (d.is_central_entity) {
          return '#ffffff';
        }
        return '#1b1b1b';
      })
      .attr('stroke', d3Items.icons.selectedColor)
      .attr('stroke-width', (d) => {
        if (selectedEntity) {
          if (d.id.toString() === selectedEntity.toString()) {
            return 2;
          }
        }
        return 0;
      });

    bgCirclesGroupData.exit().remove();

    // add icons on svg
    const icon = ['srcip', 'dstip', 'domain', 'user', 'request'];
    const iconsGroup = svg.select('.icons');
    const iconsGroupData = iconsGroup.selectAll('image')
      .data(data.nodes);

    const iconsWidth = Object.keys(config).includes('iconsWidth')
      ? config.iconsWidth : d3Items.icons.width;
    const iconsHeight = Object.keys(config).includes('iconsHeight')
      ? config.iconsHeight : d3Items.icons.height;


    iconsGroupData.enter()
      .append('svg:image')
      .attr('cursor', 'pointer')
      .attr('xlink:href', d => getIconColor(icon[d.group], d.behavior))
      .attr('width', iconsWidth)
      .attr('height', iconsHeight);


    iconsGroupData
      .attr('xlink:href', d => getIconColor(icon[d.group], d.behavior))
      .attr('width', iconsWidth)
      .attr('height', iconsHeight);

    iconsGroupData.exit().remove();

    iconsGroupData
      .on('mouseover', (d) => {
        this.hoverTimeout = setTimeout(() => {
          d3.selectAll('.popper-wrap').remove();
          d3Tooltip(d.x, d.y, d);
        }, 500);
      });
    iconsGroupData
      .on('mouseout', () => {
        d3.selectAll('.popper-wrap').remove();
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
      });
    iconsGroupData
      .on('click', (d) => {
        this.props.setSelectedEntity(d);
      });

    //  arrange links, background circles and icons on right position
    const ticked = () => {
      bgCirclesGroupData.attr('transform', d => `translate(${d.x}, ${d.y})`);
      iconsGroupData.attr('transform', d =>
        `translate(${+d.x - (iconsWidth / 2)},
        ${+d.y - (iconsHeight / 2)})`);

      linksGroupData
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    };

    // D3 method of creating graph
    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink()
        .id(d => d.id)
        .distance(60).iterations(3))
      .force('x', d3.forceX(center.x))
      .force('y', d3.forceY(center.y))
      .force('charge', d3.forceManyBody().strength(-540))
      .force('center', d3.forceCenter(center.x, center.y));

    simulation
      .nodes(data.nodes);
    simulation.force('link')
      .links(data.links);
    simulation
      .on('tick', ticked);
  }

  render() {
    const { config } = this.state;

    return (
      <svg
        ref={node => this.svgNode = node}
        width={this.props.clientWidth}
        height={this.props.clientHeight > config.svgHeight
          ? this.props.clientHeight : config.svgHeight}
      >
        <g className="diagram__group">
          <g className="links" />
          <g className="nodes" />
          <g className="icons" />
        </g>
      </svg>
    );
  }
}

D3SpiderGraph.displayName = 'D3SpiderGraph';
D3SpiderGraph.propTypes = {
  'clientWidth': PropTypes.number,
  'clientHeight': PropTypes.number,
  'config': PropTypes.object,
  'data': PropTypes.object,
  'selectedEntity': PropTypes.string,
  'setSelectedEntity': PropTypes.func,
};
D3SpiderGraph.defaultProps = {
  'clientWidth': 0,
  'clientHeight': 0,
  'config': {},
  'data': {},
  'selectedEntity': '',
  'setSelectedEntity': () => null,
};

export default D3SpiderGraph;
