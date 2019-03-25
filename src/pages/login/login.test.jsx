import React from 'react';
import { fromJS } from 'immutable';
import { Login, mapStateToProps } from './index';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */

describe('<Login />', () => {
  describe('Component ', () => {
    it('should match with snapshot w/o loaded', () => {
      const props = {
        isAuthenticated: false,
        isLoading: true,
        updateLocation: jest.fn(),
        userLogin: jest.fn(),
      };
      const wrapper = shallow(<Login {...props} />);

      expect(wrapper).toMatchSnapshot();
    });

    it('should match with snapshot w loaded', () => {
      const props = {
        isAuthenticated: false,
        isLoading: true,
        updateLocation: jest.fn(),
        userLogin: jest.fn(),
      };
      const wrapper = shallow(<Login {...props} />);

      expect(wrapper).toMatchSnapshot();
    });

    it('should call updateLocation when componentWillReceiveProps', () => {
      const props = {
        isAuthenticated: true,
        isLoading: false,
        updateLocation: jest.fn(),
        userLogin: jest.fn(),
      };
      const wrapper = shallow(<Login {...props} />);
      wrapper.instance().componentWillReceiveProps(props);

      expect(props.updateLocation.mock.calls.length).toBe(1);
    });
  });

  describe('mapStateToProps: ', () => {
    it('should return the isLoggedOut false', () => {
      const initialState = {
        session: fromJS({
          isAuthenticated: true,
          isLoading: false
        }),
      };
      const expectedResponse = {
        isAuthenticated: true,
        isLoading: false,
      };
      expect(mapStateToProps(initialState)).toEqual(expectedResponse);
    });
  });
});
