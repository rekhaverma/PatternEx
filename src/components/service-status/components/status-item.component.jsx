import React from 'react';
import PropTypes from 'prop-types';

const StatusItem = props => (
  <div className={props.className}>
    <p>{props.name}</p>
    <span className={`${props.className}__bulb +${props.serviceState}`} />
  </div>
);

StatusItem.propTypes = {
  'serviceState': PropTypes.string.isRequired,
  'className': PropTypes.string.isRequired,
  'name': PropTypes.string.isRequired,
};

export default StatusItem;
