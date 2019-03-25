import { fromJS } from 'immutable';
import { dateFormats } from 'config';
import moment from 'moment';
import {
  formatReports,
  filterReport,
  sortByDate,
  createColumnDictionary,
  checkColumnDictionaryForField,
  formatReportResults,
  filterRulesToShow,
  getAvailableDates,
  getReportDetailTableColumns,
  handleListingData,
  getFormattedChartData,
} from './reports.selectors';

const reportsData = [{
  'update_time': 'Tue, 07 Aug 2018 04:33:11 -0000',
  'pipeline': 'sip_byday',
  'href': '/api/v0.2/reports/a3f2f4ad-25b3-40d9-8d89-1a6e986f75bc',
  'create_time': 'Tue, 07 Aug 2018 04:33:11 -0000',
  'name': 'demo-batch',
  'rules': [
    '445ecdb7-e685-4a19-a272-a6fa497d53ff',
  ],
  'enable': true,
  'id': 'a3f2f4ad-25b3-40d9-8d89-1a6e986f75bc',
}];

const column = {
  'type': 'int',
  'isFeature': true,
  'displayName': 'Number of connections with empty packets sent',
  'name': 'src_ip_30_count_sent_bytes_e_packets_gt',
  'description': 'Number of connections originated from this IP in which this IP sent packets with empty payloads',
};

const initialState = {
  data: {
    reports: fromJS({
      reports: reportsData,
      reportSummaryQuarterlyData: {
        items: [{
          'total_count': 27217,
          'map_rule_id': null,
          'id': null,
          'map_predicted_tag_id': null,
          'ts': 'Mon, 04 Jun 2018 00:00:00 -0000',
        }],
      },
      reportSummary: {
        items: [{
          'total_count': 27217,
          'map_rule_id': null,
          'id': null,
          'map_predicted_tag_id': null,
          'ts': 'Mon, 04 Jun 2018 00:00:00 -0000',
        }],
      },
      reportResults: {
        'display_cols': ['src_ip_30_count_sent_bytes_e_packets_gt'],
        'items': [
          {
            'src_ip_30_count_sent_bytes_e_packets_gt': '1',
            'day_ts': 'Tue, 07 Aug 2018 04:33:11 -0000',
          },
          {
            'src_ip_30_count_sent_bytes_e_packets_gt': '2',
            'minute_ts': 'Tue, 07 Aug 2018 04:33:11 -0000',
          },
        ],
      },
    }),
  },
  raw: fromJS({
    'columnFormat': {
      'items': [column],
      'pipeline': 'sip',
      'href': '/api/v0.2/sip/columnformat',
    },
  }),
};

describe('Reports selectors: ', () => {
  it('should format reports', () => {
    const expected = [{
      'update_time_original': 'Tue, 07 Aug 2018 04:33:11 -0000',
      'href': '/api/v0.2/reports/a3f2f4ad-25b3-40d9-8d89-1a6e986f75bc',
      'create_time': 'Tue, 07 Aug 2018 04:33:11 -0000',
      'name': 'demo-batch',
      'rules': [
        '445ecdb7-e685-4a19-a272-a6fa497d53ff',
      ],
      'enable': true,
      'id': 'a3f2f4ad-25b3-40d9-8d89-1a6e986f75bc',
      'pipeline_original': 'sip_byday',
      'pipeline': 'Source IP',
      'update_time': 1533616391,
    }];

    expect(formatReports(initialState)).toEqual(expected);
  });

  it('should filter report', () => {
    const params = {
      rawReports: reportsData,
      inputValue: 'demo',
    };
    const expected = reportsData;
    expect(filterReport(params)).toEqual(expected);
  });

  it('should sort the array on the basis of date', () => {
    const stackedBarChartData = [{
      'Exploit': 0,
      'CC Fraud': 0,
      'Command and Control': 0,
      'Exfiltration': 0,
      'Credential Access': 0,
      'Lateral Movement': 0,
      'TOS Abuse': 0,
      'ATO': 0,
      'HPA': 0,
      'Discovery': 0,
      'Delivery': 0,
      'Reconnaissance': 0,
      'Denial of Service': 0,
      'name': '06/04/18',
    }];
    const params = {
      'dataSet': stackedBarChartData,
      'field': 'name',
      'dateFormat': dateFormats.mmddyySlash,
    };
    const expected = stackedBarChartData;

    expect(sortByDate(params)).toEqual(expected);
  });

  it('should create column dictionary', () => {
    const params = {
      columns: {
        'items': [column],
        'pipeline': 'sip',
        'href': '/api/v0.2/sip/columnformat',
      },
      complete: true,
    };
    const expected = {
      src_ip_30_count_sent_bytes_e_packets_gt: column,
    };

    expect(createColumnDictionary(params)).toEqual(expected);
  });

  it('should check column dictionary for field', () => {
    const params = {
      'columnDictionary': {
        src_ip_30_count_sent_bytes_e_packets_gt: column,
      },
      'field': 'src_ip_30_count_sent_bytes_e_packets_gt',
      'returnField': 'displayName',
    };
    const expected = 'Number of connections with empty packets sent';
    expect(checkColumnDictionaryForField(params)).toEqual(expected);
  });

  it('should format report results', () => {
    const params = {
      items: [
        {
          'src_ip_30_count_sent_bytes_e_packets_gt': '1',
          'day_ts': 'Tue, 07 Aug 2018 04:33:11 -0000',
        },
        {
          'src_ip_30_count_sent_bytes_e_packets_gt': '1',
          'minute_ts': 'Tue, 07 Aug 2018 04:33:11 -0000',
        },
      ],
    };
    const expected = [
      {
        'src_ip_30_count_sent_bytes_e_packets_gt': '1',
        'day_ts': 'Tue, 07 Aug 2018 04:33:11 -0000',
        'day_ts_original': 'Tue, 07 Aug 2018 04:33:11 -0000',
        'ts': '1533616391',
      },
      {
        'src_ip_30_count_sent_bytes_e_packets_gt': '1',
        'minute_ts': 'Tue, 07 Aug 2018 04:33:11 -0000',
        'minute_ts_original': 'Tue, 07 Aug 2018 04:33:11 -0000',
        'ts': '1533616391',
      },
    ];

    expect(formatReportResults(params)).toEqual(expected);
  });

  it('should filter rules based on selected rules', () => {
    const params = {
      allRules: [
        {
          'pipeline': 'sip',
          'name': 'ondemand-gt-64',
          'update_time': 'Tue, 07 Aug 2018 03:37:41 -0000',
          'create_time': 'Tue, 07 Aug 2018 03:37:41 -0000',
          'id': 'acde57e2-2c3d-4d2d-bd40-ca06385d332f',
          'label': 'ondemand-gt-64',
          'value': 'acde57e2-2c3d-4d2d-bd40-ca06385d332f',
        },
        {
          'pipeline': 'sip',
          'name': 'ond-gt-310',
          'update_time': 'Tue, 07 Aug 2018 03:40:28 -0000',
          'create_time': 'Tue, 07 Aug 2018 03:40:28 -0000',
          'id': '445ecdb7-e685-4a19-a272-a6fa497d53ff',
          'label': 'ond-gt-310',
          'value': '445ecdb7-e685-4a19-a272-a6fa497d53ff',
        },
      ],
      selectedRules: ['acde57e2-2c3d-4d2d-bd40-ca06385d332f'],
    };
    const expected = [{
      'pipeline': 'sip',
      'name': 'ondemand-gt-64',
      'update_time': 'Tue, 07 Aug 2018 03:37:41 -0000',
      'create_time': 'Tue, 07 Aug 2018 03:37:41 -0000',
      'id': 'acde57e2-2c3d-4d2d-bd40-ca06385d332f',
      'label': 'ondemand-gt-64',
      'value': 'acde57e2-2c3d-4d2d-bd40-ca06385d332f',
    }];

    expect(filterRulesToShow(params)).toEqual(expected);
  });

  it('should get all the dates that have data from report summary', () => {
    const expected = ['20180604'];
    expect(getAvailableDates(initialState)).toEqual(expected);
  });

  it('should return report detail table columns', () => {
    const params = {
      cols: ['src_ip_30_count_sent_bytes_e_packets_gt'],
      allColumns: {
        'src_ip_30_count_sent_bytes_e_packets_gt': column,
      },
    };
    const expected = [{
      'label': 'Number of connections with empty packets sent',
      'field': 'src_ip_30_count_sent_bytes_e_packets_gt',
      'isKey': true,
      'columnTitle': true,
    }];
    expect(getReportDetailTableColumns(params)).toEqual(expected);
  });

  it('should return report detail\'s listing data with items and columns', () => {
    const expected = {
      'columns': [{
        'label': 'Number of connections with empty packets sent',
        'field': 'src_ip_30_count_sent_bytes_e_packets_gt',
        'isKey': true,
        'columnTitle': true,
      }],
      'items': [
        {
          'src_ip_30_count_sent_bytes_e_packets_gt': '1',
          'day_ts': 'Tue, 07 Aug 2018 04:33:11 -0000',
          'day_ts_original': 'Tue, 07 Aug 2018 04:33:11 -0000',
          'ts': '1533616391',
        },
        {
          'src_ip_30_count_sent_bytes_e_packets_gt': '2',
          'minute_ts': 'Tue, 07 Aug 2018 04:33:11 -0000',
          'minute_ts_original': 'Tue, 07 Aug 2018 04:33:11 -0000',
          'ts': '1533616391',
        },
      ],
    };
    expect(handleListingData(initialState)).toEqual(expected);
  });

  it('should format report\'s chart data', () => {
    const params = {
      'allTags': {
        '5e799858-23f9-4073-9531-5552b6c65df7': {
          'update_time': 'Fri, 01 Jul 2016 00:00:00 -0000',
          'description': 'A malicious payload sent to an user (e.g., by e-mail or Web) or system.',
          'alert': 'True',
          'href': '/api/v0.2/tags/5e799858-23f9-4073-9531-5552b6c65df7',
          'id': '5e799858-23f9-4073-9531-5552b6c65df7',
          'severity': 4,
          'labels_count': 1,
          'name': 'Delivery',
          'system_tag': true,
          'create_time': 'Fri, 01 Jul 2016 00:00:00 -0000',
          'type': 'M',
        },
      },
      'timeRange': {
        'endTime': moment.utc(1528113600, 'X'),
        'startTime': moment.utc(1528113600, 'X'),
      },
      'reportSummaryData': initialState.data.reports.toJS().reportSummary,
      'mode': 'batch',
    };
    const expected = {
      'barChartData': [{ name: '06/04/18', value: 27217, color: '#214742' }],
      'colorArr': [],
      'endTime': moment.utc(1528113600, 'X'),
      'pieChartData': [],
      'stackedBarChartData': [],
      'startTime': moment.utc(1528113600, 'X'),
      'tagList': [],
      'totalThreatsCount': 27217,
    };
    expect(getFormattedChartData(params)).toEqual(expected);
  });
});
