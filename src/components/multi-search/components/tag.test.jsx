import React from 'react';
import Tag from './tag.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */

describe('<Tag />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      value: 'tag',
      className: 'tag',
      onRemove: jest.fn(),
    };

    wrapper = shallow(<Tag {...props} />);
  });

  it('should renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger the remove method', () => {
    wrapper.find('.icon-remove').simulate('click');

    expect(props.onRemove.mock.calls.length).toEqual(1);
  });
});