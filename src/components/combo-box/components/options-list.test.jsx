import React from 'react';
import OptionList from './options-list.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<OptionList />', () => {
  it('should match with snapshot', () => {
    const props = {
      options: ['Test', 'Another Test'],
      onClick: jest.fn(),
    };
    const wrapper = shallow(<OptionList {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
