import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import moment from 'moment';
import { isEqual } from 'lodash';

import './timelinechart.style.scss';

const textAnchor = (d) => {
  if (d.id === 'starting_el') {
    return 'start';
  } else if (d.id === 'ending_el') {
    return 'end';
  }
  return 'middle';
};

class TimelineChart extends React.PureComponent {
  static checkStartingElement(data) {
    for (let i = 0; i < data.length - 1; i += 1) {
      if (data[i].id === 'starting_el') {
        return false;
      }
    }
    return true;
  }

  static createGradient(svg) {
    const defs = svg.select('.gradient');
    const defsGroup = defs.selectAll('linearGradient').data([1]);

    const gradient = defsGroup.enter().append('linearGradient')
      .attr('id', 'svgGradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ff5d3a')
      .attr('stop-opacity', 1);

    gradient.append('stop')
      .attr('offset', '40%')
      .attr('stop-color', '#ff5d3a')
      .attr('stop-opacity', 0.3);

    gradient.append('stop')
      .attr('offset', '60%')
      .attr('stop-color', '#ff5d3a')
      .attr('stop-opacity', 0.3);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ff5d3a')
      .attr('stop-opacity', 1);

    defsGroup.exit().remove();
  }

  constructor(...args) {
    super(...args);

    this.svgNode = null;
    this.svgConfig = {
      padding: 35,
      radius: 6,
      startPosition: 8,
      widthPadding: 30,
      labelsStartPos: 10,
      labelsPadding: 21,
      timestampsPadding: 28,
    };
    this.state = {
      'dataSorted': [],
      'selectedEntity': null,
      'width': 0,
      'height': 0,
    };
    this.renderD3 = this.renderD3.bind(this);
    this.dataPrepare = this.dataPrepare.bind(this);
    this.drawRectangle = this.drawRectangle.bind(this);
    this.drawLabels = this.drawLabels.bind(this);
    this.drawTimestamps = this.drawTimestamps.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentDidMount() {
    this.updateDimensions();
  }

  componentDidUpdate() {
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    const node = this.svgNode;
    const svg = d3.select(node);
    const width = parseInt(svg.style('width'), 10);
    const height = parseInt(svg.style('height'), 10);

    this.setState({
      width: width - (this.svgConfig.widthPadding * 2),
      height: height - this.svgConfig.padding,
    }, () => {
      this.renderD3();
    });
  }

  handleMouseOut(d) {
    if (d.id !== this.state.selectedEntity) {
      const time = `id-${moment(d.create_time).format('x')}`;

      d3.select(`.${time}`).style('display', 'none');
      d3.select('.timestamps').select(`.${time}`).style('display', 'none');
    }
  }

  handleMouseOver(d) {
    if (d.id !== this.state.selectedEntity) {
      const time = `id-${moment(d.create_time).format('x')}`;

      d3.select(`.${time}`).style('display', 'inline-block');
      d3.select('.timestamps').select(`.${time}`).style('display', 'inline-block');
    }
  }


  drawRectangle(svg) {
    const rectangle = svg.select('.rectangle');
    const rectangleGroup = rectangle.selectAll('rect').data([1]);

    rectangleGroup
      .enter()
      .append('rect')
      .attr('width', this.state.width)
      .attr('height', 1)
      .attr('y', this.state.height)
      .attr('x', this.svgConfig.widthPadding)
      .style('fill', 'url("#svgGradient")');

    rectangleGroup
      .attr('width', this.state.width)
      .attr('y', this.state.height)
      .attr('x', this.svgConfig.widthPadding)
      .style('fill', 'url("#svgGradient")');

    rectangle.exit().remove();
  }

  drawLabels(svg, scale) {
    const { dataSorted, selectedEntity } = this.state;

    const calculateStartPosition = (d) => {
      if (d.id === 'starting_el') {
        return scale(moment(d.create_time)) - this.svgConfig.labelsStartPos;
      } else if (d.id === 'ending_el') {
        return scale(moment(d.create_time)) + this.svgConfig.labelsStartPos;
      }
      return scale(moment(d.create_time));
    };

    const labelsGroup = svg.select('.labels');
    labelsGroup.selectAll('g').remove();
    const labels = labelsGroup.selectAll('text').data(dataSorted);

    labels
      .enter()
      .append('g')
      .attr('class', 'textLabelsGroup')
      .each(function (d) {
        const text = d3.select(this)
          .selectAll('text')
          .data(d.name)
          .enter()
          .append('text')
          .attr('class', () => `id-${moment(d.create_time).format('x')} textLabels`)
          .attr('y', (d1, i) => 10 + (i * 14))
          .attr('x', calculateStartPosition(d))
          .attr('text-anchor', textAnchor(d))
          .style('display', () => { if (d.id === selectedEntity) { return 'inline-block'; } return 'none'; })
          .text(d1 => d1);
        text
          .text(d1 => d1)
          .attr('class', () => `id-${moment(d.create_time).format('x')} textLabels`)
          .attr('y', (d1, i) => 10 + (i * 14))
          .attr('x', calculateStartPosition(d))
          .attr('text-anchor', textAnchor(d))
          .style('display', () => { if (d.id === selectedEntity) { return 'inline-block'; } return 'none'; });
        text.exit().remove();
      });

    labels.exit().remove();
  }

  drawTimestamps(svg, scale) {
    const { dataSorted } = this.state;

    const timestampsGroup = svg.select('.timestamps');
    const timestamps = timestampsGroup.selectAll('text').data(dataSorted);

    const calculateStartPosition = (d) => {
      if (d.id === 'starting_el') {
        return scale(moment(d.create_time)) - this.svgConfig.labelsStartPos;
      } else if (d.id === 'ending_el') {
        return scale(moment(d.create_time)) + this.svgConfig.labelsStartPos;
      }
      return scale(moment(d.create_time));
    };

    timestamps
      .enter()
      .append('text')
      .attr('y', this.state.height + this.svgConfig.timestampsPadding)
      .attr('x', calculateStartPosition)
      .attr('text-anchor', textAnchor)
      .text(d => moment(d.create_time).format('MM-DD-YYYY'))
      .attr('class', d => `id-${moment(d.create_time).format('x')} textLabels`)
      .style('display', (d) => { if (d.id === this.state.selectedEntity) { return 'inline-block'; } return 'none'; });


    timestamps
      .attr('y', this.state.height + this.svgConfig.timestampsPadding)
      .attr('x', calculateStartPosition)
      .attr('text-anchor', textAnchor)
      .text(d => moment(d.create_time).format('MM-DD-YYYY'))
      .attr('class', d => `id-${moment(d.create_time).format('x')} textLabels`)
      .style('display', (d) => { if (d.id === this.state.selectedEntity) { return 'inline-block'; } return 'none'; });


    timestamps.exit().remove();
  }

  drawPoints(svg, scale) {
    const { dataSorted } = this.state;

    const circles = svg.select('.circles');
    const circlesGroupData = circles.selectAll('circle').data(dataSorted);

    const calculateRadius = (d) => {
      if (d.id === 'starting_el' || d.id === 'ending_el') {
        return (this.svgConfig.radius / 1.5);
      }
      return this.svgConfig.radius;
    };

    const calculateStrokeWidth = (d) => {
      if (this.state.selectedEntity === d.id) {
        return 2;
      }
      return 0;
    };

    circlesGroupData
      .enter()
      .append('circle')
      .attr('r', d => calculateRadius(d))
      .attr('cy', this.state.height)
      .attr('cx', d => scale(moment(d.create_time)))
      .attr('fill', d => (d.color))
      .attr('stroke', 'white')
      .attr('stroke-width', d => calculateStrokeWidth(d))
      .on('mouseover', d => this.handleMouseOver(d))
      .on('mouseout', d => this.handleMouseOut(d))
      .on('click', (d) => {
        if (d.id !== 'starting_el' && d.id !== 'ending_el') {
          this.setState({ 'selectedEntity': d.id });
        }
      });

    circlesGroupData
      .attr('r', d => calculateRadius(d))
      .attr('cx', d => scale(moment(d.create_time)))
      .attr('fill', d => (d.color))
      .attr('stroke', 'white')
      .attr('stroke-width', d => calculateStrokeWidth(d))
      .on('click', (d) => {
        if (d.id !== 'starting_el' && d.id !== 'ending_el') {
          this.setState({ 'selectedEntity': d.id });
        }
      });

    circlesGroupData.exit().remove();
  }

  dataPrepare() {
    const { data, startDate, endDate } = this.props;
    const { selectedEntity } = this.state;
    let dataSorted = [...data];

    const endTime = moment(endDate.endOf('day'));
    const startTime = moment(startDate.startOf('day'));

    dataSorted = dataSorted.sort((a, b) => {
      if (moment(a.create_time).isBefore(moment(b.create_time))) {
        return -1;
      }
      return 1;
    });

    dataSorted.unshift({
      'create_time': startTime,
      'description': '',
      'name': 'Starting at',
      'severity': 1,
      'type': '',
      'id': 'starting_el',
    });

    dataSorted.push({
      'create_time': endTime,
      'description': '',
      'name': 'Ending at',
      'severity': 1,
      'type': '',
      'id': 'ending_el',
    });

    dataSorted.forEach((el, i) => {
      if (el.type === 'M') {
        dataSorted[i].color = '#ff0000';
      } else if (el.type === 'N') {
        dataSorted[i].color = '#f8e71c';
      } else {
        dataSorted[i].color = '#ff6f39';
      }
    });

    /* eslint-disable */
    dataSorted.reduce((acc, value) => {
      if (Object.keys(value).includes('name')) {
        if (value.id !== 'starting_el' && value.id !== 'ending_el') {
          if (!Array.isArray(value.name)) {
            value.name = value.name.split(' ');
          }
        } else {
          value.name = [value.name];
        }
      }
      return acc;
    }, []);
    /* eslint-enable */

    let entity = !selectedEntity ? dataSorted[dataSorted.length - 2].id : selectedEntity;

    /*
      Check if last label is too closed to ending_el,
      remove ending_el to not be overlapped with label
      Same check for first label
    */
    if (!startTime.isSame(endTime, 'day')) {
      if (endTime.diff(moment(dataSorted[dataSorted.length - 2].create_time), 'hours') < 6) {
        dataSorted.splice(dataSorted.length - 1, 1);
        entity = dataSorted[dataSorted.length - 1].id;
      }
      if ((moment(dataSorted[1].create_time).diff(startTime, 'hours') < 6)) {
        dataSorted.splice(0, 1);
      }
    }

    if (dataSorted.length > 2) {
      entity = dataSorted[dataSorted.length - 2].id;
    }

    if (!isEqual(dataSorted, this.state.dataSorted)) {
      this.setState({
        'dataSorted': dataSorted,
        'selectedEntity': entity,
      });
    }

    return d3.scaleTime()
      .range([this.svgConfig.widthPadding, this.state.width + this.svgConfig.widthPadding])
      .domain([new Date(startTime), new Date(endTime)]);
  }

  renderD3() {
    const node = this.svgNode;
    const svg = d3.select(node);

    this.constructor.createGradient(svg);

    this.drawRectangle(svg);

    const scale = this.dataPrepare();

    this.drawPoints(svg, scale);

    this.drawLabels(svg, scale);

    this.drawTimestamps(svg, scale);
  }

  render() {
    return (
      <div className="svgContainer">
        <svg
          ref={node => this.svgNode = node}
          className="timeline__chart"
          width={this.state.width}
          height={this.state.height}
        >
          <g className="rectangle" />
          <g className="circles" />
          <g className="labels" />
          <g className="timestamps" />
          <defs className="gradient" />
        </svg>
      </div>
    );
  }
}

TimelineChart.displayName = 'TimelineChart';
TimelineChart.propTypes = {
  'data': PropTypes.array,
  'startDate': PropTypes.any,
  'endDate': PropTypes.any,
};

TimelineChart.defaultProps = {
  'data': [],
  'startDate': moment().subtract(30, 'days').startOf('day'),
  'endDate': moment().startOf('day'),
};

export default TimelineChart;
