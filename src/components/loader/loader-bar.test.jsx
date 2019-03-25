import React from 'react';
import LoaderBar from './loader-bar.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<LoaderBar />', () => {
  it('should match with snapshot', () => {
    const wrapper = shallow(<LoaderBar />);
    expect(wrapper).toMatchSnapshot();
  });
});
