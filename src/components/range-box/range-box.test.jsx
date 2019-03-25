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
      startDate: moment.utc('2018-01-01'),
      endDate: moment.utc('2018-01-07'),
      currentDate: moment.utc('2018-01-07'),
      updateRange: jest.fn(),
    };
    wrapper = shallow(<RangeBox {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
