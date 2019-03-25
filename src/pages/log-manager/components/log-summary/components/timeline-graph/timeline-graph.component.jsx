import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { sidebarMenuWidth } from 'config';
import { FormattedHTMLMessage } from 'react-intl';

import D3TimelineGraph from './components/d3-timeline-graph.component';
import Legend from './components/legend.component';

import './d3-timeline-graph.style.scss';

const colorConfig = {
  'entities': '#a40cb4',
  'storage': '#54E0C1',
};

const dataSummary = [
  { 'name': 'entities', 'label': <FormattedHTMLMessage id="logManager.legend.entities" />, 'color': colorConfig.entities },
  { 'name': 'storage', 'label': <FormattedHTMLMessage id="logManager.legend.storage" />, 'color': colorConfig.storage },
];

export class TimelineGraph extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      'filterBy': '',
      'config': {
        'svgWidth': parseInt(window.innerWidth - sidebarMenuWidth - 56, 10),
        'svgHeight': 250,
        'marginLeft': 30,
        'marginTop': 20,
        'marginBottom': 10,
      },
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.setFilter = this.setFilter.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentDidMount() {
    this.updateDimensions();
  }

  // shouldComponentUpdate(nextProps) {
  //   return !nextProps.isLoading && nextProps.isLoading !== this.props.isLoading;
  // }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  setFilter(index) {
    this.setState({
      'filterBy': this.state.filterBy !== dataSummary[index].name
        ? dataSummary[index].name : '',
    });
  }

  updateDimensions() {
    const { config } = this.state;

    const fullWidth = parseInt(window.innerWidth - sidebarMenuWidth - 56, 10);

    if (fullWidth !== config.svgWidth) {
      this.setState({
        'config': {
          ...this.state.config,
          'svgWidth': fullWidth,
        },
      });
    }
  }


  render() {
    const { data } = this.props;
    let filteredData = data;

    if (this.state.filterBy !== '') {
      filteredData = filteredData.reduce((acc, d) => [...acc, {
        'date': d.date,
        [this.state.filterBy]: d[this.state.filterBy],
      }], []);
    }

    return (
      <div>
        <D3TimelineGraph
          {...this.props}
          data={filteredData}
          filterBy={this.state.filterBy}
          config={{
            ...this.state.config,
            color: colorConfig,
          }}
        />
        {
          filteredData.length > 0 && <Legend
            data={dataSummary}
            onClick={this.setFilter}
          />
        }
      </div>
    );
  }
}

TimelineGraph.displayName = 'TimelineGraph';
TimelineGraph.propTypes = {
  'data': PropTypes.array,
  'isLoading': PropTypes.bool,
};

TimelineGraph.defaultProps = {
  'data': [],
  'isLoading': false,
};

export default TimelineGraph;
