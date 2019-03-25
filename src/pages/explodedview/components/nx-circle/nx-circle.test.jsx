import React from 'react';
import NXCircle from './nx-circle.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<NXCircle />', () => {
  it('should match with snapshot', () => {
    const props = {
      domains: ['demo.com']
    };
    const wrapper = shallow(<NXCircle {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
