import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Tabs from 'components/tabs';

import ExtraDetailsList from './extra-details-list.component';

class ExtraDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 'usecases',
    };
    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(tab) {
    this.setState({ tab });
  }

  render() {
    const { className, useCases } = this.props;
    const tabs = [
      {
        id: 'usecases',
        title: 'Use Cases',
      },
      {
        id: 'debug',
        title: 'Debug',
      },
    ];
    if (!useCases.length) {
      return (
        <div>
          <div className={`${className}__tabs`}>
            <Tabs
              key="tabs"
              active={this.state.tab}
              style={{ 'margin': 10 }}
              className="tabsV2"
              items={tabs}
              onClick={this.onTabChange}
              slim
            />
          </div>
          <div className={`${className}__tab-content`}>
            <div
              className={`${className}__tab-no-data`}
            >
              <FormattedMessage id="global.nodata" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className={`${className}__tabs`}>
          <Tabs
            key="tabs"
            active={this.state.tab}
            style={{ 'margin': 10 }}
            className="tabsV2"
            items={tabs}
            onClick={this.onTabChange}
            slim
          />
        </div>
        <div className={`${className}__tab-content`}>
          <ExtraDetailsList
            className={className}
            titles={Object.keys(useCases[0]).map(title => title)}
            listContent={useCases}
          />
        </div>
      </div>
    );
  }
}

ExtraDetails.propTypes = {
  useCases: PropTypes.array.isRequired,
  //   debug: PropTypes.array.isRequired,
  className: PropTypes.string,
};

ExtraDetails.defaultProps = {
  className: '',
};

export default ExtraDetails;
