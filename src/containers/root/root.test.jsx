import React from 'react';
import sinon from 'sinon';
import { fromJS } from 'immutable';

import { Root, mapStateToProps } from './root.container';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Root />', () => {
  describe('render: ', () => {
    it('should match with snapshot - loader enabled', () => {
      const props = {
        location: {},
        sessionCheck: {},
        notifications: [],
        checkIfUserIsLoggedIn: jest.fn(),
        updateLocation: jest.fn(),
      };
      const wrapper = mount(<Root {...props} children={<div />} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('should match with snapshot - loader disabled', () => {
      const props = {
        location: {},
        sessionCheck: {},
        notifications: [],
        checkIfUserIsLoggedIn: jest.fn(),
        updateLocation: jest.fn(),
      };
      const wrapper = mount(<Root {...props} children={<div />} />);
      wrapper.instance().componentWillReceiveProps({
        ...props,
        sessionCheck: {
          accessCheck: true,
          isAuthenticated: true,
        },
      });
      expect(wrapper.update()).toMatchSnapshot();
    });
  });

  describe('mapStateToProps: ', () => {
    it('should return states', () => {
      const initialState = {
        session: fromJS({
          sessionCheck: {
            accessCheck: true,
            isAuthenticated: true,
          },
        }),
        app: {
          ui: fromJS({
            notifications: [],
          }),
        },
      };
      const expectedResponse = {
        notifications: [],
        sessionCheck: {
          accessCheck: true,
          isAuthenticated: true,
        },
      };
      expect(mapStateToProps(initialState)).toEqual(expectedResponse);
    });
  });

  describe('actions: ', () => {
    it('should dispatch "checkIfUserIsLoggedIn" on componentWillMount lifecycle', () => {
      const checkIfUserIsLoggedInSpy = sinon.spy();
      const props = {
        location: {},
        sessionCheck: {},
        notifications: [],
        checkIfUserIsLoggedIn: checkIfUserIsLoggedInSpy,
        updateLocation: jest.fn(),
      };
      shallow(<Root {...props} children={<div />}/>);

      expect(checkIfUserIsLoggedInSpy.callCount).toEqual(1);
    });
  });
});
