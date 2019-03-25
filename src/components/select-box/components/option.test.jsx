import React from 'react';
import Option from './option.component';

describe('<Option />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      className: 'test-class',
      id: 'test-id',
      isActive: false,
      content: 'test-content',
      singleSelect: true,
      onClick: jest.fn(),
      style: {},
    };
    wrapper = shallow(<Option {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onClick when element is clicked', () => {
    wrapper.find('.test-class').simulate('click');
    expect(props.onClick.mock.calls.length).toBe(1);
  });
});

