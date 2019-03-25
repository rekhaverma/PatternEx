import React from 'react';
import Header from './header.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Header />', () => {
  it('should match with snapshot with alerts and search', () => {
    const props = {
      activeBehaviorFilter: 'Header',
      alerts: {},
      hasAlerts: true,
      hasSearch: true,
      query: '',
      pathname: '',
      version: 'v1.1.1',
      withTooltip: true,
      privileges: {},
      searchCb: jest.fn(),
      setPopup: jest.fn(),
      setBehaviorFilter: jest.fn(),
      onLogoClick: jest.fn(),
    };
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot with alerts', () => {
    const props = {
      activeBehaviorFilter: 'Header',
      alerts: {},
      hasAlerts: true,
      hasSearch: false,
      query: '',
      pathname: '',
      version: 'v1.1.1',
      withTooltip: true,
      privileges: {},
      searchCb: jest.fn(),
      setPopup: jest.fn(),
      setBehaviorFilter: jest.fn(),
      onLogoClick: jest.fn(),
    };
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot with search', () => {
    const props = {
      activeBehaviorFilter: 'Header',
      alerts: {},
      hasAlerts: false,
      hasSearch: true,
      query: '',
      pathname: '',
      version: 'v1.1.1',
      withTooltip: true,
      privileges: {},
      searchCb: jest.fn(),
      setPopup: jest.fn(),
      setBehaviorFilter: jest.fn(),
      onLogoClick: jest.fn(),
    };
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onLogoClick when element is clicked', () => {
    const props = {
      activeBehaviorFilter: 'Header',
      alerts: {},
      hasAlerts: true,
      hasSearch: true,
      query: '',
      pathname: '',
      version: 'v1.1.1',
      withTooltip: true,
      privileges: {},
      searchCb: jest.fn(),
      setPopup: jest.fn(),
      setBehaviorFilter: jest.fn(),
      onLogoClick: jest.fn(),
    };
    const wrapper = shallow(<Header {...props} />);
    wrapper.find('img').simulate('click');
    expect(props.onLogoClick.mock.calls.length).toBe(1);
  });
});
