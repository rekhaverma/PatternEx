import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';

import { FormattedHTMLMessage } from 'react-intl';

const RowThemeWithLabel = props => (
  <div
    className={props.className}
    onClick={props.onClick}
  >
    <span className={`${props.className}__label`}>
      <FormattedHTMLMessage
        values={{
          'label': props.label,
        }}
        id="dateRange.rowV2.label"
      />
    </span>
    <div className={`${props.className}__row`}>
      <FormattedHTMLMessage
        id="dateRange.rowV2.fromToUntil"
        values={{
          'valueFrom': props.startDate.format(props.format),
          'valueUntil': props.endDate.format(props.format),
        }}
      />
      <span className="icon-Calendar-icon" />
    </div>
  </div>
);
RowThemeWithLabel.propTypes = {
  'className': PropTypes.string.isRequired,
  'startDate': momentPropTypes.momentObj.isRequired,
  'endDate': momentPropTypes.momentObj.isRequired,
  'format': PropTypes.string,
  'onClick': PropTypes.func.isRequired,
  'label': PropTypes.string,
};
RowThemeWithLabel.defaultProps = {
  'format': 'MM - DD - YYYY',
  'label': 'Date range',
};

export default RowThemeWithLabel;
