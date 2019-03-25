import React from 'react';
import PropTypes from 'prop-types';

const CardCounter = ({ value }) => (
  <span className="card__counter">{value}</span>
);
CardCounter.displayName = 'CardCounter';
CardCounter.propTypes = {
  'value': PropTypes.number,
};
CardCounter.defaultProps = {
  'value': 0,
};

export default CardCounter;
