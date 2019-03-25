import React from 'react';
import MultiSelect from './index';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<MultiSelect />', () => {
  let wrapper;
  let props;

  it('should match with snapshot with default type', () => {
    props = {
      value: 'test',
      options: ['test', 'another-test'],
      handleSelectChange: jest.fn(),
      onFooterClick: jest.fn(),
    };
    wrapper = shallow(<MultiSelect {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot with type "withHeader"', () => {
    props = {
      type: 'withHeader',
      value: 'test',
      options: ['test', 'another-test'],
      handleSelectChange: jest.fn(),
      onFooterClick: jest.fn(),
    };
    wrapper = shallow(<MultiSelect {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot with type "customReportSpecific"', () => {
    props = {
      type: 'customReportSpecific',
      value: 'test',
      options: ['test', 'another-test'],
      handleSelectChange: jest.fn(),
      onFooterClick: jest.fn(),
    };
    wrapper = shallow(<MultiSelect {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
