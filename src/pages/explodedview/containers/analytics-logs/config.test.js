import React from 'react';

import { getBehaviour30daysTableData, getFWLogsTable } from './config';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<AnalyticsLogs /> config', () => {
  beforeEach(() => {
    global.localStorage = jest.fn();
    global.localStorage.getItem = jest.fn();
  });

  it('should return behaviour 30 days table data', () => {

    const props = {
      pipeline: 'sip',
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
          ts: 'Sat, 23 Jun 2018 00:00:00 -0000'
        }],
    };

    const expectedData = [
      {
        date: '06 - 23 - 2018',
        dstip: undefined,
        id: 'historicalTableRow__0',
        predicted_prob: undefined,
        predicted_tag: undefined,
        score: undefined,
        src_ip_01_distinct_dest_locations: undefined,
        src_ip_03_count_connections: undefined,
        src_ip_22_count_from_port_lt_1024: undefined,
        src_ip_31_counter_applications: undefined,
        src_ip_33_avg_interval: undefined,
        src_ip_34_avg_duration: undefined,
        src_ip_35_count_destination_ips: undefined,
        srcip: undefined,
        tot_bytes_received: undefined,
        tot_bytes_sent: undefined,
      }]
    ;

    expect(getBehaviour30daysTableData(props.historicalData, props.pipeline)).toEqual(expectedData);
  });

  it('should return fw logs data', () => {

    const props = {
      logsData: {
        DNS: [],
        EDR: [],
        'FW/PROXY': [],
      },
    };

    const expectedData = [];

    expect(getFWLogsTable(props.logsData['FW/PROXY'])).toEqual(expectedData);
  });

  it('should return edr logs data', () => {

    const props = {
      logsData: {
        DNS: [],
        EDR: [],
        'FW/PROXY': [],
      },
    };

    const expectedData = [];

    expect(getFWLogsTable(props.logsData.EDR)).toEqual(expectedData);
  });
});
