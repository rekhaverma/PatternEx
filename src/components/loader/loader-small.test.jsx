import React from 'react';
import LoaderSmall from './loader-small.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<LoaderSmall />', () => {
  it('should match with snapshot', () => {
    const wrapper = shallow(<LoaderSmall />);
    expect(wrapper).toMatchSnapshot();
  });
});
