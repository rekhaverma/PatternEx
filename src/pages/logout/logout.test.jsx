import React from 'react';
import { fromJS } from 'immutable';
import { Logout, mapStateToProps } from './index';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */

jest.mock('lib/window-location', () => ({
  windowLocation: {
    origin: () => '',
    replace: jest.fn,
  },
}));

describe('<Logout />', () => {
  describe('Component ', () => {
    it('should match with snapshot', () => {
      const props = {
        isLoggedOut: false,
        userLogout: jest.fn(),
      };
      const wrapper = shallow(<Logout {...props} />);

      expect(wrapper).toMatchSnapshot();
    });

    it('should call userLogout when componentWillMount', () => {
      const props = {
        isLoggedOut: false,
        userLogout: jest.fn(),
      };
      shallow(<Logout {...props} />);

      expect(props.userLogout.mock.calls.length).toBe(1);
    });
  });

  describe('mapStateToProps: ', () => {
    it('should return the isLoggedOut false', () => {
      const initialState = {
        session: fromJS({
          isLoggedOut: false,
        }),
      };
      const expectedResponse = {
        isLoggedOut: false,
      };
      expect(mapStateToProps(initialState)).toEqual(expectedResponse);
    });
  });
});
