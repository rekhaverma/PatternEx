import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';

import { Button } from 'components/forms';
import LoaderSmall from 'components/loader/loader-small.component';

import { StepTabs } from './components/step-tabs.component';
import { StepSelect } from './components/step-select.component';
import { BUTTON, INFO, steps, stepsOrder } from '../../constants';

import './add-data-source-modal.style.scss';

class AddDataSourceModal extends React.Component {
  constructor() {
    super();

    this.state = {
      stepIndex: 0,
      fields: {},
      errors: {},
    };

    this.onStepChange = this.onStepChange.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onFormSave = this.onFormSave.bind(this);
    this.onErrorFound = this.onErrorFound.bind(this);
  }

  onFormSave() {
    if (this.validateErrors()) {
      this.props.addDataSource(this.state.fields);
    }
  }

  onStepChange(increase = false) {
    const currentStep = this.state.stepIndex;
    if (!increase) {
      return this.setState({
        errors: {},
        stepIndex: currentStep - 1,
      });
    }
    if (this.validateErrors()) {
      this.setState({
        stepIndex: currentStep + 1,
      });
    }

    return false;
  }

  onFieldUpdate(field, value, clearErrors = false) {
    const fields = { ...this.state.fields };
    let errors = { ...this.state.errors };
    if (Object.keys(field).includes('onUpdateClearFields')) {
      if (fields[field.name] !== value) {
        field.onUpdateClearFields.forEach((newField) => {
          delete fields[newField];
          delete errors[newField];
        });
      }
    }
    fields[field.name] = value;
    if (clearErrors) {
      errors = {};
    } else {
      delete errors[field.name];
    }
    this.setState({ fields, errors });
  }

  onErrorFound(field, hasError) {
    if (field.notRequired) {
      return false;
    }
    const errors = { ...this.state.errors };
    errors[field.name] = hasError;
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) {
        delete errors[key];
      }
    });
    return this.setState({ errors });
  }

  validateErrors() {
    const { fields } = this.state;
    const { dataSourceConfig } = this.props;
    const currentStep = this.state.stepIndex;
    const currentStepData = steps(dataSourceConfig, fields)[stepsOrder[currentStep]];
    const currentTemplate = this.state.fields[currentStepData.templateName];
    let currentFields;
    if (typeof currentTemplate === 'object') {
      currentFields = currentStepData.templates[`${currentTemplate.option}_${currentTemplate.subOption}`];
    } else {
      currentFields = currentStepData.templates[currentTemplate];
    }

    if (!currentFields) {
      currentFields = currentStepData.staticFields;
    }
    const errors = { ...this.state.errors };
    /**
     * Call `getOptions` method to disable the selects
     */
    currentFields
      .forEach(field => Object.keys(field).includes('getOptions') && field.getOptions());
    currentFields
      .filter(field => [BUTTON, INFO].indexOf(field.type) === -1 &&
        !field.disabled && !field.notRequired)
      .forEach(field => errors[field.name] = !fields[field.name]);

    Object.keys(errors).forEach((key) => {
      if (!errors[key]) {
        delete errors[key];
      }
    });
    this.setState({ errors });

    return !Object.keys(errors).length;
  }

  renderStepContent() {
    const { stepIndex, fields, errors } = this.state;
    const { dataSourceConfig } = this.props;
    const step = steps(dataSourceConfig, fields)[stepsOrder[stepIndex]];

    if (Object.keys(step).includes('tabs')) {
      return (
        <StepTabs
          templateName={step.templateName}
          fields={fields}
          onFieldUpdate={this.onFieldUpdate}
          tabs={step.tabs}
          templates={step.templates}
          errors={errors}
          onErrorFound={this.onErrorFound}
        />
      );
    }
    return (
      <StepSelect
        fields={fields}
        errors={errors}
        onFieldUpdate={this.onFieldUpdate}
        templateName={step.templateName}
        staticFields={step.staticFields}
        templates={step.templates}
        onErrorFound={this.onErrorFound}
      />
    );
  }

  render() {
    const { errors } = this.state;
    const { className, handleForm, isLoading } = this.props;

    return (
      <div className={className}>
        <div className={`${className}__header`}>
          <FormattedHTMLMessage id="logManager.form.title" />
          <span className="icon-close" onClick={!isLoading && handleForm} />
        </div>
        <div className={`${this.props.className}__content`}>
          {this.renderStepContent()}
        </div>
        <div className={`${className}__footer`}>
          {
            isLoading && (
              <div className={`${className}__loader`}>
                <LoaderSmall />
              </div>
            )
          }
          {
            this.state.stepIndex > 0 && (
              <Button
                className="button +small"
                disabled={isLoading}
                onClick={() => this.onStepChange()}
              >Previous
              </Button>
            )
          }
          {
            this.state.stepIndex + 1 < stepsOrder.length && (
              <Button
                className="button--success +small"
                disabled={Object.keys(errors).length || isLoading}
                onClick={() => this.onStepChange(true)}
              >
                Next
              </Button>
            )
          }
          {
            this.state.stepIndex + 1 === stepsOrder.length && (
              <Button
                className="button--success +small"
                disabled={Object.keys(errors).length || isLoading}
                onClick={() => this.onFormSave()}
              >
                Save
              </Button>
            )
          }
          <Button
            className="button +small"
            disabled={isLoading}
            onClick={handleForm}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

AddDataSourceModal.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  dataSourceConfig: PropTypes.object.isRequired,
  handleForm: PropTypes.func.isRequired,
  addDataSource: PropTypes.func.isRequired,
  className: PropTypes.string,
};

AddDataSourceModal.defaultProps = {
  className: 'log-manager-modal',
};

export default AddDataSourceModal;
