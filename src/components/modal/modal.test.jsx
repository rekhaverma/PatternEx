import React from 'react';
import Modal from './modal.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Modal />', () => {
  it('should match with snapshot', () => {
    const props = {
      children: <div className="testing-modal" />,
    };
    const wrapper = shallow(<Modal {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
