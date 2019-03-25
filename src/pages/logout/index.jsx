import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Loader from 'components/loader/loader-v2.component';
import { userLogout } from 'model/actions/session';
import { windowLocation } from 'lib/window-location';

import logo from 'public/images/logo.png';
import './logout.style.scss';

export class Logout extends React.PureComponent {
  componentWillMount() {
    this.props.userLogout();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedOut) {
      windowLocation.replace(`${windowLocation.origin()}/login`);
    }
  }
  /**
   * Update logout page when/if design will be provided
   */
  render() {
    return (
      <div className="logout">
        <div className="logout__container">
          <div className="logout__logo">
            <img src={logo} alt="patternex logo" />
          </div>
          <div className="logout__loader">
            <Loader />
          </div>
          <div className="logout__message">
            <FormattedMessage id="logout.message" />
          </div>
        </div>
      </div>
    );
  }
}

Logout.propTypes = {
  isLoggedOut: PropTypes.bool.isRequired,
  userLogout: PropTypes.func.isRequired,
};

Logout.defaultProps = {
  isLoggedOut: false,
  userLogout: () => { },
};

export const mapStateToProps = state => ({
  isLoggedOut: state.session.toJS().isLoggedOut,
});

export const mapDispatchToProps = dispatch => ({
  userLogout: (...args) => dispatch(userLogout(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
