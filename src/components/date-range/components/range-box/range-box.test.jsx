import React from 'react';
import moment from 'moment';
import RangeBox from './range-box.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<RangeBox />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      className: 'range-box',
      currentDate: moment.utc('2018-01-01'),
      endDate: moment.utc('2018-01-01'),
      startDate: moment.utc('2018-01-01'),
      onDatesChange: jest.fn(),
      onMonthChange: jest.fn(),
    };
    wrapper = shallow(<RangeBox {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the component with .range-box', () => {
    expect(wrapper.find('.range-box__flex').length).toEqual(1);
  });

  it('should trigger onDatesChange when method onDatesChange is called', () => {
    wrapper.instance().onDatesChange(moment.utc('2018-01-01'));

    expect(props.onDatesChange.mock.calls.length).toBe(1);
  });

  it('should trigger onDatesChange when method onSelectHour is called', () => {
    wrapper.instance().onSelectHour('12:00');

    expect(props.onDatesChange.mock.calls.length).toBe(1);
  });

  it('should trigger onMonthChange when method onMonthChange is called', () => {
    wrapper.instance().onMonthChange(moment.utc('2018-01-01'));

    expect(props.onMonthChange.mock.calls.length).toBe(1);
  });
});
