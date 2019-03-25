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
      onClick: jest.fn(),
    };
    wrapper = shallow(<Tag {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onClick when element is clicked', () => {
    wrapper.find('.tag__close').simulate('click');
    expect(props.onClick.mock.calls.length).toBe(1);
  });
});
