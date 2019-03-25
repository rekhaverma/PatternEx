import React from 'react';
import sinon from 'sinon';
import { fromJS } from 'immutable';

import { AnalyticsLogs, mapStateToProps } from './analytics-logs.container';
import { ANALYTICS } from '../../config';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<AnalyticsLogs />', () => {
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
        defaultSubView: ANALYTICS,
        pipeline: 'sip',
        searchData: [],
        columnFormat: [
          {
            description: 'Number of bytes sent in the connections between this (source IP, destination IP) pair.',
            displayName: 'Number of bytes sent',
            isFeature: true,
            name: 'tot_bytes_sent',
            type: 'float',
          }],
        className: 'analytics-logs',
        modelType: '',
        customerName: 'admin',
        isSearchDataLoaded: true,
        isColumnFormatDataLoaded: true,
        logsData: {
          DNS: [],
          EDR: [],
          'FW/PROXY': [],
        },
        historicalData: [
          {
            avg_bytes_received_icmp_connections: 596.575,
            avg_bytes_sent: 597.8,
            avg_bytes_sent_1h: 3981.25,
            avg_bytes_sent_icmp_connections: 597.8,
            avg_bytes_tot: 1194.375,
            avg_duration: 0,
            avg_interval: 4.784810126582278,
            avg_packet_received_size_icmp_connections: 98,
            avg_packet_sent_size_icmp_connections: 98,
            avg_packets_sent_icmp_connections: 6.1,
            avg_pkts_rcv: 6.0875,
            avg_pkts_sent: 6.1,
            avg_pkts_tot: 12.1875,
            avg_sessions_hr: 3.3333333333333335,
            class_probabilities_map: null,
            count_allowed: 0,
            count_blocked: 0,
            count_blocked_url: 0,
            count_bytes_sent_1h_gt_100m: 1,
            count_confirmed: 0,
          }],
        isHistoricalDataLoaded: true,
        getHistoricalData: jest.fn(),
        getLogsFWProxy: jest.fn(),
        getLogsDNS: jest.fn(),
        getLogsEDR: jest.fn(),
      };
      const wrapper = mountWithIntl(<AnalyticsLogs {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mapStateToProps: ', () => {
    it('should return props from state', () => {
      const initialState = {
        raw: fromJS({
          systemInfo: {
            customer_name: 'admin',
          },
        }),
      };
      const expectedResponse = { customerName: 'admin' };
      expect(mapStateToProps(initialState)).toEqual(expectedResponse);
    });
  });

  describe('actions: ', () => {
    it('should dispatch "getHistoricalData" on componentDidMount lifecycle', () => {
      const spy = sinon.spy();
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
        defaultSubView: ANALYTICS,
        pipeline: 'sip',
        searchData: [],
        columnFormat: [
          {
            description: 'Number of bytes sent in the connections between this (source IP, destination IP) pair.',
            displayName: 'Number of bytes sent',
            isFeature: true,
            name: 'tot_bytes_sent',
            type: 'float',
          }],
        className: 'analytics-logs',
        modelType: '',
        customerName: 'admin',
        isSearchDataLoaded: true,
        isColumnFormatDataLoaded: true,
        logsData: {
          DNS: [],
          EDR: [],
          'FW/PROXY': [],
        },
        historicalData: [
          {
            avg_bytes_received_icmp_connections: 596.575,
            avg_bytes_sent: 597.8,
            avg_bytes_sent_1h: 3981.25,
            avg_bytes_sent_icmp_connections: 597.8,
            avg_bytes_tot: 1194.375,
            avg_duration: 0,
            avg_interval: 4.784810126582278,
            avg_packet_received_size_icmp_connections: 98,
            avg_packet_sent_size_icmp_connections: 98,
            avg_packets_sent_icmp_connections: 6.1,
            avg_pkts_rcv: 6.0875,
            avg_pkts_sent: 6.1,
            avg_pkts_tot: 12.1875,
            avg_sessions_hr: 3.3333333333333335,
            class_probabilities_map: null,
            count_allowed: 0,
            count_blocked: 0,
            count_blocked_url: 0,
            count_bytes_sent_1h_gt_100m: 1,
            count_confirmed: 0,
          }],
        isHistoricalDataLoaded: true,
        getHistoricalData: spy,
        getLogsFWProxy: jest.fn(),
        getLogsDNS: jest.fn(),
        getLogsEDR: jest.fn(),
      };
      mountWithIntl(<AnalyticsLogs {...props} />);

      expect(spy.callCount).toEqual(1);
    });
  });
});
