import React from 'react';

import { DomainInfoCard } from './domain-info-card.container';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<DomainInfoCard />', () => {
  describe('render: ', () => {
    it('should match with snapshot', () => {
      const props = {
        isDomainInfoDataLoaded: true,
        domainInfoData: {
          cdn_info: 'Amazon Cloudfront',
          geo_location: { 'address': 'P.O. Box 8102', 'city': 'Reno', 'country': 'US', 'state': 'NV', 'zipcode': '89507' },
          community_tag: 'not malicious',
          resolutions: [
            {
              ip_address: '205.251.242.54',
              last_resolved: '2013-08-27',
            },
            {
              ip_address: '72.21.215.232',
              last_resolved: '2014-10-24',
            },
          ],
          registrar: 'MarkMonitor, Inc.',
          subdomains: ['gru-orca.amazon.com', 'vdp.amazon.com'],
          community_votes: 1,
          registration_date: '1994-11-01 05:00:00',
          expiration_date: '2022-10-31 04:00:00',
        },
      };
      const wrapper = mountWithIntl(<DomainInfoCard {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
