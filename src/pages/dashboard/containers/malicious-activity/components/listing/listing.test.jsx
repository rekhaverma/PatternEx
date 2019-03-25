import React from 'react';
import moment from 'moment';
import { Listing } from './listing.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Listing />', () => {
  it('should match with snapshot - with loading', () => {
    const props = {
      isDataLoaded: false,
      isOldEVPActive: true,
      data: [],
      handleExplodedView: jest.fn(),
      goBackUrl: jest.fn(),
      deleteLabel: jest.fn(),
      setLabelForPrediction: jest.fn(),
    };
    const wrapper = shallow(<Listing {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - w/o data', () => {
    const props = {
      isDataLoaded: true,
      data: [],
      handleExplodedView: jest.fn(),
      goBackUrl: jest.fn(),
      deleteLabel: jest.fn(),
      setLabelForPrediction: jest.fn(),
      time: {
        startTime: moment.utc('2018-10-11'),
        endTime: moment.utc('2018-10-11'),
        timezone: 'UTC',
      },
    };
    const wrapper = shallow(<Listing {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - with data', () => {
    const props = {
      isDataLoaded: true,
      data: [{}],
      handleExplodedView: jest.fn(),
      goBackUrl: jest.fn(),
      deleteLabel: jest.fn(),
      setLabelForPrediction: jest.fn(),
      time: {
        startTime: moment.utc('2018-10-11'),
        endTime: moment.utc('2018-10-11'),
        timezone: 'UTC',
      },
    };
    const wrapper = shallow(<Listing {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
