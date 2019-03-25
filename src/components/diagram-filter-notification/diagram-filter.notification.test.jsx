import React from 'react';
import moment from 'moment';
import FilterNotification from './diagram-filter-notification.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<FilterNotification />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      date: moment.utc('2018-01-01'),
      clearFilter: jest.fn(),
    };
    wrapper = shallow(<FilterNotification {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call clearFilter when element is clicked', () => {
    wrapper.find('.icon-close').simulate('click');
    expect(props.clearFilter.mock.calls.length).toBe(1);
  });
});
