import React from 'react';
import Option from './option.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Option />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      id: 'string',
      value: 'string',
      onOptionClick: jest.fn(),
      className: 'select-box',
    };
    wrapper = shallow(<Option {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onOptionClick when element is clicked', () => {
    wrapper.find('.select-box__option').simulate('click');
    expect(props.onOptionClick.mock.calls.length).toBe(1);
  });
});
