import React from 'react';
import moment from 'moment';
import TimelineChart from './timelinechart.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<TimelineChart />', () => {
  it('should match with snapshot', () => {
    const props = {
      data: [
        {
          color: '#ff0000',
          create_time: 'Sat, 23 Jun 2018 09:03:00 -0000',
          description: 'Credit Card Fraud. Account created using compromised/stolen credit card details and personal identity information',
          id: '98ca552c-bff2-4969-9d18-bcc4da4759f1',
          name: ['CC', 'Fraud'],
          severity: 4,
          type: 'M',
        }],
      startDate: moment.utc('2018-01-30').subtract(30, 'days').startOf('day'),
      endDate: moment.utc('2018-01-30').startOf('day'),
    };
    const wrapper = mount(<TimelineChart {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
