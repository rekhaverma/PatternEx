import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

import D3ProgressBar from 'components/d3-progress-chart';
import { convertBytesTo, smartNumber } from 'lib';

import { headerContent } from '../../constants';

export const Header = (props) => {
  const { className, data } = props;

  const getHeaderValue = (field) => {
    if (!data[field]) {
      return (
        <D3ProgressBar
          amount={0}
          maxim={1}
          displayText="N/A"
          svgDimensions={{ width: 100, height: 100 }}
        />
      );
    }

    switch (field) {
      case 'firstIngestion':
      case 'lastUpdate':
        const date = moment.utc(data[field]);
        const displayedText = `
        <div class="${className}__header-value--small">
          <div>${date.format('ddd,  D MMM YYYY')}</div>
          <div>${date.format('HH:mm:ss Z')}</div>
        </div>`;
        return (
          <D3ProgressBar
            amount={1}
            maxim={1}
            displayText={displayedText}
            svgDimensions={{ width: 100, height: 100 }}
          />
        );

      case 'storage':
        return (
          <D3ProgressBar
            amount={data[field]}
            maxim={data[field]}
            displayText={convertBytesTo(data[field])}
            svgDimensions={{ width: 100, height: 100 }}
          />
        );

      default:
        return (
          <D3ProgressBar
            amount={data[field]}
            maxim={data[field]}
            displayText={smartNumber(data[field])}
            svgDimensions={{ width: 100, height: 100 }}
          />
        );
    }
  };

  return (
    <div className={`${className}__header`}>
      {headerContent.map((item, index) => (
        <div className={`${className}__header-block`} key={index}>
          <div className={`${className}__header-label`}>
            <FormattedMessage id={item.i18n} />
          </div>
          <div className={`${className}__header-value`}>
            {getHeaderValue(item.field)}
          </div>
        </div>
      ))}
    </div>
  );
};

Header.propTypes = {
  data: PropTypes.object.isRequired,
  className: PropTypes.string,
};

Header.defaultProps = {
  className: 'log-manager',
};
