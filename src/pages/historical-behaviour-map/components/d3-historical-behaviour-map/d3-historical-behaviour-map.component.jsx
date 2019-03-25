import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import NoData from 'components/no-data';
import { isEqual } from 'lodash';
import moment from 'moment';

import { isSameDay, multipleDatesOnSameDay } from '../../config';

import './d3-historical-behaviour-map.style.scss';

const margin = {
  'top': 40,
  'right': 10,
  'bottom': 10,
  'left': 10,
};

export const featureWidth = 150;
const height = 260;

const getDateTicks = data => data.map(dataObject => moment(dataObject.date));

const timeFormat = (timeAxisTicks) => {
  if (multipleDatesOnSameDay(timeAxisTicks)) {
    return '%m-%d-%Y %H:%M';
  }
  return '%m-%d-%Y';
};

const getColumnName = (key, data) => data.find(el => (el.name === key)) || {};

const getMaxValue = (feature, data) => {
  let initialMaxVal = Number(data[0][feature]);
  data.forEach((item) => {
    if (Number(item[feature]) > initialMaxVal) {
      initialMaxVal = Number(item[feature]);
    }
  });
  return initialMaxVal;
};

const appendTooltip = (xPos, yPos, classname) => {
  const tooltip = d3.select(`.${classname}`)
    .append('div')
    .attr('data-placement', 'bottom')
    .attr('class', `${classname}__tooltip popper-wrap`)
    .style('position', 'fixed');
  tooltip.append('span')
    .attr('class', 'popper__arrow');
  tooltip.append('div')
    .attr('class', `${classname}__popper popper`);

  tooltip.style('left', `${xPos}px`)
    .style('top', `${yPos}px`)
    .style('width', `${featureWidth}px`);
};

const appendTooltipData = (data) => {
  const tooltipBox = d3.select('.popper');

  const tooltipInfo = tooltipBox.append('div')
    .attr('class', 'popper__info');
  tooltipInfo.append('span')
    .html(() => data);
};

const removeTooltip = (classname) => {
  d3.selectAll(`.${classname}__tooltip`).remove();
};

export class D3HistoricalBehaviourMap extends React.Component {
  constructor(...args) {
    super(...args);

    this.svgNode = null;
  }

  componentDidMount() {
    if (this.props.historicalData.length > 0) {
      this.renderD3();
    }
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props.historicalData, nextProps.historicalData) ||
      !isEqual(this.props.startDate, nextProps.startDate ||
      !isEqual(this.props.endDate, nextProps.endDate)) ||
      !isEqual(this.props.selectedDate, nextProps.selectedDate);
  }

  componentDidUpdate() {
    if (this.props.historicalData.length > 0) {
      this.renderD3();
    }
  }

  renderD3() {
    const { classname, startDate, endDate, historicalData, featuresNumber } = this.props;
    const { selectedDate, setSelectedDate } = this.props;

    const node = this.svgNode;

    const svg = d3.select(node);
    svg.select(`.${classname}__main`)
      .attr('transform', `translate(0, ${margin.top})`);

    const width = featuresNumber * featureWidth;

    const x = d3.scaleLinear()
      .range([0, width]);

    const timeScale = d3.scaleTime()
      .range([0, width])
      .domain([new Date(startDate), new Date(endDate)]);

    const y = {};

    const axis = d3.axisRight(x);
    const timeAxisTicks = getDateTicks(historicalData);

    const timeAxis = d3.axisRight(timeScale)
      .tickValues(timeAxisTicks)
      .tickFormat(d3.timeFormat(timeFormat(timeAxisTicks)));

    const tooltip = d3.select(`.${classname}`)
      .append('div')
      .attr('class', `${classname}__tooltip popper-wrap`)
      .style('opacity', 0);

    const dimensions = d3.keys(historicalData[0])
      .filter((d) => {
        // property used only for design
        if (d !== 'highlightEntity') {
          // date property must use scaleTime
          if (d === 'date') {
            return y[d] = d3.scaleTime()
              .domain(d3.extent(historicalData, p => +p[d]))
              .range([height, 0]);
          }
          if (d === 'predicted_tag') {
            return y[d] = d3.scalePoint()
              .domain(d3.extent(historicalData, p => p[d]))
              .range([height, 0]);
          }
          const maxValue = getMaxValue(d, historicalData);
          return y[d] = d3.scaleLinear()
            .domain([0, maxValue])
            .range([height, 0]);
        }
        return null;
      });

    x.domain([0, dimensions.length]);


    const path = (d) => {
      const line = d3.line();
      return line(dimensions.map((p, i) => [x(i), y[p](d[p])]));
    };

    // lines between axis
    const colorScale = d3.scaleOrdinal(d3.schemeCategory20);

    const checkDates = (d) => {
      const multipleDates = multipleDatesOnSameDay(getDateTicks(historicalData));

      if (multipleDates) {
        return isSameDay(moment(d.date), selectedDate);
      }
      return moment(d.date).isSame(moment(selectedDate), 'day');
    };

    const connectionsGroup = svg.select(`.${classname}__connections`);
    const connectionsGroupData = connectionsGroup.selectAll('.connection')
      .data(historicalData);
    connectionsGroupData.enter()
      .append('path')
      .attr('class', (d) => {
        if (checkDates(d) && historicalData.length > 1) {
          return 'connection +selected';
        }
        return 'connection';
      })
      .attr('d', path)
      .attr('stroke', (d, i) => {
        if (d.highlightEntity) {
          return '#F81C1C';
        }
        return colorScale(i);
      });
    connectionsGroupData
      .attr('d', path)
      .attr('class', (d) => {
        if (checkDates(d) && historicalData.length > 1) {
          return 'connection +selected';
        }
        return 'connection';
      })
      .attr('stroke', (d, i) => {
        if (d.highlightEntity) {
          return '#F81C1C';
        }
        return colorScale(i);
      });
    connectionsGroupData.exit().remove();

    connectionsGroup.selectAll('.connection')
      .on('click', function (d) {
        if (!checkDates(d) && historicalData.length > 1) {
          d3.select(this)
            .classed('+selected', true);
        } else {
          d3.select(this)
            .classed('+selected', false);
        }
        setSelectedDate(d.date);
      });

    // axis and top text
    const dimensionsGroup = svg.select(`.${classname}__dimensions`);
    dimensionsGroup.selectAll('.dimension').remove();
    const dimensionsGroupData = dimensionsGroup.selectAll('.dimension')
      .data(dimensions);
    dimensionsGroupData
      .enter()
      .append('g')
      .attr('class', 'dimension')
      .attr('transform', (d, i) => `translate(${x(i)})`)
      .append('g')
      .attr('class', 'axis')
      .each(function (d) {
        if (d !== 'highlightEntity') {
          if (d === 'date') {
            return d3.select(this).call(timeAxis.scale(y[d]));
          }
          return d3.select(this).call(axis.scale(y[d]));
        }
        return null;
      })
      .append('foreignObject')
      .attr('class', d => `coord-title ${d}`)
      .attr('y', -40)
      .attr('width', featureWidth)
      .append('xhtml:div')
      .html((d) => {
        if (d !== 'highlightEntity') {
          if (d === 'date') {
            return 'Date';
          }
          if (d === 'predicted_tag') {
            return 'Predicted Tag';
          }

          return Object.keys(getColumnName(d, this.props.columnFormat)).includes('displayName') ?
            getColumnName(d, this.props.columnFormat).displayName : d;
        }
        return null;
      })
      .on('mouseover', (d) => {
        const elementBounding = d3.selectAll(`foreignObject.${d} div`)._groups[0][0].getBoundingClientRect();
        const pageX = elementBounding.x + ((elementBounding.width / 2) - (featureWidth / 2));
        const pageY = elementBounding.y + (elementBounding.height - 10);

        tooltip.transition().duration(200).style('opacity', 0.9).attr('width', '100%');

        appendTooltip(pageX, pageY, classname);

        let featureDescription = '';

        if (d === 'date') {
          featureDescription = 'Date';
        } else if (d === 'predicted_tag') {
          featureDescription = 'Predicted Tag';
        } else {
          featureDescription = Object.keys(getColumnName(d, this.props.columnFormat)).includes('description') ?
            getColumnName(d, this.props.columnFormat).description : d;
        }

        appendTooltipData(featureDescription);
      })
      .on('mouseout', () => {
        removeTooltip(classname);
        tooltip.transition().duration(500).style('opacity', 0);
      });
    dimensionsGroupData.exit().remove();
  }

  render() {
    const { classname, historicalData, featuresNumber } = this.props;
    const width = featuresNumber * featureWidth;

    if (historicalData.length > 0) {
      return (
        <div className={classname}>
          <svg ref={node => this.svgNode = node} className={`${classname}__svg`} width={width}>
            <filter id="blur-filter" x="-2" y="-2" width="13" height="13">
              <feGaussianBlur stdDeviation="2" />
            </filter>
            <g className={`${classname}__main`}>
              <g className={`${classname}__connections`} />
              <g className={`${classname}__dimensions`} />
            </g>
          </svg>
        </div>
      );
    }
    return (
      <div className={`${classname}--noData`}>
        <NoData
          intlId="global.nodata"
          intlDefault="There is no data to display"
          className="nodata"
          withIcon
        />
      </div>
    );
  }
}

D3HistoricalBehaviourMap.displayName = 'D3HistoricalBehaviourMap';
D3HistoricalBehaviourMap.propTypes = {
  'startDate': PropTypes.object,
  'endDate': PropTypes.object,
  'featuresNumber': PropTypes.number,
  'classname': PropTypes.string,
  'historicalData': PropTypes.array,
  'columnFormat': PropTypes.array,
  'selectedDate': PropTypes.object,
  'setSelectedDate': PropTypes.func,
};
D3HistoricalBehaviourMap.defaultProps = {
  'startDate': moment().subtract(30, 'days'),
  'endDate': moment(),
  'featuresNumber': 0,
  'classname': 'd3-historical-behaviour-map',
  'historicalData': [],
  'columnFormat': [],
  'selectedDate': {},
  'setSelectedDate': () => null,
};

export default D3HistoricalBehaviourMap;
