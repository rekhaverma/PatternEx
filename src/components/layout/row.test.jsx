import React from 'react';
import Row from './row.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Row />', () => {
  it('should match with snapshot', () => {
    const props = {
      children: <div />,
    };
    const wrapper = shallow(<Row {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
