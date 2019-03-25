import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';

import { windowLocation } from 'lib/window-location';
import { checkIfUserIsLoggedIn } from 'model/actions/session';
import { defaultRoute } from 'config';
import Notification from 'containers/notification';
import Loader from 'components/loader/loader-v2.component';

export class Root extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      sessionCheck: false,
    };
  }

  componentWillMount() {
    this.props.checkIfUserIsLoggedIn();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sessionCheck.accessCheck !== this.props.sessionCheck.accessCheck) {
      if (nextProps.sessionCheck.isAuthenticated) {
        if (nextProps.location.pathname === '/login' || nextProps.location.pathname === '/') {
          this.props.updateLocation(defaultRoute);
        }
      } else if (nextProps.location.pathname !== '/login') {
        windowLocation.replace('/login');
      }

      this.setState({
        sessionCheck: true,
      });
    }
  }

  render() {
    return (
      <div className="root">
        {!this.state.sessionCheck && <Loader />}
        {this.state.sessionCheck && this.props.children}
        <div className="notifications-wrapper">
          {
            this.props.notifications.map((notification, i) => (
              <Notification
                key={`notification${i}`}
                id={notification.id}
                type={notification.type}
                content={notification.content}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

Root.displayName = 'Root';
Root.propTypes = {
  location: PropTypes.object,
  sessionCheck: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  checkIfUserIsLoggedIn: PropTypes.func.isRequired,
  updateLocation: PropTypes.func.isRequired,
  notifications: PropTypes.array,
};
Root.defaultProps = {
  location: {},
  notifications: [],
};

export const mapStateToProps = state => ({
  sessionCheck: state.session.toJS().sessionCheck,
  notifications: state.app.ui.toJS().notifications,
});

const mapDispatchToProps = dispatch => ({
  updateLocation: location => dispatch(routerActions.push(location)),
  checkIfUserIsLoggedIn: (...args) => dispatch(checkIfUserIsLoggedIn(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
