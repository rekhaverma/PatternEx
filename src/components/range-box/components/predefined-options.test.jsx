import React from 'react';
import PredefinedOptions from './predefined-options.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<PredefinedOptions />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      activeOption: '',
      className: 'test-class',
      options: [
        {
          id: 1,
          label: 'test-option',
        }],
      hasButtons: true,
      onApply: jest.fn(),
      onCancel: jest.fn(),
      onClick: jest.fn(),
    };
    wrapper = shallow(<PredefinedOptions {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onClick when element is clicked', () => {
    wrapper.find('.test-class__element > span').simulate('click');
    expect(props.onClick.mock.calls.length).toBe(1);
  });

  it('should call onApply when element is clicked', () => {
    wrapper.find('.button--success').simulate('click');
    expect(props.onApply.mock.calls.length).toBe(1);
  });

  it('should call onCancel when element is clicked', () => {
    wrapper.find('.button--dark').simulate('click');
    expect(props.onCancel.mock.calls.length).toBe(1);
  });
});
