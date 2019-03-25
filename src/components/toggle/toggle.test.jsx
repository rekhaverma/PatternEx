import React from 'react';
import Toggle from './toggle.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Toggle />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: 'h0xjn',
      checked: false,
      onValueChange: jest.fn(),
    };
  });

  it('should match with snapshot - off state', () => {
    const wrapper = shallow(<Toggle {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot - on state', () => {
    props.checked = true;
    const wrapper = shallow(<Toggle {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot - disabled', () => {
    props.disabled = true;
    const wrapper = shallow(<Toggle {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onValueChange when input is changed', () => {
    const wrapper = shallow(<Toggle {...props} />);
    wrapper.find('input').simulate('change');
    expect(props.onValueChange.mock.calls.length).toBe(1);
  });
});
