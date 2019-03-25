import React from 'react';
import AddNewRuleFooterComponent from './addNewRuleFooterComponent';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<AddNewRuleFooterComponent />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      onFooterClick: jest.fn(),
    };
    wrapper = shallow(<AddNewRuleFooterComponent {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onClick when element is clicked', () => {
    wrapper.find('.menuRendererCR__footer').simulate('click');
    expect(props.onFooterClick.mock.calls.length).toBe(1);
  });
});
