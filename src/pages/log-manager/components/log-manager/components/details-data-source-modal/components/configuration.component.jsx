import React from 'react';
import PropTypes from 'prop-types';
import Tabs from 'components/tabs';

import { INPUT_NAMES, OUTPUT_NAMES, steps } from '../../../constants';
import { renderFormComponent } from '../../../utils';

class Configuration extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  renderTabContent() {
    const { data, dataSourceConfig, activeTab, onErrorFound, errors, onFieldUpdate } = this.props;
    let dynamicFields;
    switch (activeTab) {
      case 'device':
        dynamicFields = steps(dataSourceConfig, data).device.staticFields;
        break;
      case 'input':
        dynamicFields = steps(dataSourceConfig, data).input.staticFields;
        const inputTemplate = `${data[INPUT_NAMES.TEMPLATE.name].option}_${data[INPUT_NAMES.TEMPLATE.name].subOption}`;
        const inputFields = steps(dataSourceConfig, data).input.templates[inputTemplate];
        dynamicFields = dynamicFields.concat(inputFields);
        break;

      case 'output':
        dynamicFields = steps(dataSourceConfig, data).output.staticFields;
        const outputTemplate = data[OUTPUT_NAMES.TEMPLATE.name];
        const outputFields = steps(dataSourceConfig, data).output.templates[outputTemplate];
        dynamicFields = dynamicFields.concat(outputFields);
        break;

      default:
        return null;
    }

    return dynamicFields.map((field) => {
      const newField = {
        ...field,
        onErrorFound,
        currentValue: data[field.name],
        readonly: data.status !== 'running',
        hasError: errors[field.name],
        onClick: onFieldUpdate,
      };
      return renderFormComponent(newField);
    });
  }

  render() {
    const { className, activeTab, onTabChange } = this.props;
    const tabs = [
      {
        id: 'device',
        title: 'Device',
      },
      {
        id: 'input',
        title: 'Input Mechanism',
      },
      {
        id: 'output',
        title: 'Output Mechanism',
      },
    ];
    return (
      <div>
        <div className={`${className}__tabs`}>
          <Tabs
            key="tabs"
            active={activeTab}
            style={{ 'margin': 10 }}
            className="tabsV2"
            items={tabs}
            onClick={onTabChange}
            slim
          />
        </div>
        <div className={`${className}__tab-content`}>
          {this.renderTabContent()}
        </div>
      </div>
    );
  }
}

Configuration.propTypes = {
  activeTab: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  dataSourceConfig: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onTabChange: PropTypes.func.isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  onErrorFound: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Configuration.defaultProps = {
  className: '',
};

export default Configuration;
