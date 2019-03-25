import React from 'react';

import { DetailsCard } from './details-card.container';
import { locationBackUrl } from 'lib';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
jest.mock('lib/location-back-url');
locationBackUrl.setBackUrl.mockImplementation(() => jest.fn());

describe('<DetailsCard />', () => {
  describe('render: ', () => {
    it('should match with snapshot', () => {
      const props = {
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
        isSearchDataLoaded: true,
        searchData: {
          user_tag: {
            label_id: null,
            system_tag: null,
            name: null,
            severity: 0,
            alert: null,
            type: null,
            id: null,
            description: null,
          },
          predicted_tag: {
            label_id: null,
            system_tag: true,
            name: 'Benign',
            severity: 0,
            alert: false,
            type: 'N',
            id: 'ebdad7ea-efa1-4c54-8c71-eff30b7aa4e1',
            description: 'System Benign tag',
          },
          ts: 'Sat, 23 Jun 2018 09:03:00 -0000',
          http_std_bytes_sent: null,
        },
      };
      const wrapper = mountWithIntl(<DetailsCard {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
