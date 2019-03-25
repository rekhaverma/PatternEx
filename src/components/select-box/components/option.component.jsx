import React from 'react';
import PropTypes from 'prop-types';

const Option = ({
  content,
  singleSelect,
  onClick,
  disabled,
  ...props
}) => (
  <span
    className={props.isActive === true ? `${props.className} +active ${disabled ? '+disabled' : ''}` : props.className}
    data-id={props.id}
    onClick={!disabled && onClick}
  >
    { singleSelect ? (
      <span className={props.isActive === true
        ? `${props.className}__roundBox +active`
        : `${props.className}__roundBox`}
      />
    ) : (
      <span className={props.isActive === true
        ? `${props.className}__checkbox +active ${disabled ? '+disabled' : ''}`
        : `${props.className}__checkbox`}
      />
    )}
    <p className="selectBox__option__optionName" style={props.style}>
      { content }
    </p>
  </span>
);
Option.displayName = 'Option';
Option.propTypes = {
  'className': PropTypes.string,
  'id': PropTypes.string.isRequired,
  'isActive': PropTypes.bool,
  'content': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  'singleSelect': PropTypes.bool.isRequired,
  'onClick': PropTypes.func.isRequired,
  'style': PropTypes.object,
  'disabled': PropTypes.bool,
};
Option.defaultProps = {
  'className': 'selectBox__option',
  'isActive': false,
  'style': {},
  'disabled': false,
};

export default Option;
