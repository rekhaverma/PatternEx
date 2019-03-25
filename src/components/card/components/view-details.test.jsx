import React from 'react';
import ViewDetails from './view-details.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<ViewDetails />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      className: 'test-selector-on-click',
      text: <div className="test-selector">Test View Details</div>,
      onClick: jest.fn(),
    };
    wrapper = shallow(<ViewDetails {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onClick when element is clicked', () => {
    wrapper.find('.test-selector-on-click').simulate('click');
    expect(props.onClick.mock.calls.length).toBe(1);
  });
});
