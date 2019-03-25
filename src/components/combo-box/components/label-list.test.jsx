import React from 'react';
import LabelList from './label-list-component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<LabelList />', () => {
  it('should match with snapshot', () => {
    const props = {
      labels: ['Test', 'Another Test'],
      onCancel: jest.fn(),
    };
    const wrapper = shallow(<LabelList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
