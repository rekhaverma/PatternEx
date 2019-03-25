import React from 'react';
import moment from 'moment';

import TimelineDiagramContainer from './d3-timeline-diagram-container.component';

jest.mock('./constants', () => ({
  defaultEndDate: { format: () => '2018-08-01' },
  defaultStartDate: { format: () => '2018-08-01' },
}));

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<TimelineDiagramContainer />', () => {
  it('should match with snapshot', () => {
    const props = {
      startDate: moment.utc('2018-08-06').startOf('day'),
      endDate: moment.utc('2018-08-10').endOf('day'),
      tab: 'malicious',
      items: {},
      description: 'description',
      activeView: 'malicious',
      onDayClick: jest.fn(),
      resetDayClick: jest.fn(),
    };
    const wrapper = shallow(<TimelineDiagramContainer {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
