import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';

import { FormattedHTMLMessage } from 'react-intl';

const RowTheme = props => (
  <div
    className={props.className}
    onClick={props.onClick}
  >
    <div className={`${props.className}__row`}>
      <FormattedHTMLMessage
        id="dateRange.row.fromToUntil"
        values={{
          'valueFrom': props.startDate.format(props.format),
          'valueUntil': props.endDate.format(props.format),
        }}
      />
      <span className="icon-Calendar-icon" />
    </div>
  </div>
);
RowTheme.propTypes = {
  'className': PropTypes.string.isRequired,
  'startDate': momentPropTypes.momentObj.isRequired,
  'endDate': momentPropTypes.momentObj.isRequired,
  'format': PropTypes.string,
  'onClick': PropTypes.func.isRequired,
};
RowTheme.defaultProps = {
  'format': 'MM - DD - YYYY',
};

export default RowTheme;
