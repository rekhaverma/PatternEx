import React from 'react';
import DynamicPopup from './dynamicPopup.component';
/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<DynamicPopup />', () => {
  let wrapper; let props;

  beforeEach(() => {
    props = {
      className: 'dynamic-popup',
      text: <div className="dynamic-popup__text">Text</div>,
      onClick: jest.fn(),
    };
    wrapper = shallow(<DynamicPopup {...props} />);
  })

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onClick when element is clicked', () => {
    wrapper.find('.button').simulate('click');
    expect(props.onClick.mock.calls.length).toBe(1);
  });
}) 
