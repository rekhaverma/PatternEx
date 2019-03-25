import React from 'react';
import moment from 'moment';

import { LabelsHistoryTimeline } from './labels-history-timeline.container';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<LabelsHistoryTimeline />', () => {
  describe('render: ', () => {
    it('should match with snapshot', () => {
      const props = {
        startDate: moment.utc('2018-05-24T00:00:00.000Z'),
        endDate: moment.utc('2018-06-23T23:59:59.999Z'),
        searchData: {},
        isLabelsHistoryLoaded: true,
        labelsHistory: [
          {
            name: 'CC Fraud',
            create_time: 'Sat, 23 Jun 2018 09:03:00 -0000',
            severity: 4,
            description: 'Credit Card Fraud. Account created using compromised/stolen credit card details and personal identity information',
            type: 'M',
            id: '98ca552c-bff2-4969-9d18-bcc4da4759f1',
          },
          {
            name: 'CC Fraud',
            create_time: 'Sat, 23 Jun 2018 09:03:00 -0000',
            severity: 4,
            description: 'Credit Card Fraud. Account created using compromised/stolen credit card details and personal identity information',
            type: 'M',
            id: 'd7f73c05-3187-41d1-93c8-2a72a44d892d',
          },
          {
            name: 'Exfiltration',
            create_time: 'Mon, 04 Jun 2018 08:57:00 -0000',
            severity: 4,
            description: 'Techniques and attributes that result or aid in the adversary removing files and information from a target network.',
            type: 'M',
            id: '679908c1-3b89-42b4-97bd-57d7e8655649',
          }],
        location: {
          behavior_type: 'suspicious',
          end_time: '06-23-2018',
          entity_id: '3a627a00-76c4-11e8-8caf-6bff10ab57c7',
          entity_name: '172.18.16.236 8.8.8.8',
          method_name: 'ranking',
          mode: 'realtime',
          model_name: '2018-04-29-Ranking-SipDip-1-ICMPEXFIL',
          pipeline: 'sipdip',
          start_time: '06-23-2018',
        },
        customerName: '',
      };
      const wrapper = shallow(<LabelsHistoryTimeline {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
