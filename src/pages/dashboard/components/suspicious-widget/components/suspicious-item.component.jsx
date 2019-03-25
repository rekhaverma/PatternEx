import React from 'react';
import PropTypes from 'prop-types';

const SuspiciousItem = props => (
  <div className="suspicious-widget__item" onClick={props.onClick}>
    <span>{props.label}</span>
    <span>{props.value || 'NA'}</span>
  </div>
);
SuspiciousItem.displayName = 'SuspiciousItem';
SuspiciousItem.propTypes = {
  'label': PropTypes.string,
  'value': PropTypes.number,
  'onClick': PropTypes.func,
};
SuspiciousItem.defaultProps = {
  'label': 'Untitled',
  'value': 0,
  'onClick': () => null,
};

export default SuspiciousItem;
