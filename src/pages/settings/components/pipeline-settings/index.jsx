import React from 'react';
import { CheckBox, Button } from 'components/forms';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updatePipeline } from 'model/actions/rest/pipelines.actions';
import './pipeline-settings.style.scss';

class PipelineSettings extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      'fw_sipdip': false,
      'user_access': false,
      'user_activity': false,
      'login_activity': false,
      'updatedPipelines': [],
    };
    this.onChange = this.onChange.bind(this);
    this.handleData = this.handleData.bind(this);
    this.savePipeline = this.savePipeline.bind(this);
  }
  componentWillMount() {
    this.handleData();
  }
  onChange(key, target) {
    const pipelines = this.state.updatedPipelines.slice(0);
    const pipelineIndex = pipelines.indexOf(key);
    // deleting the domain from the domain list
    if (pipelineIndex !== -1) {
      pipelines.splice(pipelineIndex, 1);
    } else {
      pipelines.push(key);
    }
    this.setState({
      [key]: !target,
      'updatedPipelines': pipelines,
    });
  }
  /*
  * Grouping pipelines into fw_sipdip, user_access, user_activity, login_activity
  * and assign this file to state
  */
  handleData() {
    const { pipelines } = this.props;
    const stateObj = {};
    if (pipelines.sipdip.enabled && pipelines.sip.enabled
    && pipelines.dip.enabled && pipelines.domain.enabled
    && pipelines.sipdomain.enabled) {
      stateObj.fw_sipdip = true;
    }
    if (pipelines.hpa.enabled && pipelines.request.enabled) {
      stateObj.login_activity = true;
    }
    stateObj.user_activity = pipelines.user.enabled;
    stateObj.user_access = pipelines.useraccess.enabled;
    this.setState(stateObj);
  }
  savePipeline() {
    const { customerId, savePipeline } = this.props;
    this.state.updatedPipelines.map((pipeline) => {
      const params = {
        'pipeline': pipeline,
        'enabled': this.state[pipeline],
        'customer_id': customerId,
      };
      savePipeline(params);
      this.setState({
        'updatedPipelines': [],
      });
      return true;
    });
  }
  render() {
    return (
      <div className="pipeline-settings">
        <CheckBox
          key="firewall"
          id="fw"
          onChange={() => this.onChange('fw_sipdip', this.state.fw_sipdip)}
          onMouseOver={() => null}
          onFocus={() => null}
          label="FIREWALL (Connection, SOURCE IP, Destination IP, Domain, Session)"
          value="fw_sipdip"
          checked={this.state.fw_sipdip}
        />
        <CheckBox
          key="userAccess"
          id="user_access"
          onChange={() => this.onChange('user_access', this.state.user_access)}
          onMouseOver={() => null}
          onFocus={() => null}
          label="USER ACCESS"
          value="user_access"
          checked={this.state.user_access}
        />
        <CheckBox
          key="users"
          id="users"
          onChange={() => this.onChange('user_activity', this.state.user_activity)}
          onMouseOver={() => null}
          onFocus={() => null}
          label="USER"
          value="user_activity"
          checked={this.state.user_activity}
        />
        <CheckBox
          key="login"
          id="login"
          onChange={() => this.onChange('login_activity', this.state.login_activity)}
          onMouseOver={() => null}
          onFocus={() => null}
          label="LOGIN"
          value="login_activity"
          checked={this.state.login_activity}
        />
        <div className="pipeline-settings__row pipeline-actions">
          <Button className="button--success" onClick={this.savePipeline}>
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

PipelineSettings.propTypes = {
  'pipelines': PropTypes.object,
  'customerId': PropTypes.string.isRequired,
  'savePipeline': PropTypes.func.isRequired,
  'closeButton': PropTypes.func.isRequired,
};
PipelineSettings.defaultProps = {
  'pipelines': {},
  'customerId': '',
};

const mapStateToProps = state => ({
  'pipelines': state.raw.toJS().pipelines,
});

const mapDispatchToProps = dispatch => ({
  'savePipeline': params => dispatch(updatePipeline(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PipelineSettings);
