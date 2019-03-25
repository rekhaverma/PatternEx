import React from 'react';
import Search from './search.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Search />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      className: 'test-class',
      inputProps: {},
      tag: 'test-tag',
      resetTags: jest.fn(),
    };
    wrapper = shallow(<Search {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call resetTags when element is clicked', () => {
    wrapper.find('Tag').simulate('click');
    expect(props.resetTags.mock.calls.length).toBe(1);
  });
});
