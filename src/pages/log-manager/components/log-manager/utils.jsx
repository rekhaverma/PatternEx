import React from 'react';

import AdvanceSelect from 'components/advance-select/advance-select.component';
import { MatField } from 'components/forms';
import MultiStepSelect from 'components/multi-step-select';

import { BUTTON, DEVICE_NAMES, INFO, INPUT, MULTI_STEP_SELECT, SELECT } from './constants';

import Information from './components/information/index';

export const renderFormComponent = (component) => {
  const className = 'log-manager-modal';

  switch (component.type) {
    case INPUT:
      let currentValue = component.currentValue;
      if (typeof component.currentValue === 'undefined') {
        currentValue = component.defaultValue;
      }
      const isRequired = !component.notRequired;
      return (
        <div className={`${className}__form-item`} key={component.name}>
          <MatField
            type="text"
            name={component.name}
            onChange={value => component.onClick(component, value)}
            prefix="log-manager"
            value={currentValue}
            hasError={isRequired && component.hasError}
            onErrorFound={hasError => component.onErrorFound(component, hasError)}
            label={component.placeholderId}
            errorMessage={component.errorMessage}
          />
        </div>
      );

    case SELECT:
      const options = component.options || component.getOptions();
      if (component.disabled) {
        return (<div key={component.name} />);
      }
      return (
        <div className={`${className}__form-item`} key={component.name}>
          <AdvanceSelect
            activeOption={component.currentValue || component.placeholder}
            options={options.map(item => ({
              id: item.id || item.label,
              value: item.label,
              disabled: item.disabled || false,
            }))}
            onOptionUpdate={value => component.onClick(component, value)}
            hasError={component.hasError}
            errorMessage={component.errorMessage}
            allowSearch={component.allowSearch || false}
          />
        </div>);

    case INFO:
      return (
        <div className={`${className}__form-item`} key={component.messageId}>
          <Information
            className={className}
            intlId={component.messageId}
            defaultMessage={component.message}
          />
        </div>
      );

    case BUTTON:
      return (
        <div className={`${className}__form-item`} key={component.type}>
          <div className={`${className}__add-field`}>
            <p className={`${className}__add-field--label`} onClick={this.addNewFormField}>{component.text}</p>
            <span className="icon-add" onClick={this.addNewFormField} />
          </div>
        </div>
      );

    case MULTI_STEP_SELECT:
      return (
        <div className={`${className}__form-item`} key={component.name}>
          <MultiStepSelect
            placeholder={component.placeholder}
            activeOptions={component.currentValue || component.defaultValue}
            options={component.options.map(item => ({
              id: item.label,
              content: item.label,
              isEnabled: item.isEnabled,
              options: Object.keys(item).includes('options') ? item.options : [],
            }))}
            setOptions={values => component.onClick(component, values, true)}
            hasError={component.hasError}
            errorMessage={component.errorMessage}
          />
        </div>
      );

    default:
      return null;
  }
};

export const getDeviceCategoriesOptions = (dataSourceConfig) => {
  try {
    const categories = dataSourceConfig.Category;
    return Object.keys(categories).map(category => ({
      id: categories[category].filename || category,
      label: category,
    }));
  } catch (e) {
    return [];
  }
};

export const getDeviceTypesOptions = (dataSourceConfig, fields) => {
  try {
    const category = fields[DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_CATEGORY];
    if (!category) {
      return [];
    }
    const types = dataSourceConfig.Category[category].Type;

    return Object.keys(types).map(type => ({
      id: types[type].filename || type,
      label: type,
    }));
  } catch (e) {
    return false;
  }
};

export const getDeviceSubTypesOptions = (dataSourceConfig, fields) => {
  try {
    const category = fields[DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_CATEGORY];
    if (!category) {
      return [];
    }

    const type = fields[DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_TYPE];
    if (!type) {
      return [];
    }

    const subTypes = dataSourceConfig.Category[category].Type[type].SubType;

    return Object.keys(subTypes).map(subType => ({
      id: subTypes[subType].filename,
      label: subType,
    }));
  } catch (e) {
    return false;
  }
};

