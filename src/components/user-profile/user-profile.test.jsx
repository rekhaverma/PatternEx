import React from 'react';
import sinon from 'sinon';


import { UserProfile } from './user-profile.component';

describe('<UserProfile />', () => {
  let wrapper;
  let props;
  const restartZeppelin = sinon.spy();

  beforeEach(() => {
    props = {
      icon: 'testIcon',
      privileges: {},
      type: 'user',
      setPopup: jest.fn(),
      className: 'testClass',
      restartZeppelin,
      updateLocation: jest.fn(),
    };
    wrapper = shallow(<UserProfile {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
