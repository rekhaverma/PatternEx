import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';

import { FormattedHTMLMessage } from 'react-intl';

const PresentationBox = props => (
  <div
    className={props.className}
    onClick={props.onClick}
  >
    <div className={`${props.className}__column`}>
      <span className="icon-calendar" />
    </div>
    <div className={`${props.className}__column`}>
      <FormattedHTMLMessage
        id="dateRange.from"
        values={{
          'value': props.startDate.format(props.format),
        }}
      />
      <FormattedHTMLMessage
        id="dateRange.until"
        values={{
          'value': props.endDate.format(props.format),
        }}
      />
    </div>
  </div>
);
PresentationBox.propTypes = {
  'className': PropTypes.string.isRequired,
  'startDate': momentPropTypes.momentObj.isRequired,
  'endDate': momentPropTypes.momentObj.isRequired,
  'format': PropTypes.string,
  'onClick': PropTypes.func.isRequired,
};
PresentationBox.defaultProps = {
  'format': 'YYYY - MM - DD',
};

export default PresentationBox;
