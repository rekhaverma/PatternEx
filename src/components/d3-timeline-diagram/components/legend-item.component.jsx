import React from 'react';
import PropTypes from 'prop-types';

const LegendItem = props => (
  <span className={props.className}>
    <span className={`${props.className}__bullet`} style={{ 'backgroundColor': props.color }} />
    {props.children}
  </span>
);
LegendItem.propTypes = {
  'children': PropTypes.any.isRequired,
  'className': PropTypes.string.isRequired,
  'color': PropTypes.string.isRequired,
};

export default LegendItem;
