import React from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';
import * as topojson from 'topojson';

import { isEqual, isEmpty } from 'lodash';

import mapData from './map-data.json';

import './world-map.style.scss';

const lngLatToArc = (d, svgWidth, svgHeight) => {
  const projection = d3.geoMercator()
    .translate([svgWidth / 2, svgHeight / 1.75])
    .scale(svgWidth / 2 / Math.PI);
  const sourceLngLat = d.source;
  const targetLngLat = d.target;

  if (targetLngLat && sourceLngLat) {
    const sourceXY = projection(sourceLngLat);
    const targetXY = projection(targetLngLat);

    const sourceX = sourceXY[0];
    const sourceY = sourceXY[1];

    const targetX = targetXY[0];
    const targetY = targetXY[1];

    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const dr = Math.sqrt((dx * dx) + (dy * dy)) * 2;

    const westOfSource = (targetX - sourceX) < 0;
    if (westOfSource) {
      return `M${targetX},${targetY}A${dr},${dr} 0 0,1 ${sourceX},${sourceY}`;
    }
    return `M${sourceX},${sourceY}A${dr},${dr} 0 0,1 ${targetX},${targetY}`;
  }
  return 'M0,0,l0,0z';
};

const appendTooltip = (xPos, yPos, container) => {
  const tooltip = d3.select(container)
    .append('div')
    .attr('data-placement', 'bottom')
    .attr('class', 'worldMap__tooltip popper-wrap')
    .style('position', 'fixed');
  tooltip.append('span')
    .attr('class', 'popper__arrow');
  tooltip.append('div')
    .attr('class', 'worldMap__popper popper');

  tooltip.style('left', `${xPos}px`)
    .style('top', `${yPos}px`);
};

const appendTooltipData = (data) => {
  const tooltipBox = d3.select('.popper');

  tooltipBox.append('div')
    .attr('class', 'popper__info')
    .html(() => data);
};

const removeTooltip = () => {
  d3.selectAll('.worldMap__tooltip').remove();
};

export class WorldMap extends React.Component {
  constructor(...args) {
    super(...args);

    this.svg = null;
    this.container = null;
    this.injectD3 = this.injectD3.bind(this);
  }

  componentDidMount() {
    if (!isEmpty(mapData)) {
      this.injectD3(mapData);
    }
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props.data, nextProps.data)
      || this.props.clientWidth !== nextProps.clientWidth;
  }

  componentDidUpdate() {
    if (!isEmpty(mapData)) {
      this.injectD3(mapData);
    }
  }

  injectD3(world) {
    const { data, clientWidth, config, parentName } = this.props;

    const nodes = data.sources;
    const relations = data.connections;

    const projection = d3.geoMercator()
      .translate([clientWidth / 2, config.svgHeight / 1.75])
      .scale(clientWidth / 2 / Math.PI);

    const path = d3.geoPath()
      .projection(projection);

    const svg = d3.select(`.main__${parentName}`);
    const contours = svg.select('.contours');
    const points = svg.select('.points');
    const connections = svg.select('.connections');

    // zoom in and out
    const move = () => {
      const transform = d3.event.transform;
      const scale = transform.k;
      transform.x = Math.min(0, Math.max(clientWidth * (1 - scale), transform.x));
      transform.y = Math.min(
        110 * scale,
        Math.max((config.svgHeight * (1 - scale)) - (10 * scale), transform.y),
      );

      contours
        .style('stroke-width', 1 / scale)
        .attr('transform', transform);
      points
        .attr('transform', transform);
      connections
        .attr('transform', transform);
    };
    const zoom = d3.zoom()
      .scaleExtent([1, 30])
      .on('zoom', move);

    svg.call(zoom);

    svg.selectAll('.land').remove();
    contours.append('path')
      .datum(topojson.feature(world, world.objects.countries))
      .attr('class', 'land')
      .attr('d', path);
    contours.exit().remove();

    // add points for all nodes
    const pointsGroupData = points.selectAll('circle')
      .data(nodes);

    const tooltip = d3.select(this.container)
      .append('div')
      .attr('class', 'worldMap__tooltip popper-wrap')
      .style('opacity', 0);

    pointsGroupData.enter()
      .append('circle')
      .attr('transform', d => `translate(${projection([d.longitude, d.latitude])})`)
      .attr('r', (d) => {
        if (d.is_source) {
          return '5px';
        }
        return '3px';
      })
      .on('mouseover', (d) => {
        const svgBound = this.container.getBoundingClientRect();
        const pageX = (event.x - svgBound.x) + this.props.parent.x;
        const pageY = (event.y - svgBound.y) + this.props.parent.y;

        tooltip.transition().duration(200).style('opacity', 0.9).attr('width', '100%');

        appendTooltip(pageX, pageY, this.container);
        appendTooltipData(d.srcip);
      })
      .on('mouseout', () => {
        removeTooltip();
        tooltip.transition().duration(500).style('opacity', 0);
      });

    pointsGroupData
      .attr('transform', d => `translate(${projection([d.longitude, d.latitude])})`);

    pointsGroupData.exit().remove();

    // add paths for connections
    const connectionsGroupData = connections.selectAll('path')
      .data(relations);

    connectionsGroupData.enter()
      .append('path')
      .attr('d', d => lngLatToArc(d, clientWidth, config.svgHeight))
      .attr('class', 'connection');
    connectionsGroupData
      .attr('d', d => lngLatToArc(d, clientWidth, config.svgHeight));
    connectionsGroupData.exit().remove();
  }

  render() {
    const { config, clientWidth, clientHeight, parentName } = this.props;
    const svgHeight = parentName === 'modal' ? clientHeight : config.svgHeight;


    return (
      <div className="worldMap" ref={node => this.container = node}>
        <svg
          ref={node => this.svg = node}
          width={clientWidth}
          height={svgHeight}
        >
          <g className={`main__${parentName}`}>
            <g className="contours" />
            <g className="points" />
            <g className="connections" />
          </g>
        </svg>
        { this.props.showIconFullSize &&
          <span className="worldMap__icon icon-full-size" />
        }
      </div>
    );
  }
}

WorldMap.displayName = 'WorldMap';
WorldMap.propTypes = {
  'parentName': PropTypes.string,
  'data': PropTypes.object,
  'clientWidth': PropTypes.number,
  'clientHeight': PropTypes.number,
  'config': PropTypes.object,
  'showIconFullSize': PropTypes.bool,
  'parent': PropTypes.object,
};

WorldMap.defaultProps = {
  'parentName': '',
  'data': {},
  'className': 'worldMap',
  'clientWidth': 0,
  'clientHeight': 0,
  'config': {},
  'showIconFullSize': false,
  'parent': {
    'x': 0,
    'y': 0,
  },
};

export default WorldMap;
