import React from 'react';
import moment from 'moment';
import CustomRangeContent from './custom-range-content.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<CustomRangeContent />', () => {
  it('should match with snapshot', () => {
    const props = {
      className: 'test-class',
      startDate: moment.utc('2018-01-01'),
      endDate: moment.utc('2018-01-07'),
      currentDate: moment.utc('2018-01-07'),
    };
    const wrapper = shallow(<CustomRangeContent {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
