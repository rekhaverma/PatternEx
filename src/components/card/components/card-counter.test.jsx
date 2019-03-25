import React from 'react';
import CardCounter from './card-counter.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<CardCounter />', () => {
  it('should match with snapshot', () => {
    const props = {
      value: 1,
    };
    const wrapper = shallow(<CardCounter {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
