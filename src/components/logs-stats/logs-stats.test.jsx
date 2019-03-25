import React from 'react';
import LogsStats from './logs-stats.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<LogsStats />', () => {
  it('should match with snapshot', () => {
    const props = {
      logs: [
        {
          count: 1,
          label: 'testing logs',
        }],
    };
    const wrapper = shallow(<LogsStats {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
