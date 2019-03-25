import React from 'react';
import List from './list.component';
import moment from 'moment';

import {
  DETAILS_CARD,
  TOP3ANALYTICS_CARD,
  RELATED_SOURCE_IPS,
  RELATED_USERS,
  ANALYTICS,
  LABEL_HISTORY,
  DOMAIN_INFO,
  DOMAIN_INFO_SUBDOMAINS,
  DOMAIN_INFO_RESOLUTIONS,
  NX_DOMAINS,
  VULNERABILITY_REPORT,
} from './constants.jsx';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<List />', () => {
  it('should match with snapshot - no-data', () => {
    const props = {
      data: null,
      customClass: {},
      pipeline: '',
      columnFormat: [],
      tabData: [],
      handlers: {},
      startDate: moment.utc('2018-01-01').startOf('day'),
      endDate: moment.utc('2018-01-01').endOf('day'),
      behaviorType: '',
      type: '',
    };
    const wrapper = shallow(<List {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - DETAILS_CARD', () => {
    const props = {
      data: {
        predicted_prob_sum: 1,
        predicted_tag: 'test',
        ts: '2018-01-01',
      },
      customClass: {},
      pipeline: 'sip',
      columnFormat: [],
      tabData: [],
      handlers: {},
      startDate: moment.utc('2018-01-01').startOf('day'),
      endDate: moment.utc('2018-01-01').endOf('day'),
      behaviorType: 'malicious',
      type: DETAILS_CARD,
    };
    const wrapper = shallow(<List {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - TOP3ANALYTICS_CARD', () => {
    const props = {
      data: {
        predicted_prob_sum: 1,
        predicted_tag: 'test',
        ts: '2018-01-01',
        top_n_features: [
          'demo',
        ],
      },
      customClass: {},
      pipeline: 'sip',
      columnFormat: [
        {
          label: 'demo',
        }],
      tabData: [],
      handlers: {},
      startDate: moment.utc('2018-01-01').startOf('day'),
      endDate: moment.utc('2018-01-01').endOf('day'),
      behaviorType: 'malicious',
      type: TOP3ANALYTICS_CARD,
    };
    const wrapper = shallow(<List {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - DOMAIN_INFO', () => {
    const props = {
      data: {
        predicted_prob_sum: 1,
        predicted_tag: 'test',
        ts: '2018-01-01',
        top_n_features: [
          'demo',
        ],
      },
      customClass: {},
      pipeline: 'sip',
      columnFormat: [
        {
          label: 'demo',
        }],
      tabData: [],
      handlers: {},
      startDate: moment.utc('2018-01-01').startOf('day'),
      endDate: moment.utc('2018-01-01').endOf('day'),
      behaviorType: 'malicious',
      type: DOMAIN_INFO,
    };
    const wrapper = shallow(<List {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - NX_DOMAINS', () => {
    const props = {
      data: [
        {
          demo: 'demo',
        }],
      customClass: {},
      pipeline: 'sip',
      columnFormat: [
        {
          label: 'demo',
        }],
      tabData: [],
      handlers: {},
      startDate: moment.utc('2018-01-01').startOf('day'),
      endDate: moment.utc('2018-01-01').endOf('day'),
      behaviorType: 'malicious',
      type: NX_DOMAINS,
    };
    const wrapper = shallow(<List {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - DOMAIN_INFO_RESOLUTIONS', () => {
    const props = {
      data: [
        {
          demo: 'demo',
        }],
      customClass: {},
      pipeline: 'sip',
      columnFormat: [
        {
          label: 'demo',
        }],
      tabData: [],
      handlers: {},
      startDate: moment.utc('2018-01-01').startOf('day'),
      endDate: moment.utc('2018-01-01').endOf('day'),
      behaviorType: 'malicious',
      type: DOMAIN_INFO_RESOLUTIONS,
    };
    const wrapper = shallow(<List {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - LABEL_HISTORY', () => {
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
      customClass: {},
      pipeline: 'sip',
      columnFormat: [
        {
          label: 'demo',
        }],
      tabData: [],
      handlers: {},
      startDate: moment.utc('2018-01-01').startOf('day'),
      endDate: moment.utc('2018-01-03').endOf('day'),
      behaviorType: 'malicious',
      type: LABEL_HISTORY,
    };
    const wrapper = shallow(<List {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - DOMAIN_INFO_SUBDOMAINS', () => {
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
      customClass: {},
      pipeline: 'sip',
      columnFormat: [
        {
          label: 'demo',
        }],
      tabData: [],
      handlers: {},
      startDate: moment.utc('2018-01-01').startOf('day'),
      endDate: moment.utc('2018-01-03').endOf('day'),
      behaviorType: 'malicious',
      type: DOMAIN_INFO_SUBDOMAINS,
    };
    const wrapper = shallow(<List {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - RELATED_SOURCE_IPS', () => {
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
      customClass: {},
      pipeline: 'sip',
      columnFormat: [
        {
          label: 'demo',
        }],
      tabData: [],
      handlers: {},
      startDate: moment.utc('2018-01-01').startOf('day'),
      endDate: moment.utc('2018-01-03').endOf('day'),
      behaviorType: 'malicious',
      type: RELATED_SOURCE_IPS,
    };
    const wrapper = shallow(<List {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - RELATED_USERS', () => {
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
      customClass: {},
      pipeline: 'sip',
      columnFormat: [
        {
          label: 'demo',
        }],
      tabData: [],
      handlers: {},
      startDate: moment.utc('2018-01-01').startOf('day'),
      endDate: moment.utc('2018-01-03').endOf('day'),
      behaviorType: 'malicious',
      type: RELATED_USERS,
    };
    const wrapper = shallow(<List {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - ANALYTICS', () => {
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
      customClass: {},
      pipeline: 'sip',
      columnFormat: [
        {
          label: 'demo',
        }],
      tabData: ['predicted_prob_sum'],
      handlers: {},
      startDate: moment.utc('2018-01-01').startOf('day'),
      endDate: moment.utc('2018-01-03').endOf('day'),
      behaviorType: 'malicious',
      type: ANALYTICS,
    };
    const wrapper = shallow(<List {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - VULNERABILITY_REPORT', () => {
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
      customClass: {},
      pipeline: 'sip',
      columnFormat: [
        {
          label: 'demo',
        }],
      tabData: ['predicted_prob_sum'],
      handlers: {},
      startDate: moment.utc('2018-01-01').startOf('day'),
      endDate: moment.utc('2018-01-03').endOf('day'),
      behaviorType: 'malicious',
      type: VULNERABILITY_REPORT,
    };
    const wrapper = shallow(<List {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
