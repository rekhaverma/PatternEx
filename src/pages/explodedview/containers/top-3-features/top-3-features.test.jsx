import React from 'react';

import { Top3FeaturesCard } from './top-3-features.container';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Top3FeaturesCard />', () => {
  describe('render: ', () => {
    it('should match with snapshot', () => {
      const props = {
        isColumnFormatDataLoaded: true,
        columnFormat: [
          {
            type: 'int',
            isFeature: true,
            displayName: 'Number of connections with empty packets sent',
            name: 'src_ip_30_count_sent_bytes_e_packets_gt',
            description: 'Number of connections originated from this IP in which this IP sent packets with empty payloads',
          },
          {
            type: 'float',
            isFeature: true,
            displayName: 'Average number of packets sent per connection',
            name: 'src_ip_21_avg_packets_sent',
            description: 'Average of the packets sent in the connections originated from this IP.',
          },
        ],
        location: {
          end_time: '06-25-2018',
          entity_name: '76.96.107.13',
          mode: 'batch',
          model_name: '2017-12-28-Classifier-Sip-1',
          model_type: 'classifier',
          origin: 'pipeline',
          pipeline: 'sip',
          start_time: '05-26-2018',
        },
        isSearchDataLoaded: true,
        searchData: {
          tor_distinct_sld_count: 0,
          src_ip_15_avg_packets: 2,
          src_ip_30_count_sent_bytes_e_packets_gt: 0,
          src_ip_54_count_low: 0,
          src_ip_21_avg_packets_sent: 1,
        },
      };
      const wrapper = shallow(<Top3FeaturesCard {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
