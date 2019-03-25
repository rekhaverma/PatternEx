import React from 'react';
import sinon from 'sinon';
import { fromJS } from 'immutable';

import { AmbariStatus, mapStateToProps } from './ambari-status.container';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<AmbariStatus />', () => {
  describe('render: ', () => {
    it('should match with snapshot', () => {
      const props = {
        statuses: [
          {
            name: 'HDFS',
            state: 'STARTED',
            order: 1,
            running: '',
          }],
        getAmbariStatus: jest.fn(),
      };
      const wrapper = shallow(<AmbariStatus {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mapStateToProps: ', () => {
    it('should return the last statuses', () => {
      const initialState = {
        app: {
          ui: fromJS({
            ambariStatus: {
              HDFS: {
                state: 'STARTED',
                components: {
                  NAMENODE: 'STARTED',
                  DATANODE: 'STARTED',
                },
                running: true,
              },
            },
          }),
        },
      };
      const expectedResponse = [
        {
          name: 'HDFS',
          order: 3,
          state: 'STARTED',
          running: true,
        }];
      expect(mapStateToProps(initialState).statuses).toEqual(expectedResponse);
    });
  });

  describe('actions: ', () => {
    it('should dispatch "getAmbariStatus" on componentDidMount lifecycle', () => {
      const spy = sinon.spy();
      const props = {
        statuses: [],
        getAmbariStatus: spy,
      };
      shallow(<AmbariStatus {...props} />);

      expect(spy.callCount).toEqual(1);
    });
  });
});
