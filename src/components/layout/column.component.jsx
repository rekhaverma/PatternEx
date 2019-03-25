import React from 'react';
import PropTypes from 'prop-types';

const Column = props => (
  <div
    className={`column__${props.size}__${props.total} ${props.customClassName}`}
    style={props.style}
  >
    {props.children}
  </div>
);
Column.propTypes = {
  'customClassName': PropTypes.string,
  'children': PropTypes.any,
  'size': PropTypes.number,
  'style': PropTypes.object,
  'total': PropTypes.number,
};
Column.defaultProps = {
  'customClassName': '',
  'children': null,
  'size': 1,
  'style': {},
  'total': 1,
};

export default Column;
