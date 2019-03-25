import { fromJS } from 'immutable';
import {
  getVulnerabilityReportCardData,
  externalEnrichmentSelector,
} from './explodedview.selectors';

/**
 * @status: WIP
 * @sign-off-by: Alex Andries
 */
const initialState = {
  raw: fromJS({
    explodedView: {
      vulnerabilityReport: [],
      entityInfo: {
        domain_info: {
          cdn_info: 'Amazon Cloudfront',
          geo_location: {
            address: 'P.O. Box 8102',
            city: 'Reno',
            country: 'US',
            state: 'NV',
            zipcode: '89507',
          },
          community_tag: 'not malicious',

          registrar: 'MarkMonitor, Inc.',
          community_votes: 1,
          registration_date: '1994-11-01 05:00:00',
          expiration_date: '2022-10-31 04:00:00',
        },
        ip_address_info: {
          asn: {
            number: 'AS36492',
            asn_provider: 'GOOGLEWIFI - Google, LLC, US',
          },
          geo_location: {
            country_iso_code: 'US',
            city: null,
            latitude: 37.751,
            longitude: -97.822,
            country: 'United States',
          },
        },
      },
    },
  }),
};

describe('Exploded Views selectors', () => {
  it('should return vulnerability report data', () => {
    const expected = {
      'dnsName': 'No data available',
      'entityType': 'No data available',
      'netbios': 'No data available',
    };

    expect(getVulnerabilityReportCardData(initialState)).toEqual(expected);
  });

  it('should return external enrichment data', () => {
    const expected = [
      {
        'asn_id': 'AS36492',
        'asn_provider': 'GOOGLEWIFI - Google, LLC, US',
        'dip': 'No dip',
        'location': 'US',
      },
    ];

    expect(externalEnrichmentSelector(initialState)).toEqual(expected);
  });
});