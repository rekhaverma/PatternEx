import React from 'react';
import Column from './column.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Column />', () => {
  it('should match with snapshot', () => {
    const props = {
      children: <div />,
    };
    const wrapper = shallow(<Column {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
