import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';
import { Button } from 'components/forms';
import Configuration from './components/configuration.component';
import ExtraDetails from './components/extra-details.component';

import './details-data-source-modal.style.scss';
import { BUTTON, INFO, INPUT_NAMES, steps } from '../../constants';
import LoaderSmall from '../../../../../../components/loader/loader-small.component';

class DetailsDataSourceModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      activeTab: 'device',
    };

    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onFormSave = this.onFormSave.bind(this);
    this.onErrorFound = this.onErrorFound.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      fields: this.props.entityData.configuration,
    });
  }

  onTabChange(activeTab) {
    if (this.validateErrors()) {
      this.setState({
        activeTab,
        errors: {},
      });
    }
  }

  onFormSave() {
    if (this.validateErrors()) {
      const fields = { ...this.state.fields };
      fields['input.template.option'] = fields[INPUT_NAMES.TEMPLATE.name].option;
      fields['input.template.suboption'] = fields[INPUT_NAMES.TEMPLATE.name].subOption;
      delete fields[[INPUT_NAMES.TEMPLATE.name]];

      this.props.updateDataSource(this.state.fields);
    }
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
    const { fields, activeTab } = this.state;
    const { dataSourceConfig } = this.props;
    const currentStepData = steps(dataSourceConfig, fields)[activeTab];
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

  render() {
    const { handleForm, className, entityData, dataSourceConfig, isLoading } = this.props;
    const { errors, activeTab, fields } = this.state;

    return (
      <div className={className}>
        <div className={`${className}__header`}>
          <FormattedHTMLMessage id="logManager.viewDataSource.header" />
          <span className="icon-close" onClick={!isLoading && handleForm} />
        </div>
        <div className={`${className}__content`}>
          <div className={`${className}__configuration`}>
            <Configuration
              onFieldUpdate={this.onFieldUpdate}
              onErrorFound={this.onErrorFound}
              activeTab={activeTab}
              errors={errors}
              onTabChange={this.onTabChange}
              dataSourceConfig={dataSourceConfig}
              className={className}
              data={fields}
            />
          </div>
          <div className={`${className}__details`}>
            <ExtraDetails
              className={className}
              useCases={entityData.useCases}
              debug={entityData.debug}
            />
          </div>
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
            entityData.status !== 'running' && (
              <Button
                className="button--success +small"
                disabled={Object.keys(errors).length || isLoading}
                onClick={this.onFormSave}
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
            Close
          </Button>
        </div>
      </div>
    );
  }
}

DetailsDataSourceModal.propTypes = {
  dataSourceConfig: PropTypes.object.isRequired,
  entityData: PropTypes.object.isRequired,
  handleForm: PropTypes.func.isRequired,
  updateDataSource: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

DetailsDataSourceModal.defaultProps = {
  className: 'view-data-source',
};

export default DetailsDataSourceModal;
