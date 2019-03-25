import React from 'react';

import { ExternalEnrichmentCard } from './external-enrichment.container';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<ExternalEnrichmentCard />', () => {
  beforeEach(() => {
    global.localStorage = jest.fn();
    global.localStorage.setItem = jest.fn();
    global.localStorage.getItem = jest.fn();
  });

  describe('render: ', () => {
    beforeEach(() => {
      global.localStorage = jest.fn();
      global.localStorage.setItem = jest.fn();
      global.localStorage.getItem = jest.fn();
    });

    it('should match with snapshot', () => {
      const props = {
        isExternalEnrichmentDataLoaded: true,
        externalEnrichmentData: [
          {
            dip: 'No dip',
            asn_id: 'AS36492',
            asn_provider: 'GOOGLEWIFI - Google, LLC, US',
            location: 'US',
          }],
      };
      const wrapper = mountWithIntl(<ExternalEnrichmentCard {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
