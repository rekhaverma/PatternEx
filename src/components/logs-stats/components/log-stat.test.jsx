import React from 'react';
import LogStat from './log-stat.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<LogStat />', () => {
  it('should match with snapshot', () => {
    const props = {
      count: 1,
      label: 'testing logs',
    };
    const wrapper = shallow(<LogStat {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
