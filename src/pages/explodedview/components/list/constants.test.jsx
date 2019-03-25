import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import {
  detailsCardConfig,
  top3AnalyticsCardConfig,
  relatedSourceIPsCardConfig,
  relatedUsersCardConfig,
  analyticsConfig,
  labelsHistoryConfig,
  domainInfoSubdomains,
  domainInfoConfig,
  domainInfoResolution,
  orderByDate,
  vulnerabilityReportCardConfig,
} from './constants.jsx';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<List /> constants', () => {
  it('should return details card config', () => {
    const props = {
      data: {
        predicted_prob_sum: 1,
        predicted_tag: 'test',
        ts: '2018-01-01',
        srcip: '1.0.0.0',
      },
      pipeline: 'sip',
      behaviorType: 'malicious',
    };

    const expectedResponse = [
      { key: 'sip', name: 'Source IP', value: '1.0.0.0' },
      { key: 'behavior_type', name: 'Alert type', value: 'Malicious' },
      { key: 'predicted_tag.name', name: 'Alert category', value: <FormattedMessage id="evp.noDataLabel" values={{}} /> },
      { key: 'predicted_prob_sum', name: 'Attack probability', value: '1.00' },
      { key: 'score', name: 'Outlier score', value: 0 },
      { key: 'ts', name: 'Timestamp', value: '01-01-2018 12:00 AM' }];

    expect(detailsCardConfig(props.pipeline, props.data, props.behaviorType)).toEqual(expectedResponse);
  });
  it('should return top 3 analytics card config', () => {
    const props = {
      data: {
        predicted_prob_sum: 1,
        predicted_tag: 'test',
        ts: '2018-01-01',
        top_n_features: [
          'demo',
        ],
      },
      columnFormat: [
        {
          label: 'demo',
        }],
    };

    const expectedData = [
      {
        key: 'demo',
        name: 'demo',
        value: '',
      }];

    expect(top3AnalyticsCardConfig(props.data, props.columnFormat)).toEqual(expectedData);
  });
  it('should return domain info config', () => {
    const props = {
      data: {
        predicted_prob_sum: 1,
        predicted_tag: 'test',
        ts: '2018-01-01',
        top_n_features: [
          'demo',
        ],
      },
    };

    const expectedData = [
      { key: '', name: 'CDN Information', value: <FormattedMessage id="evp.noDataLabel" values={{}} /> },
      { key: 'comunity_tag', name: 'Comunity Tag', value: <FormattedMessage id="evp.noDataLabel" values={{}} /> },
      { key: 'domain_resolution', name: 'Domain Resolution', value: <FormattedMessage id="evp.noDataLabel" values={{}} /> },
      { key: 'subdomains', name: 'Subdomains', value: <FormattedMessage id="evp.noDataLabel" values={{}} /> },
    ];

    expect(domainInfoConfig(props.data)).toEqual(expectedData);
  });
  it('should return nx card config', () => {
    const props = {
      data: [
        {
          demo: 'demo',
        }],
    };
    const expectedData = [
      {
        key: { demo: 'demo' },
        name: { demo: 'demo' },
        value: '',
      }];

    expect(domainInfoSubdomains(props.data)).toEqual(expectedData);
  });
  it('should return domain info card', () => {
    const props = {
      data: [
        {
          ip_address: 'demo',
          last_resolved: '',
        }],
    };
    const expectedData = [
      {
        key: 'demo',
        name: 'demo',
        value: '',
      }];

    expect(domainInfoResolution(props.data)).toEqual(expectedData);
  });
  it('should return domain info card sorted', () => {
    const props = [
      {
        key: 'demo',
        name: 'demo',
        value: 1,
      },
      {
        key: 'demo1',
        name: 'demo1',
        value: 2,
      },
    ];
    const expectedData = [
      {
        key: 'demo1',
        name: 'demo1',
        value: 2,
      }, {
        key: 'demo',
        name: 'demo',
        value: 1,
      },
    ];

    expect(orderByDate(props, 'desc')).toEqual(expectedData);
  });
  it('should return label history card config', () => {
    const props = {
      data: [
        {
          name: 'demo',
          id: 1,
          predicted_prob_sum: 1,
          predicted_tag: 'test',
          ts: '2018-01-01',
          top_n_features: [
            'demo',
          ],
          create_time: '2018-01-02',
        }],
      startDate: moment.utc('2018-01-01').startOf('day'),
      endDate: moment.utc('2018-01-03').endOf('day'),
    };
    const expectedData = [
      {
        canBeDeleted: false,
        labelId: 1,
        name: 'demo',
        value: '01-02-2018',
      }];

    expect(labelsHistoryConfig(props.data, props.startDate, props.endDate)).toEqual(expectedData);
  });
  it('should return domain info subdomain config', () => {
    const props = {
      data: [
        {
          predicted_prob_sum: 1,
          predicted_tag: 'test',
          ts: '2018-01-01',
          top_n_features: [
            'demo',
          ],
          create_time: '2018-01-02',
        }],
    };
    const expectedData = [
      {
        key: {
          create_time: '2018-01-02',
          predicted_prob_sum: 1,
          predicted_tag: 'test',
          top_n_features: ['demo'],
          ts: '2018-01-01',
        },
        name: {
          create_time: '2018-01-02',
          predicted_prob_sum: 1,
          predicted_tag: 'test',
          top_n_features: ['demo'],
          ts: '2018-01-01',
        },
        value: '',
      }]
    ;

    expect(domainInfoSubdomains(props.data)).toEqual(expectedData);
  });
  it('should return related source ips config', () => {
    const props = {
      data: [
        {
          entity_name: '1.0.0.0',
        }],
    };
    const expectedData = [
      {
        key: '1.0.0.0',
        name: '1.0.0.0',
        value: '',
      }];

    expect(relatedSourceIPsCardConfig(props.data)).toEqual(expectedData);
  });
  it('should return related users config', () => {
    const props = {
      data: [
        {
          predicted_prob_sum: 1,
          predicted_tag: 'test',
          ts: '2018-01-01',
          top_n_features: [
            'demo',
          ],
          create_time: '2018-01-02',
        }],
    };
    const expectedData = [
      {
        key: '0',
        name: '0',
        value: '',
      }];

    expect(relatedUsersCardConfig(props.data)).toEqual(expectedData);
  });
  it('should return analytics config', () => {
    const props = {
      data: {
        predicted_prob_sum: 1,
        predicted_tag: 'test',
        ts: '2018-01-01',
        top_n_features: [
          'demo',
        ],
        create_time: '2018-01-02',
      },
      columnFormat: [
        {
          label: 'demo',
        }],
      tabData: ['predicted_prob_sum'],
    };
    const expectedData = [
      {
        key: 'predicted_prob_sum',
        name: 'predicted_prob_sum',
        value: '1.00',
      }];

    expect(analyticsConfig(props.data, props.columnFormat, props.tabData)).toEqual(expectedData);
  });
  it('should return vulnerability report config', () => {
    const props = {
      data: {
        entityType: 'entityType',
        dnsName: 'dnsName',
        netbios: 'netbios',
      },
    };
    const expectedData = [
      { key: 'entityTyoe', name: 'Entity type', value: 'entityType' },
      { key: 'dnsName', name: 'DNS Name', value: 'dnsName' },
      { key: 'netbios', name: 'Netbios Name', value: 'netbios' },
    ];

    expect(vulnerabilityReportCardConfig(props.data)).toEqual(expectedData);
  });
});