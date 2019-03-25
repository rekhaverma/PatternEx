import React from 'react';
import PropTypes from 'prop-types';

import { renderFormComponent } from '../../../utils';

export class StepSelect extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  renderStaticFields() {
    const { staticFields, fields, errors, onErrorFound, onFieldUpdate } = this.props;

    return staticFields.map((field) => {
      const newField = {
        ...field,
        onErrorFound,
        currentValue: fields[field.name],
        hasError: errors[field.name],
        onClick: onFieldUpdate,
      };
      return renderFormComponent(newField);
    });
  }

  renderTemplate() {
    const { templates, templateName, fields, errors, onErrorFound, onFieldUpdate } = this.props;
    const { option, subOption } = fields[templateName] || {};

    let dynamicFields = templates[`${option}_${subOption}`] || [];
    if (!option || !subOption) {
      dynamicFields = templates[fields[templateName]] || [];
    }

    return dynamicFields.map((field) => {
      const newField = {
        ...field,
        onErrorFound,
        currentValue: fields[field.name],
        hasError: errors[field.name],
        onClick: onFieldUpdate,
      };
      return renderFormComponent(newField);
    });
  }

  render() {
    return (
      <div>
        {this.renderStaticFields()}
        {this.renderTemplate()}
      </div>
    );
  }
}

StepSelect.propTypes = {
  staticFields: PropTypes.array.isRequired,
  templates: PropTypes.object.isRequired,
  templateName: PropTypes.string.isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onErrorFound: PropTypes.func.isRequired,
};
