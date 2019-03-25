import React from 'react';
import InspectModal from './inspect-modal.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<InspectModal />', () => {
  it('should match with snapshot', () => {
    const props = {
      description: 'description',
      name: 'name',
    };
    const wrapper = shallow(<InspectModal {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
