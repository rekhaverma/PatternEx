import React from 'react';
import OptionList from './options-list.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<OptionList />', () => {
  it('should match with snapshot', () => {
    const props = {
      options: [{
        id: 'string',
        value: 'string',
        isSelected: true
      }],
      onOptionClick: jest.fn(),
      dropDownHeader: 'Filter',
    };
    const wrapper = shallow(<OptionList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - autocomplete', () => {
    const props = {
      allowSearch: true,
      options: [{
        id: 'string',
        value: 'string',
        isSelected: true
      }],
      onOptionClick: jest.fn(),
      dropDownHeader: 'Filter',
    };
    const wrapper = shallow(<OptionList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
