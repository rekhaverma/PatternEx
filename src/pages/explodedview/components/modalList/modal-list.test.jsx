import React from 'react';
import ModalList from './modalList.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<ModalList />', () => {
  it('should match with snapshot', () => {
    const props = {
      className: 'modalList',
      title: {},
      onClose: () => null,
      children: <span />,
    };
    const wrapper = shallow(<ModalList {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
