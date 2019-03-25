import React from 'react';
import SingleSelect from './single-select.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<SingleSelect />', () => {
  let props;

  beforeEach(() => {
    props = {
      options: [
        {
          id: 'string',
          value: 'string',
        }],
      activeOption: 'string',
      onOptionUpdate: jest.fn(),
      boxIsOpen: false,
      openBox: jest.fn(),
      closeBox: jest.fn(),
      allowClear: true,
    };
  });

  it('should match with snapshot', () => {
    const wrapper = shallow(<SingleSelect {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot - with options list', () => {
    props.boxIsOpen = true;
    const wrapper = shallow(<SingleSelect {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
