import React from 'react';
import Option from './option.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Option />', () => {
  let wrapper; let props;

  beforeEach(() => {
    props = {
      option: 'Test',
      onClick: jest.fn(),
      isActive: true,
    };
    wrapper = shallow(<Option {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onClick when element is clicked', () => {
    wrapper.find('span').simulate('click');
    expect(props.onClick.mock.calls.length).toBe(1);
  });
});
