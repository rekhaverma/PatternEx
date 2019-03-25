import React from 'react';
import Section from './section.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Section />', () => {
  it('should match with snapshot with default props and loading', () => {
    const props = {
      children: {},
      size: 'small',
      title: null,
      className: '',
      expandable: false,
      expandableView: null,
      modalStyle: {},
      dropdown: false,
      dropDownState: false,
      dropDownOptions: [],
      selectedDropDown: [],
      loaded: false,
      onDropDownClick: jest.fn(),
      onDropDownSelection: jest.fn(),
    };
    const wrapper = shallow(<Section {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot with default props and not loading', () => {
    const props = {
      children: {},
      size: 'small',
      title: null,
      className: '',
      expandable: false,
      expandableView: null,
      modalStyle: {},
      dropdown: false,
      dropDownState: false,
      dropDownOptions: [],
      selectedDropDown: [],
      loaded: true,
      onDropDownClick: jest.fn(),
      onDropDownSelection: jest.fn(),
    };
    const wrapper = shallow(<Section {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should call onDropDownClick when element is clicked', () => {
    const props = {
      children: {},
      size: 'small',
      title: null,
      className: '',
      expandable: false,
      expandableView: null,
      modalStyle: {},
      dropdown: true,
      dropDownState: false,
      dropDownOptions: [],
      selectedDropDown: [],
      loaded: true,
      onDropDownClick: jest.fn(),
      onDropDownSelection: jest.fn(),
    };
    const wrapper = shallow(<Section {...props} />);

    wrapper.find('.section__dropdown').simulate('click');
    expect(props.onDropDownClick.mock.calls.length).toBe(1);
  });
});
