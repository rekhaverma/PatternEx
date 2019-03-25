import React from 'react';
import Tag from './tag.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Tag />', () => {
  let props;

  beforeEach(() => {
    props = {
      label: 'Unit Testing'
    };
  });

  it('should match with snapshot - default props', () => {
    const wrapper = shallow(<Tag {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot - with remove button', () => {
    props.onRemove = jest.fn();
    const wrapper = shallow(<Tag {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onRemove when element is clicked', () => {
    props.onRemove = jest.fn();
    const wrapper = shallow(<Tag {...props} />);
    wrapper.find('.icon-Trash-icon').simulate('click');
    expect(props.onRemove.mock.calls.length).toBe(1);
  });
});
