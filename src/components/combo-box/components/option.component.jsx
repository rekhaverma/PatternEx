import React from 'react';
import PropTypes from 'prop-types';

const Option = ({ option, onClick, ...props }) => (
  <span
    className={`${props.isActive}` ? `${props.className} +active` : props.className}
    onClick={onClick}
  >
    {option}
  </span>
);
Option.displayName = 'Option';
Option.propTypes = {
  'className': PropTypes.string,
  'isActive': PropTypes.bool,
  'option': PropTypes.string.isRequired,
  'onClick': PropTypes.func.isRequired,
};
Option.defaultProps = {
  'className': 'selectBox__option',
  'isActive': false,
};

export default Option;
