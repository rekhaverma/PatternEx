import React from 'react';
import Loader from './loader.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Loader />', () => {
  it('should match with snapshot', () => {
    const wrapper = shallow(<Loader />);
    expect(wrapper).toMatchSnapshot();
  });
});
