import React from 'react';
import PropTypes from 'prop-types';

const CardIcon = props => (
  <div className={`${props.className}__icon`}>
    <span className={props.type} />
  </div>
);
CardIcon.propTypes = {
  'className': PropTypes.string.isRequired,
  'type': PropTypes.string.isRequired,
};

export default CardIcon;
