import React from 'react';

import { RelatedSourceIP } from './related-source-ip-card.container';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<RelatedSourceIP />', () => {
  describe('render: ', () => {
    it('should match with snapshot', () => {
      const props = {
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
        isRelatedEntitiesDataLoaded: true,
        relatedEntitiesData: {
          related_type: 'ip',
          totalCount: 1,
          href: '/api/v0.2/relatedentity',
          geo_location: { 'country_iso_code': 'US', 'city': null, 'latitude': 37.751, 'longitude': -97.822, 'country': 'United States' },
          entity_name: '76.96.107.13',
          entity_type: 'ip',
          items: [
            {
              related_source: 'dstips',
              details: { 'country_iso_code': 'US', 'city': 'San Jose', 'latitude': 37.3061, 'longitude': -122.002, 'country': 'United States' },
              entity_name: '158.140.2.40',
              entity_type: 'ip',
            }],
          country_iso_code_dict: { 'US': 6 },
        },
      };
      const wrapper = shallow(<RelatedSourceIP {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
