import React from 'react';
import * as d3 from 'd3';
import moment from 'moment';

import { TimelineDiagram } from './d3-timeline-diagram.component';

const mockData = {
  1527811200000: {
    'malicious': 0,
    'suspicious': 21,
  },
  1528761600000: {
    'malicious': 65,
    'suspicious': 107,
  },
  1529712000000: {
    'malicious': 0,
    'suspicious': 116,
  },
  1529884800000: {
    'malicious': 0,
    'suspicious': 112,
  },
};

const configValues = {
  'svgWidth': 1700,
  'svgHeight': 160,
  'marginLeft': 20,
  'marginTop': 20,
  'marginBottom': 5,
};

const getSvg = () => d3.select('svg');

const createSvg = (config) => {
  const that = {};
  that.render = () => d3.select('body').append('svg')
    .attr('class', 'timeline_diagram')
    .attr('height', config.svgHeight)
    .attr('width', config.svgWidth)
    .append('g')
    .attr('transform', `translate(${config.marginLeft}, ${config.marginTop})`)
    .attr('class', 'diagram__group');

  return that;
};

describe('<TimelineDiagram />', () => {
  const props = {
    'config': configValues,
    'startDate': moment.utc('06-01-2018', 'MM-DD-YYYY'),
    'endDate': moment.utc('06-30-2018', 'MM-DD-YYYY'),
    'tab': 'malicious',
    'activeView': 'malicious',
    'items': mockData,
  };

  let component;
  beforeEach(() => {
    component = mount(<TimelineDiagram {...props} />);
  });

  it('chart container should contain 1 element', () => {
    expect(component.find('svg').length).toBe(1);
  });

  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });


  describe('Test chart creation', () => {
    beforeEach(() => {
      const chart = createSvg(configValues);
      chart.render();
    });

    afterEach(() => d3.selectAll('svg').remove());

    describe('the svg ', () => {
      it('should be created', () => {
        expect(getSvg()).not.toBeNull();
      });
      it('should have the correct height', () => {
        expect(Number(getSvg().attr('height'))).toBe(configValues.svgHeight);
      });

      it('should have the correct width', () => {
        expect(Number(getSvg().attr('width'))).toBe(configValues.svgWidth);
      });
    });
  });
});
