import React from 'react';
import moment from 'moment';
import RowThemeWithLabel from './row-theme-with-label.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<RowThemeWithLabel />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      startDate: moment.utc('2018-01-01'),
      endDate: moment.utc('2018-01-07'),
      className: 'row',
      onClick: jest.fn(),
    };
    wrapper = shallow(<RowThemeWithLabel {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onClick when element is clicked', () => {
    wrapper.find('.row').first().simulate('click');
    expect(props.onClick.mock.calls.length).toBe(1);
  });
});
