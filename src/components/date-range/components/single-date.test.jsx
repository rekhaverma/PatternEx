import React from 'react';
import moment from 'moment';
import SingleDate from './single-date.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<SingleDate />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      currentDate: moment.utc('2018-01-01'),
      onDateChange: jest.fn(),
      onMonthChange: jest.fn(),
    };
    wrapper = shallow(<SingleDate {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger onDateChange when method onDateChange is called', () => {
    wrapper.instance().onDateChange(moment.utc('2018-01-01'));

    expect(props.onDateChange.mock.calls.length).toBe(1);
  });

  it('should trigger onMonthChange when method onMonthChange is called', () => {
    wrapper.instance().onMonthChange(moment.utc('2018-01-01'));

    expect(props.onMonthChange.mock.calls.length).toBe(1);
  });
});
