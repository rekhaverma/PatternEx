import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

const Item = props => (
  <div className={props.className}>
    <FormattedMessage
      defaultMessage={props.labelDefault}
      id={props.labelId}
      values={props.labelValues}
    >
      { text => <span className={`${props.className}__label`}>{text}</span> }
    </FormattedMessage>
    <span className={`${props.className}__content`}>{props.children}</span>
  </div>
);
Item.propTypes = {
  'className': PropTypes.string,
  'children': PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
  'labelDefault': PropTypes.string,
  'labelId': PropTypes.string.isRequired,
  'labelValues': PropTypes.object,
};
Item.defaultProps = {
  'className': '',
  'labelDefault': 'Untitled',
  'labelValues': {},
};

export default Item;
