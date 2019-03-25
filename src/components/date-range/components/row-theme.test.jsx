import React from 'react';
import moment from 'moment';
import RowTheme from './row-theme.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<RowTheme />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      startDate: moment.utc('2018-01-01'),
      endDate: moment.utc('2018-01-07'),
      className: 'row-theme',
      onClick: jest.fn(),
    };
    wrapper = shallow(<RowTheme {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onClick when element is clicked', () => {
    wrapper.find('.row-theme').first().simulate('click');
    expect(props.onClick.mock.calls.length).toBe(1);
  });
});
