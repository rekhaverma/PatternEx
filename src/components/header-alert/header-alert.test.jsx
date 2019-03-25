import React from 'react';
import HeaderAlert from './header-alert.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<HeaderAlert />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      active: true,
      noInactive: true,
      onClick: jest.fn(),
    };
    wrapper = shallow(<HeaderAlert {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onClick when element is clicked', () => {
    wrapper.find('.header1__alert').simulate('click');
    expect(props.onClick.mock.calls.length).toBe(1);
  });
});
