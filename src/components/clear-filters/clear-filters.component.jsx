import React from 'react';
import PropTypes from 'prop-types';

import './clear-filters.style.scss';

const ClearFilters = props => (
  <div className="clear-filters" onClick={props.onClick}>
    <span className="clear-filters__button">{props.text}</span>
  </div>
);
ClearFilters.displayName = 'ClearFilters';
ClearFilters.propTypes = {
  'text': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  'onClick': PropTypes.func.isRequired,
};

export default ClearFilters;
