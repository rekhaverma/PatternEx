import React from 'react';
import ComboBox from './combo-box.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<ComboBox />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      activeOption: ['Test'],
      setOption: jest.fn(),
    };
    wrapper = shallow(<ComboBox {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger setOption when method removeLabel is called', () => {
    wrapper.instance().removeLabel('Test');

    expect(props.setOption.mock.calls.length).toBe(1);
  });

  it('should trigger setOption when method addLabel is called', () => {
    wrapper.instance().addLabel('Test 2');

    expect(props.setOption.mock.calls.length).toBe(1);
  });
});
