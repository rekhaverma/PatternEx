import React from 'react';
import OptionLabel from './label.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<OptionLabel />', () => {
  it('should match with snapshot with "hasCancel"', () => {
    const props = {
      hasCancel: true,
    };
    const wrapper = shallow(<OptionLabel {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot without "hasCancel"', () => {
    const wrapper = shallow(<OptionLabel />);
    expect(wrapper).toMatchSnapshot();
  });
});
