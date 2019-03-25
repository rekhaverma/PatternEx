import React from 'react';
import ClearFilters from './clear-filters.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<ClearFilters />', () => {
  let wrapper; let props;

  beforeEach(() => {
    props = {
      text: 'Reset',
      onClick: jest.fn(),
    };
    wrapper = shallow(<ClearFilters {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onClick when element is clicked', () => {
    wrapper.find('.clear-filters').simulate('click');
    expect(props.onClick.mock.calls.length).toBe(1);
  });
});
