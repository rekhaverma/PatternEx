import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';

import {
  fetchTags,
  fetchSystemInfo,
  fetchPrivileges,
  fetchPipelines,
  updateTime,
} from 'model/actions';
import { fetchBehaviorSummary } from 'model/actions/dashboard';
import { fetchMaliciousBehavior } from 'model/actions/malicious';
import { fetchSuspiciousBehavior } from 'model/actions/suspicious';
import { getPrivileges } from 'model/selectors';
import { sidebarMenuItems, dateFormats } from 'config';
import SidebarMenu from 'components/sidebar-menu';
import Popup from 'components/popup';
import ChangePassword from 'components/change-password';
import Loader from 'components/loader/loader-v2.component';
import Notification from 'containers/notification';
import Settings from 'pages/settings';
import UploadFile from 'pages/upload-file';
import { Header } from 'pages/dashboard/components/header';
import { Footer } from 'pages/dashboard/components/footer';

import AmbariStatus from '../ambari-status';

export class App extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'popup': '',
    };

    this.setPopup = this.setPopup.bind(this);
    this.refreshDashboard = this.refreshDashboard.bind(this);
  }

  componentDidMount() {
    const { location } = this.props;
    const defaultStart = moment.utc().subtract(7, 'day');
    const defaultEnd = moment.utc();

    if (location.query
      && Object.keys(location.query).includes('start_time')
      && Object.keys(location.query).includes('end_time')) {
      this.props.updateTime(
        moment.utc(location.query.start_time, dateFormats.mmddyyDash),
        moment.utc(location.query.end_time, dateFormats.mmddyyDash),
      );
    } else {
      this.props.updateTime(
        moment.utc(defaultStart),
        moment.utc(defaultEnd),
      );
    }

    this.props.fetchSystemInfo();
    this.props.fetchPrivileges();
    this.props.fetchTags(true);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customer_name !== this.props.customer_name
      && nextProps.version !== '') {
      this.props.fetchPipelines();
    }

    const { location } = nextProps;
    const defaultStart = moment.utc().subtract(7, 'day');
    const defaultEnd = moment.utc();

    if (location.query
      && Object.keys(location.query).includes('start_time')
      && Object.keys(location.query).includes('end_time')) {
      nextProps.updateTime(
        moment.utc(location.query.start_time, 'MM-DD-YYYY'),
        moment.utc(location.query.end_time, 'MM-DD-YYYY'),
      );
    } else {
      nextProps.updateTime(
        moment.utc(defaultStart),
        moment.utc(defaultEnd),
      );
    }
    if (nextProps.updateSysteminfo !== this.props.updateSysteminfo && nextProps.updateSysteminfo === 'success') {
      this.props.fetchSystemInfo(true);
    }
  }

  setPopup(name) {
    this.setState({
      'popup': this.state.popup === name ? '' : name,
    });
  }

  getSidebarMenuWithPrivileges(items) {
    return items.map((item) => {
      const privilege = this.props.privileges[item.label.split(' ').join('')]; // remove space in order to map the labels
      if (privilege) {
        return Object.assign({ ...item }, { hasPrivileges: privilege.read });
      }
      if (item.items) {
        return Object.assign({ ...item }, { items: this.getSidebarMenuWithPrivileges(item.items) });
      }
      return Object.assign({ ...item }, { hasPrivileges: true });
    });
  }

  refreshDashboard() {
    const { location } = this.props;
    const momentUTC = moment.utc();

    const defaultStart = moment.utc().subtract(7, 'day');
    const defaultEnd = moment.utc();

    const startDate = location.query.start_time
      ? moment.utc(location.query.start_time, 'MM-DD-YYYY')
      : defaultStart;
    const endDate = location.query.end_time
      ? moment.utc(location.query.end_time, 'MM-DD-YYYY')
      : defaultEnd;

    if (endDate.isSame(momentUTC, 'day')) {
      this.props.fetchBehaviorSummary(startDate, endDate);
      this.props.fetchMaliciousBehavior(startDate.format('X'), endDate.format('X'), undefined, true);
      this.props.fetchSuspiciousBehavior(startDate.format('X'), endDate.format('X'), undefined, true);
    }
  }

  render() {
    const { systemInfo } = this.props;
    const refreshEnabled = systemInfo.login_config && systemInfo.login_config.is_refresh_enable;
    const isRefreshEnabled = refreshEnabled === undefined ? true : refreshEnabled;

    const paths = [
      '/performance',
      '/autocorrelation',
      '/models',
      '/behavior/malicious',
      '/behavior/suspicious',
      '/labels',
      '/reports',
      '/reportDetail',
      '/rules',
      '/resources',
      '/pipeline',
      '/log-manager',
    ];

    const noLoadingPaths = [
      '/dashboard',
      '/exploded-view',
      '/historical-behaviour-map',
      '/vulnerability-report',
    ];

    if (paths.includes(this.props.location.pathname)) {
      return (
        <div style={{ 'height': '100%' }}>
          {this.props.isLoading && <Loader />}
          <Header
            user={this.props.customer_name}
            customerId={this.props.customer_id}
            privileges={this.props.privileges}
            setPopup={this.setPopup}
            onLogoClick={() => this.props.changeLocation('/dashboard')}
            refreshDashboard={this.refreshDashboard}
            pathName={this.props.location.pathname}
            isRefreshEnabled={isRefreshEnabled}
          >
            <AmbariStatus />
          </Header>
          <div className="app">
            {this.props.customer_name && this.props.children}
            <Footer version={this.props.version} />
          </div>
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
          <SidebarMenu
            items={this.getSidebarMenuWithPrivileges(sidebarMenuItems)}
            query={this.props.location.query}
            privileges={this.props.privileges}
          />
          {this.props.popup !== '' && <Popup context={this.props.popup} version={2} />}
          {this.state.popup === 'changePwd' && (
            <ChangePassword onClose={this.setPopup} />
          )}
          {this.state.popup === 'settings' && (
            <Settings onClose={this.setPopup} />
          )}
          {
            this.state.popup === 'logSource' && (
              <UploadFile onClose={this.setPopup} />
          )}
        </div>
      );
    }

    // TODO: remove this when entire app will be loaded async
    if (noLoadingPaths.includes(this.props.location.pathname)) {
      return (
        <div style={{ 'height': '100%' }}>
          <Header
            user={this.props.customer_name}
            customerId={this.props.customer_id}
            privileges={this.props.privileges}
            setPopup={this.setPopup}
            onLogoClick={() => this.props.changeLocation('/dashboard')}
            refreshDashboard={this.refreshDashboard}
            pathName={this.props.location.pathname}
            isRefreshEnabled={isRefreshEnabled}
          >
            <AmbariStatus />
          </Header>
          <div className="app">
            {this.props.customer_name && this.props.children}
            <Footer version={this.props.version} />
          </div>
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
          <SidebarMenu
            items={this.getSidebarMenuWithPrivileges(sidebarMenuItems)}
            query={this.props.location.query}
            privileges={this.props.privileges}
          />
          {this.props.popup !== '' && <Popup context={this.props.popup} version={2} />}
          {this.state.popup === 'changePwd' && (
            <ChangePassword onClose={this.setPopup} />
          )}
          {this.state.popup === 'settings' && (
            <Settings onClose={this.setPopup} />
          )}
          {this.state.popup === 'logSource' && (
            <UploadFile onClose={this.setPopup} />
          )}
        </div>
      );
    }

    return (
      <div className="app" style={{ 'marginLeft': 0, 'marginTop': 0, 'paddingTop': 0 }}>
        {this.props.children}
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
App.displayName = 'App';
App.propTypes = {
  'children': PropTypes.element.isRequired,
  'customer_name': PropTypes.string,
  'location': PropTypes.object.isRequired,
  'popup': PropTypes.string,
  'privileges': PropTypes.object.isRequired,
  'version': PropTypes.string,
  'changeLocation': PropTypes.func.isRequired,
  'fetchTags': PropTypes.func.isRequired,
  'fetchPipelines': PropTypes.func.isRequired,
  'fetchSystemInfo': PropTypes.func.isRequired,
  'fetchPrivileges': PropTypes.func.isRequired,
  'updateTime': PropTypes.func.isRequired,
  'notifications': PropTypes.array,
  'fetchSuspiciousBehavior': PropTypes.func.isRequired,
  'fetchMaliciousBehavior': PropTypes.func.isRequired,
  'fetchBehaviorSummary': PropTypes.func.isRequired,
  'isLoading': PropTypes.bool,
  'customer_id': PropTypes.string,
  'updateSysteminfo': PropTypes.string,
  'systemInfo': PropTypes.object.isRequired,
};
App.defaultProps = {
  'customer_name': '',
  'popup': '',
  'version': '',
  'notifications': [],
  'isLoading': false,
  'customer_id': '',
  'updateSysteminfo': '',
};

export const mapStateToProps = state => ({
  'customer_name': state.raw.toJS().systemInfo.customer_name,
  'customer_id': state.raw.toJS().systemInfo.customer_id,
  'privileges': getPrivileges(state),
  'isLoading': state.raw.toJS().loadStatus.isLoading.length !== 0,
  'popup': state.app.ui.get('popup'),
  'notifications': state.app.ui.toJS().notifications,
  'version': state.raw.toJS().systemInfo.version,
  'updateSysteminfo': state.data.settings.toJS().updateSysteminfo,
  'systemInfo': state.raw.toJS().systemInfo,
});

const mapDispatchToProps = dispatch => ({
  'changeLocation': location => dispatch(routerActions.push(location)),
  'fetchSystemInfo': (...args) => dispatch(fetchSystemInfo(...args)),
  'fetchTags': (...args) => dispatch(fetchTags(...args)),
  'fetchPipelines': (...args) => dispatch(fetchPipelines(...args)),
  'fetchPrivileges': (...args) => dispatch(fetchPrivileges(...args)),
  'fetchSuspiciousBehavior': (...args) => dispatch(fetchSuspiciousBehavior(...args)),
  'fetchMaliciousBehavior': (...args) => dispatch(fetchMaliciousBehavior(...args)),
  'fetchBehaviorSummary': (...args) => dispatch(fetchBehaviorSummary(...args)),
  'updateTime': (...args) => dispatch(updateTime(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
