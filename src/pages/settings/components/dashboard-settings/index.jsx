import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, Button } from 'components/forms';
import { updateSystemInfo } from 'model/actions/rest/systemInfo.actions';

import './dashboard-settings.style.scss';

const onKeyPress = (key) => {
  if ([46, 8, 9, 27, 13, 110, 190].indexOf(key.charCode) > -1 ||
  // Allow: Ctrl+A, Command+A
    (key.charCode === 65 && (key.ctrlKey === true || key.metaKey === true)) ||
  // Allow: home, end, left, right, down, up
    (key.charCode >= 35 && key.charCode <= 40)) {
    // let it happen, don't do anything
    return;
  }
  // Ensure that it is a number and stop the keypress
  if (key.charCode < 48 || key.charCode > 57) {
    key.preventDefault();
  }
};

class DashboardSettings extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      refreshTime: (args[0].systemInfo && args[0].systemInfo.login_config
        && args[0].systemInfo.login_config.refresh_time) || 10,
      formValid: true,
    };

    this.saveSystemInfo = this.saveSystemInfo.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.setState({
      refreshTime: value,
      formValid: value.trim() !== '',
    });
  }

  saveSystemInfo() {
    const { refreshTime } = this.state;
    const { customerId, updateSystemInfoDetails } = this.props;
    const params = {
      refresh_time: refreshTime,
    };
    updateSystemInfoDetails(customerId, params);
  }

  render() {
    return (
      <div className="dashboard-settings">
        <div className="dashboard-settings__row">
          <Input
            type="text"
            name="refreshTime"
            value={this.state.refreshTime}
            onChange={e => this.onChange(e.target.value)}
            onKeyPress={e => onKeyPress(e)}
            placeholder="Dashboard Refresh Time (in mins)"
          />
        </div>
        <div className="dashboard-actions">
          <Button
            className="button--success"
            disabled={!this.state.formValid}
            onClick={this.saveSystemInfo}
          >
              Save changes
          </Button>
          <Button className="button--dark" onClick={this.props.closeButton} >
              Cancel
          </Button>
        </div>
      </div>
    );
  }
}

DashboardSettings.propTypes = {
  'customerId': PropTypes.string.isRequired,
  'closeButton': PropTypes.func.isRequired,
  'updateSystemInfoDetails': PropTypes.func.isRequired,
};
DashboardSettings.defaultProps = {
  'configSet': {},
  'customerId': '',
  'systemInfo': {},
};
const mapDispatchToProps = dispatch => ({
  'updateSystemInfoDetails': (customerId, params) => dispatch(updateSystemInfo(customerId, params)),
});
const mapStateToProps = state => ({
  'systemInfo': state.raw.toJS().systemInfo,
});
export default connect(mapStateToProps, mapDispatchToProps)(DashboardSettings);
