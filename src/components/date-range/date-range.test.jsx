import React from 'react';
import moment from 'moment';
import DateRange from './date-range.component';

/**
 * @status: WIP
 * @sign-off-by: Alex Andries
 * @todo: Review and add necessary tests
 */
describe('<DateRange />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      currentSingleDate: moment.utc('2018-01-01'),
      activeOption: '7days',
      startDate: moment.utc('2018-01-01'),
      endDate: moment.utc('2018-01-07'),
      boxIsOpen: false,
      openBox: jest.fn(),
      closeBox: jest.fn(),
    };
  });

  it('should match with snapshot default', () => {
    wrapper = shallow(<DateRange {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot for single type', () => {
    props.type = 'single';
    wrapper = shallow(<DateRange {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot for daily type', () => {
    props.type = 'daily';
    wrapper = shallow(<DateRange {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
