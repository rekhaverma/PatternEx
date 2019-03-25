import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Input } from 'components/forms';
import Modal from 'components/modal';
import SelectBox from 'components/select-box';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { EnabledPipelines, featureSelectOption, tagsSelectBox } from 'model/selectors';
import { addRule, updateRule, fetchColumnFormat, resetRule, resetRuleError } from 'model/actions';
import './addEditRuleModal.style.scss';
import { operators } from './constants';

class AddEditRuleModal extends React.PureComponent {
  constructor(args) {
    super(args);
    let subRules;
    if (args.type === 'Edit') {
      subRules = [];
      subRules = args.ruleDetail.sub_rules.map((el, index) => ({
        ...el,
        'id': index,
      }));
    }
    this.state = {
      'name': (args.data && args.data.name) || '',
      'pipeline': (args.data && args.data.pipeline) || args.pipelines[0].id,
      'subRules': subRules || [{
        'id': 0,
        'operator': '',
        'name': '',
        'value': '',
      }],
      'message': '',
    };
    this.deleteSubRule = this.deleteSubRule.bind(this);
    this.addNewSubRule = this.addNewSubRule.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubRuleChange = this.onSubRuleChange.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.checkFormValidity = this.checkFormValidity.bind(this);
  }
  componentWillMount() {
    const { pipeline } = this.state;
    this.props.resetRuleError();
    this.props.fetchColumnFormat(pipeline);
  }
  componentDidUpdate() {
    const { ruleAction } = this.props;
    if (ruleAction === 'Success') {
      this.props.onCancel();
      this.props.resetRule();
      this.props.resetRuleError();
    }
  }
  onStateChange(key, value) {
    const stateObj = { [key]: value };
    if (key === 'pipeline') {
      this.props.fetchColumnFormat(value);
      stateObj.subRules = [{
        'id': 0,
        'operator': '',
        'name': '',
        'value': '',
      }];
    }
    this.setState(stateObj);
  }
  /* flag(boolean) true  -> called through componentDidMount function of selectBox.
   *               false -> called through manual click.
  */
  onSubRuleChange(key, value, index, flag) {
    const subRules = this.state.subRules.slice(0);
    subRules[index][key] = value;
    // This check is used to clear the value column on change of feature.
    if (key === 'name' && !flag) {
      subRules[index].value = '';
    }
    this.setState({
      'subRules': subRules,
    });
  }
  onSubmit() {
    const valid = this.checkFormValidity();
    if (!valid) {
      return;
    }
    const { type, data } = this.props;
    let { subRules } = this.state;
    subRules = subRules.map((el) => {
      const element = el;
      delete element.id;
      return element;
    });
    const params = {
      ...this.state,
      'sub_rules': subRules,
    };
    delete params.subRules;
    if (type === 'Edit') {
      // Update Rule
      this.props.updateRule(params, data.id);
    } else {
      // Add rule
      this.props.addRule(params);
    }
    // this.props.onCancel();
  }
  checkFormValidity() {
    this.props.resetRuleError();
    const { subRules, name } = this.state;
    let message = '';
    if (name === '') {
      message = 'Rule name is required';
    } else {
      subRules.forEach((rule) => {
        if (rule.name === '') {
          message = 'Feature is required';
        } else if (rule.operator === '') {
          message = 'Operator is required';
        } else if (rule.value === '') {
          message = 'Value is required';
        }
      });
    }
    this.setState({
      'message': message,
    });
    if (message !== '') {
      return false;
    }
    return true;
  }
  addNewSubRule() {
    const subRules = this.state.subRules.slice();

    const isAnyEmptyRule = _.find(subRules, {
      'operator': '',
      'name': '',
      'value': '',
    });
    if (isAnyEmptyRule) {
      return;
    }
    subRules.push({
      'id': subRules[subRules.length - 1].id + 1,
      'operator': '',
      'name': '',
      'value': '',
    });
    this.setState({
      'subRules': subRules,
    });
  }
  deleteSubRule(index) {
    const subRules = this.state.subRules.slice(0);
    subRules.splice(index, 1);
    this.setState({
      'subRules': subRules,
    });
  }
  render() {
    const { type, columnFormat, onCancel, pipelines, tags, ruleError } = this.props;
    const { subRules, pipeline, name, message } = this.state;
    let errorRule = '';
    if (ruleError !== '') {
      errorRule = ruleError;
    } else if (message !== '') {
      errorRule = message;
    }

    return (
      <Modal>
        <div className="addEditRule">
          <div className="addEditRule__header">
            <span className="big-heading">
              <FormattedMessage
                id="rule.type"
                values={{
                  'type': type,
                }}
              />
            </span>
            <span className="icon-close2" onClick={onCancel} />
          </div>
          {errorRule !== '' ? (
            <div className="addEditRule__message">
              <FormattedMessage
                id="rule.message"
                values={{
                  'message': errorRule,
                }}
              />
            </div>
          ) : ''}
          <div className="addEditRule__row">
            <div className="addEditRule__row--pipelines">
              <SelectBox
                singleSelect
                activeOption={pipeline}
                options={pipelines}
                placeholder="Select rule for"
                onClick={value => this.onStateChange('pipeline', value)}
              />
            </div>
            <div className="addEditRule__row--name">
              <Input
                className="input--v2"
                placeholder="Rule name"
                value={name || ''}
                style={{ 'paddingLeft': 2, 'paddingRight': 2 }}
                onChange={value => this.onStateChange('name', value.target.value)}
              />
            </div>
          </div>
          {subRules && subRules.map((el, index, totalSubRules) => (
            <div className="addEditRule__row" key={`${index}_${el.id}_subrule`}>
              <div className="addEditRule__row--feature">
                <SelectBox
                  singleSelect
                  activeOption={el.name}
                  options={columnFormat}
                  style={{ 'width': '90%', 'paddingLeft': 2 }}
                  placeholder="Select feature"
                  scrollbar
                  onClick={(value, flag) => this.onSubRuleChange('name', value, index, flag)}
                  allowSearch
                />
              </div>
              <div className="addEditRule__row--operator">
                <SelectBox
                  singleSelect
                  activeOption={el.operator}
                  options={operators}
                  placeholder="Select operator"
                  onClick={value => this.onSubRuleChange('operator', value, index)}
                />
              </div>
              <div className="addEditRule__row--value">
                { el.name !== 'predicted_tag_id' ? (
                  <Input
                    className="input--v2"
                    placeholder="Enter value"
                    value={el.value}
                    style={{ 'paddingLeft': 2 }}
                    onChange={value => this.onSubRuleChange('value', value.target.value, index)}
                  />
                ) : (
                  <SelectBox
                    singleSelect
                    activeOption={el.value}
                    options={tags}
                    scrollbar
                    placeholder="Select value"
                    style={{ 'width': '70%', 'paddingLeft': 2 }}
                    onClick={value => this.onSubRuleChange('value', value, index)}
                  />
                )}
              </div>
              { totalSubRules.length > 1 ? (
                <div className="addEditRule__row--action">
                  <span
                    className="icon-remove remove-feature"
                    onClick={() => this.deleteSubRule(index)}
                  />
                </div>
              ) : (
                ''
              )}
            </div>
          ))}
          <div className="addEditRule__action">
            <div className="addEditRule__action--add">
              <Button className="button--success +small add-new-rule" onClick={this.addNewSubRule}>
                Add new rule
              </Button>
            </div>
            <div className="addEditRule__action--save">
              <Button className="button--dark +small" onClick={onCancel}>
                Cancel
              </Button>
              <Button className="button--success +small" onClick={this.onSubmit}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  'fetchColumnFormat': pipeline => dispatch(fetchColumnFormat(pipeline)),
  'updateRule': (params, ruleId) => dispatch(updateRule(params, ruleId)),
  'addRule': params => dispatch(addRule(params)),
  'resetRule': () => dispatch(resetRule()),
  'resetRuleError': () => dispatch(resetRuleError()),
});

const mapStateToProps = state => ({
  'pipelines': EnabledPipelines(state),
  'columnFormat': featureSelectOption(state),
  'tags': tagsSelectBox(state),
  'ruleAction': state.data.rules.toJS().ruleAction,
  'ruleError': state.data.rules.toJS().ruleError,
});

AddEditRuleModal.propTypes = {
  'fetchColumnFormat': PropTypes.func.isRequired,
  'updateRule': PropTypes.func.isRequired,
  'addRule': PropTypes.func.isRequired,
  'pipelines': PropTypes.array.isRequired,
  'columnFormat': PropTypes.array,
  'onCancel': PropTypes.func.isRequired,
  'type': PropTypes.string.isRequired,
  'data': PropTypes.object,
  'tags': PropTypes.array.isRequired,
  'ruleError': PropTypes.string,
  'ruleAction': PropTypes.string,
  'resetRule': PropTypes.func.isRequired,
  'resetRuleError': PropTypes.func.isRequired,
};

AddEditRuleModal.defaultProps = {
  'columnFormat': [],
  'data': null,
  'tags': [],
  'ruleError': '',
  'ruleAction': '',
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEditRuleModal);
