import React from 'react';
import moment from 'moment';
import { MaliciousActivity } from './malicious-activity.container';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<MaliciousActivity />', () => {
  it('should match with snapshot', () => {
    const props = {
      isDataLoaded: false,
      data: [],
      heatMapData: [],
      pipelines: [],
      tags: {},
      handleExplodedView: jest.fn(),
      goBackUrl: jest.fn(),
      deleteLabel: jest.fn(),
      setLabelForPrediction: jest.fn(),
      time: {
        startTime: moment.utc('2018-10-11'),
        endTime: moment.utc('2018-10-11'),
        timezone: 'UTC',
      },
      filters: {},
      nextUrl: '',
      resetFilters: jest.fn(),
      setFilter: jest.fn(),
    };
    const wrapper = shallow(<MaliciousActivity {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
