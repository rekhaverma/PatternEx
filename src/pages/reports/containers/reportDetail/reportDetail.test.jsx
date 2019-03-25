import React from 'react';
import { ReportDetail } from './reportDetail.jsx';

Date.now = jest.fn(() => 1487076708000);
jest.mock('components/date-range', () => () => (
  <div id="mock">
    mock
  </div>
));
describe('<ReportDetail /> modal: ', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      'updateLocation': jest.fn(),
      'fetchReportResults': jest.fn(),
      'fetchColumnFormat': jest.fn(),
      'fetchReportSummary': jest.fn(),
      'reportDetail': {},
      'reportResultsCSVUrl': '',
      'fetchReportResultsCSV': jest.fn(),
      'rules': [],
      'availableDates': [],
      'listingData': {
        'columns': [],
        'items': [],
      },
      'handleExplodedView': jest.fn(),
      'location': {
        'query': {
          'reportId': 'laksdfjokdsf0832lsdk',
          'pipeline': 'sip_byday',
          'startTime': '1487076708',
          'endTime': '1487076708',
        },
      },
      'getReportById': jest.fn(),
      'isLoading': false,
      'router': {
        'push': jest.fn(),
      },
      'fetchRules': jest.fn(),
      'reportSummaryCompleted': false,
      'reportResultsCompleted': false,
      'reportResultsCsvCompleted': false,
      'totalDataCount': 0,
      'goBackUrl': jest.fn(),
      'onDemandPost': jest.fn(),
      'resetDownloadCSV': jest.fn(),
    };
    wrapper = mount(<ReportDetail {...props} />);
  });
  describe('render: ', () => {
    it('should match with snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
