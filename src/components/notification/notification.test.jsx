import React from 'react';
import Notification from './notification.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Notification />', () => {
  it('should match with snapshot', () => {
    const wrapper = shallow(<Notification />);
    expect(wrapper).toMatchSnapshot();
  });
});
