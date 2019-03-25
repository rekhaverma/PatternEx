import React from 'react';
import sinon from 'sinon';
import { fromJS } from 'immutable';

import { App, mapStateToProps } from './app.container';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<App />', () => {
  describe('render: ', () => {
    it('should match with snapshot', () => {
      const props = {
        children: <div />,
        location: {},
        privileges: {},
        systemInfo: {},
        changeLocation: jest.fn(),
        fetchTags: jest.fn(),
        fetchPipelines: jest.fn(),
        fetchSystemInfo: jest.fn(),
        fetchPrivileges: jest.fn(),
        updateTime: jest.fn(),
        fetchSuspiciousBehavior: jest.fn(),
        fetchMaliciousBehavior: jest.fn(),
        fetchBehaviorSummary: jest.fn(),
      };
      const wrapper = shallow(<App {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mapStateToProps: ', () => {
    it('should return states', () => {
      const initialState = {
        raw: fromJS({
          systemInfo: {
            customer_name: 'test',
            customer_id: 'test',
            version: '',
          },
          loadStatus: {
            isLoading: [],
          },
          privileges: [],
        }),
        app: {
          ui: fromJS({
            popup: '',
            notifications: [],
          }),
        },
        data: {
          settings: fromJS({
            updateSysteminfo: '',
          }),
        },
      };
      const expectedResponse = {
        customer_name: 'test',
        isLoading: false,
        notifications: [],
        popup: '',
        privileges: [],
        version: '',
        updateSysteminfo: '',
        customer_id: 'test',
        systemInfo: {
          customer_name: 'test',
          customer_id: 'test',
          version: '',
        },
      };
      expect(mapStateToProps(initialState)).toEqual(expectedResponse);
    });
  });

  describe('actions: ', () => {
    it('should dispatch "fetchPrivileges", "fetchTags" on componentDidMount lifecycle', () => {
      const fetchPrivilegesSpy = sinon.spy();
      const fetchTagsSpy = sinon.spy();
      const props = {
        children: <div />,
        location: {},
        privileges: {},
        systemInfo: {},
        changeLocation: jest.fn(),
        fetchPipelines: jest.fn(),
        fetchSystemInfo: jest.fn(),
        updateTime: jest.fn(),
        fetchSuspiciousBehavior: jest.fn(),
        fetchMaliciousBehavior: jest.fn(),
        fetchBehaviorSummary: jest.fn(),
        fetchTags: fetchTagsSpy,
        fetchPrivileges: fetchPrivilegesSpy,
      };
      shallow(<App {...props} />);

      expect(fetchPrivilegesSpy.callCount).toEqual(1);
      expect(fetchTagsSpy.callCount).toEqual(1);
    });
  });
});
