import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import './no-data.style.scss';

const NoData = (props) => {
  const message = (
    <FormattedMessage
      id={props.intlId}
      defaultMessage={props.intlDefault}
      values={props.intlValues}
    >
      {text => <h1 className={props.className}>{text}</h1>}
    </FormattedMessage>
  );

  if (props.withIcon) {
    return (
      <div className="no-data">
        <span className="no-data__icon icon-information" />
        {message}
      </div>
    );
  }

  if (props.intlId !== '') {
    return message;
  }

  if (React.isValidElement(props.message)) {
    return props.message;
  }

  return (
    <h1 className={props.className}>
      {props.message}
    </h1>
  );
};
NoData.propTypes = {
  'className': PropTypes.string,
  'intlDefault': PropTypes.string,
  'intlId': PropTypes.string,
  'intlValues': PropTypes.object,
  'message': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  'withIcon': PropTypes.bool,
};

NoData.defaultProps = {
  'className': 'noData',
  'intlDefault': '',
  'intlId': '',
  'intlValues': {},
  'message': '',
  'withIcon': false,
};

export default NoData;
