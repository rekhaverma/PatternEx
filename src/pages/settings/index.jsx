import React from 'react';
import Tabs from 'components/tabs';
import Modal from 'components/modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from 'components/loader/loader-v2.component';
import { fetchSystemInfo, fetchPipelines } from 'model/actions';
import OktaSettings from './components/okta-settings';
import PipelineSettings from './components/pipeline-settings';
import DashboardSettings from './components/dashboard-settings';
import UISettings from './components/ui-settings';

import './settings.style.scss';

const tabs = [
  {
    'id': 'sso',
    'title': 'SAML SSO',
  },
  {
    'id': 'pipeline',
    'title': 'Pipeline configuration',
  },
  {
    'id': 'dashboard',
    'title': 'Dashboard configuration',
  },
  {
    'id': 'ui',
    'title': 'UI configuration',
  },
];

class Settings extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      'selectedTab': 'sso',
    };
    this.handleTabChange = this.handleTabChange.bind(this);
    this.closeSetting = this.closeSetting.bind(this);
  }
  componentDidUpdate() {
    const { updateSysteminfo, pipelineUpdate } = this.props;
    if (updateSysteminfo === 'success') {
      this.props.fetchSystemInfo(true);
    }
    if (pipelineUpdate === 'success') {
      this.props.fetchPipelines(true);
    }
  }
  handleTabChange(id) {
    this.setState({
      'selectedTab': id,
    });
  }
  closeSetting() {
    this.props.onClose();
  }
  render() {
    const { selectedTab } = this.state;
    const { systemInfo } = this.props;
    return (
      <Modal>
        <div className="settings">
          { this.props.isLoading && <Loader /> }
          <div className="settings__header">
            <span className="settings__heading">
              Settings
            </span>
            <span
              className="icon-close2 close-setting-modal"
              onClick={this.closeSetting}
            />
          </div>
          <Tabs
            active={this.state.selectedTab}
            className="tabsV2"
            items={tabs}
            onClick={this.handleTabChange}
          />
          {selectedTab === 'sso' ? (
            <OktaSettings
              customerId={systemInfo.customer_id}
              configSet={systemInfo.login_config}
              closeButton={this.closeSetting}
            />
          ) : ''}
          {selectedTab === 'pipeline' ? (
            <PipelineSettings
              customerId={systemInfo.customer_id}
              closeButton={this.closeSetting}
            />
          ) : ''}
          {selectedTab === 'dashboard' ? (
            <DashboardSettings
              customerId={systemInfo.customer_id}
              closeButton={this.closeSetting}
            />
          ) : ''}
          {selectedTab === 'ui' ? (
            <UISettings
              customerId={systemInfo.customer_id}
              closeButton={this.closeSetting}
            />
          ) : ''}
        </div>
      </Modal>
    );
  }
}

Settings.propTypes = {
  'onClose': PropTypes.func.isRequired,
  'systemInfo': PropTypes.object.isRequired,
  'isLoading': PropTypes.bool,
  'updateSysteminfo': PropTypes.string,
  'pipelineUpdate': PropTypes.string,
  'fetchPipelines': PropTypes.func.isRequired,
  'fetchSystemInfo': PropTypes.func.isRequired,
};

Settings.defaultProps = {
  'isLoading': false,
  'updateSysteminfo': '',
  'pipelineUpdate': '',
};

const mapStateToProps = state => ({
  'isLoading': state.data.settings.toJS().isLoading,
  'updateSysteminfo': state.data.settings.toJS().updateSysteminfo,
  'pipelineUpdate': state.data.settings.toJS().pipelineUpdate,
  'systemInfo': state.raw.toJS().systemInfo,
});

const mapDispatchToProps = dispatch => ({
  'fetchPipelines': (...args) => dispatch(fetchPipelines(...args)),
  'fetchSystemInfo': (...args) => dispatch(fetchSystemInfo(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
