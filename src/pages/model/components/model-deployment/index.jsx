import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, RadioButton, CheckBox } from 'components/forms';
import { FormattedMessage } from 'react-intl';
import { modelAction } from 'model/actions/rest/models.actions';
import pipelineToName from 'lib/decorators/pipeline-to-name';
import './model-deployment.style.scss';

class ModelDeployment extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      'selectedOption': 'primary',
      'silentMode': false,
    };
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.deployModel = this.deployModel.bind(this);
  }

  handleOptionChange(event) {
    this.setState({
      'selectedOption': event.target.value,
    });
  }
  deployModel() {
    const modelData = this.props.data;
    const params = {
      'action': 'deploy',
      'model_name': modelData.name,
      'deploy_as': this.state.selectedOption === 'primary' ? 'main' : 'secondary',
      'silent_mode': this.state.silentMode,
    };
    this.props.modelAction(params);
    this.props.onCancel();
  }
  render() {
    const modelData = this.props.data;
    const { silentMode } = this.state;
    return (
      <div className="modal-popup model-deploy">
        <div className="row big-heading">
          <div className="col-md-12">
            <h5 className="deploy-model-header">
              <FormattedMessage
                id="model.deployment.heading"
                values={{
                  'featureType': modelData && pipelineToName(modelData.feature_type || 'NA'),
                }}
              />
            </h5>
          </div>
        </div>
        <div className="model-name">
          <div className="col-md-12">
            <span><strong>Deploy </strong>{modelData && modelData.name}</span>
          </div>
        </div>
        <div className="deploy-option">
          <RadioButton className="primary-label" id="primary" name="deploy" label="Primary" value="primary" checked={this.state.selectedOption === 'primary'} onChange={event => this.handleOptionChange(event)} />
          <RadioButton className="secondary-label" id="secondary" name="deploy" label="Secondary" value="secondary" checked={this.state.selectedOption === 'secondary'} onChange={event => this.handleOptionChange(event)} />
          <CheckBox
            id="silentMode"
            onChange={() => { this.setState({ 'silentMode': !silentMode }); }}
            onMouseOver={() => null}
            onFocus={() => null}
            value={silentMode}
            checked={silentMode}
            label="Silent Mode"
          />
        </div>
        <div className="deploy-action">
          <Button className="deployButton" value="deploy" onClick={this.deployModel}>
            <span>Deploy</span>
          </Button>
          <Button className="cancelButton" value="cancel" onClick={() => this.props.onCancel(null)}>
            <span>Cancel</span>
          </Button>
        </div>
      </div>
    );
  }
}

ModelDeployment.propTypes = {
  'data': PropTypes.object.isRequired,
  'onCancel': PropTypes.func.isRequired,
  'modelAction': PropTypes.func.isRequired,
};

ModelDeployment.defaultProps = {};

const mapDispatchToProps = dispatch => ({
  'modelAction': params => dispatch(modelAction(params)),
});

export default connect(null, mapDispatchToProps)(ModelDeployment);
