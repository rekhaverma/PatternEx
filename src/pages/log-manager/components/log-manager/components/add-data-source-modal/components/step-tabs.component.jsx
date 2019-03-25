import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'components/tabs';

import { DEVICE_NAMES } from '../../../constants';
import { renderFormComponent } from '../../../utils';

export class StepTabs extends React.Component {
  constructor() {
    super();

    this.state = {
      tab: DEVICE_NAMES.INDIVIDUAL_DEVICE.name,
    };

    this.onTabChange = this.onTabChange.bind(this);
  }

  componentDidMount() {
    const { onFieldUpdate, templateName } = this.props;
    const { tab } = this.state;

    onFieldUpdate(templateName, tab, true);
  }

  onTabChange(tab) {
    const { onFieldUpdate, templateName } = this.props;
    this.setState({ tab });

    onFieldUpdate(templateName, tab, true);
  }

  renderTabContent() {
    const { templates, fields, onFieldUpdate, errors, onErrorFound } = this.props;
    const dynamicFields = templates[this.state.tab];

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
        <div className={`${this.props.className}__content--header`}>
          <Tabs
            key="tabs"
            active={this.state.tab}
            style={{ 'margin': 10 }}
            className="tabsV2"
            items={this.props.tabs}
            onClick={this.onTabChange}
            slim
          />
        </div>
        {this.renderTabContent()}
      </div>
    );
  }
}

StepTabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  templates: PropTypes.object.isRequired,
  templateName: PropTypes.string.isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onErrorFound: PropTypes.func.isRequired,
  className: PropTypes.string,
};

StepTabs.defaultProps = {
  className: 'log-manager-modal',
};
