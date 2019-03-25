import React from 'react';
import PropTypes from 'prop-types';
import './custom-cell.style';

const CustomCell = props => (
  props.title ?
    <span className="custom-cell" title={props.children}>{props.children}</span> :
    <span className="custom-cell">{props.children}</span>
);

CustomCell.displayName = 'CustomCell';

CustomCell.propTypes = {
  'children': PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  'title': PropTypes.bool,
};

CustomCell.defaultProps = {
  'children': null,
  'title': false,
};

export default CustomCell;
