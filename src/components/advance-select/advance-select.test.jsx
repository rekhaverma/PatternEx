import React from 'react';
import { AdvanceSelect } from './advance-select.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 * @todo: update test when multiple select will be implement
 */
describe('<AdvanceSelect />', () => {
  it('should match with snapshot', () => {
    const props = {
      options: [],
      activeOption: '',
      onOptionUpdate: jest.fn(),
      boxIsOpen: false,
      openBox: jest.fn(),
      closeBox: jest.fn(),
      allowClear: true,
      defaultValue: 'all',
      dropDownHeader: 'filter',
    };
    const wrapper = shallow(<AdvanceSelect {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
