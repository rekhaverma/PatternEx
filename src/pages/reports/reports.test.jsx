import React from 'react';
import { fromJS } from 'immutable';
import sinon from 'sinon';
import { Reports, mapStateToProps } from './index';

describe('<Reports /> page', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      'reportsData': [],
      'isLoading': false,
      'pipelines': [],
      'fetchReports': jest.fn(),
      'fetchRules': jest.fn(),
      'rules': [],
      'createReport': jest.fn(),
      'deleteReportCall': jest.fn(),
      'updateReport': jest.fn(),
      'resetReportDetailData': jest.fn(),
      'router': {},
    };
    wrapper = shallow(<Reports {...props} />);
  });

  describe('render: ', () => {
    it('should match with snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mapStateToProps: ', () => {
    it('should return props ', () => {
      const initialState = {
        data: {
          reports: fromJS({
            'isLoading': [],
            'reports': [],
            'reportSummary': {},
            'reportDetail': {},
            'reportResults': {},
            'rules': [],
            'ruleDetail': {},
            'reportResultsCSVUrl': '',
            'reportSummaryQuarterlyData': {},
            'reportResultsCompleted': false,
            'reportResultsCsvCompleted': false,
            'reportSummaryCompleted': false,
          }),
          rules: fromJS({
            'isLoading': [],
            'rules': [],
            'ruleDetail': {},
            'ruleAction': '',
            'ruleError': '',
          }),
        },
        raw: fromJS({
          'pipelines': {},
        }),
      };
      const expectedData = {
        isLoading: false,
        reportsData: [],
        pipelines: [],
        rules: [],
      };
      expect(mapStateToProps(initialState)).toEqual(expectedData);
    });
  });

  describe('actions: ', () => {
    it('should dispatch "fetchReports" and "fetchRules" on componentDidMount', () => {
      const spy = sinon.spy();
      const props2 = {
        'reportsData': [],
        'isLoading': false,
        'pipelines': [],
        'fetchReports': spy,
        'fetchRules': spy,
        'rules': [],
        'createReport': jest.fn(),
        'deleteReportCall': jest.fn(),
        'updateReport': jest.fn(),
        'resetReportDetailData': jest.fn(),
        'router': {},
      };
      shallow(<Reports {...props2} />);
      expect(spy.callCount).toEqual(2);
    });
  });
});

