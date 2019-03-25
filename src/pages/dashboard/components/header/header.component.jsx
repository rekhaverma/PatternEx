import React from 'react';
import PropTypes from 'prop-types';

import UserProfile from 'components/user-profile';
import { updateSystemInfo } from 'model/actions';
import { FormattedMessage } from 'react-intl';

import { connect } from 'react-redux';
import logo from 'public/images/logo.png';

import './header.style.scss';
import './userProfileV2.style.scss';

const Header = ({ ...props }) => (
  <div className={props.pathName === '/dashboard' ? 'header header-rf' : 'header'}>
    <img
      src={logo}
      alt="PatternEx"
      style={{ 'width': 107, 'height': 27 }}
      onClick={props.onLogoClick}
    />
    { props.children }

    {props.pathName === '/dashboard' ?
      <div className="rt-container">
        <span className="control-label"><FormattedMessage id="header.refresh" /></span>
        <div className="rt-controller">
          <input
            type="radio"
            name="rtSwitch"
            id="rtSwitchOn"
            value="on"
            defaultChecked={props.isRefreshEnabled ? 'checked' : ''}
            onClick={() => props.updateSystemInfo(props.customerId, {
              is_refresh_enable: true,
            })}
          />
          <label className="radio" htmlFor="rtSwitchOn" >
            ON
          </label>
          <div className="refresh-section" >
            <div className="line" />
            <span className="icon-refresh" onClick={props.refreshDashboard} />
            <div className="line2" />
          </div>
          <input
            type="radio"
            name="rtSwitch"
            id="rtSwitchOff"
            value="off"
            defaultChecked={props.isRefreshEnabled ? 'checked' : ''}
            onClick={() => props.updateSystemInfo(props.customerId, {
              is_refresh_enable: false,
            })}
          />
          <label className="radio" htmlFor="rtSwitchOff" >
            OFF
          </label>
        </div>
      </div> : ''}
    <UserProfile
      type="configuration"
      icon="icon-gear"
      privileges={props.privileges}
      setPopup={props.setPopup}
    />
    <UserProfile
      setPopup={props.setPopup}
      className="userProfileV2"
      privileges={props.privileges}
    />
  </div>
);

Header.displayName = 'Header';
Header.propTypes = {
  'user': PropTypes.string,
  'children': PropTypes.any.isRequired,
  'setPopup': PropTypes.func,
  'privileges': PropTypes.object.isRequired,
  'onLogoClick': PropTypes.func.isRequired,
  'updateSystemInfo': PropTypes.func.isRequired,
  'refreshDashboard': PropTypes.func.isRequired,
  'pathName': PropTypes.string.isRequired,
  'customerId': PropTypes.string,
  'isRefreshEnabled': PropTypes.bool.isRequired,
};
Header.defaultProps = {
  'user': '',
  'setPopup': () => null,
  'pathName': '',
  'customerId': '',
};

const mapStateToProps = state => ({
  'updateSysteminfoStatus': state.data.settings.toJS().updateSysteminfo,
});
const mapDispatchToProps = dispatch => ({
  'updateSystemInfo': (...args) => dispatch(updateSystemInfo(...args)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
