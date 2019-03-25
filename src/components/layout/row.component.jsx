import React from 'react';
import PropTypes from 'prop-types';

const Row = props => (
  <div
    className={`row ${props.customClassName}`}
    style={props.style}
  >
    {props.children}
  </div>
);
Row.propTypes = {
  'customClassName': PropTypes.string,
  'children': PropTypes.any.isRequired,
  'style': PropTypes.object,
};
Row.defaultProps = {
  'customClassName': '',
  'style': {},
};

export default Row;
