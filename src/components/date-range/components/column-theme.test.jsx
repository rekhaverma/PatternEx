import React from 'react';
import moment from 'moment';
import ColumnTheme from './column-theme.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<ColumnTheme />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      className: 'row',
      startDate: moment.utc('2018-01-01'),
      endDate: moment.utc('2018-01-07'),
      onClick: jest.fn(),
    };
    wrapper = shallow(<ColumnTheme {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onClick when element is clicked', () => {
    wrapper.find('.row').simulate('click');
    expect(props.onClick.mock.calls.length).toBe(1);
  });
});
