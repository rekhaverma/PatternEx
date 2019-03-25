import React from 'react';
import sinon from 'sinon';
import { fromJS } from 'immutable';

import { ExplodedView, mapStateToProps } from './index';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<ExplodedView /> Page', () => {
  beforeEach(() => {
    global.sessionStorage = jest.fn();
    global.sessionStorage.setItem = jest.fn();
    global.sessionStorage.getItem = jest.fn();
    global.sessionStorage.clear = jest.fn();
  });

  beforeEach(() => {
    global.localStorage = jest.fn();
    global.localStorage.setItem = jest.fn();
    global.localStorage.getItem = jest.fn();
  });

  describe('render: ', () => {
    it('should match with snapshot', () => {
      const props = {
        searchData: [],
        location: {
          query: {
            pipeline: '',
            method_name: '',
            entity_id: '',
            behavior_type: '',
            end_time: '07-27-2018',
            start_time: '07-27-2018',
          },
        },
        customerName: '',
        getRelatedEntitiesData: jest.fn(),
        getClusterRelations: jest.fn(),
        getEntityLabelHistory: jest.fn(),
        fetchColumnFormat: jest.fn(),
        getSearchData: jest.fn(),
        getEntityInfo: jest.fn(),
        getTenableReportData: jest.fn(),
        getNXDomains: jest.fn(),
        updateLocation: jest.fn(),
        tenableReportData: {},
        getDHCPData: jest.fn(),
      };
      const wrapper = shallow(<ExplodedView {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mapStateToProps: ', () => {
    it('should return props for non pipeline', () => {
      const initialState = {
        raw: fromJS({
          explodedView: {
            pipelineEntityData: [],
            searchData: [{ demo: 'demo' }],
            vulnerabilityReport: [],
          },
          systemInfo: {
            customer_name: 'customer_name',
          },
        }),
      };
      const expectedResponse = {
        'customerName': 'customer_name',
        'searchData': { 'demo': 'demo' },
        'tenableReportData': { 'dnsName': 'No data available', 'entityType': 'No data available', 'netbios': 'No data available' },
      };
      expect(mapStateToProps(initialState, { location: { query: { origin: '' } } })).toEqual(expectedResponse);
    });

    it('should return props for pipeline', () => {
      const initialState = {
        raw: fromJS({
          explodedView: {
            pipelineEntityData: [{ demo: 'demo' }],
            searchData: [],
            vulnerabilityReport: [],
          },
          systemInfo: {
            customer_name: 'customer_name',
          },
        }),
      };
      const expectedResponse = {
        'customerName': 'customer_name',
        'searchData': { 'demo': 'demo' },
        'tenableReportData': { 'dnsName': 'No data available', 'entityType': 'No data available', 'netbios': 'No data available' },
      };
      expect(mapStateToProps(initialState, { location: { query: { origin: 'pipeline' } } })).toEqual(expectedResponse);
    });
  });

  describe('actions: ', () => {
    it('should dispatch "getSearchData" on componentDidMount lifecycle', () => {
      const spy = sinon.spy();
      const props = {
        searchData: [],
        location: {
          query: {
            pipeline: '',
            method_name: '',
            entity_id: '',
            behavior_type: '',
            end_time: '2018-07-27',
            start_time: '2018-07-27',
          },
        },
        customerName: '',
        getRelatedEntitiesData: jest.fn(),
        getClusterRelations: jest.fn(),
        getEntityLabelHistory: jest.fn(),
        fetchColumnFormat: jest.fn(),
        getSearchData: spy,
        getEntityInfo: jest.fn(),
        getTenableReportData: jest.fn(),
        getNXDomains: jest.fn(),
        updateLocation: jest.fn(),
        tenableReportData: {},
        getDHCPData: jest.fn(),
      };
      shallow(<ExplodedView {...props} />);

      expect(spy.callCount).toEqual(1);
    });
  });
});
