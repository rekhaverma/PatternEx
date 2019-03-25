import React from 'react';
import PropTypes from 'prop-types';

const Option = (props) => {
  const { id, value, isSelected, isDisabled, className, onOptionClick } = props;
  let optionClass = `${className}__option`;

  if (isSelected) {
    optionClass += ` ${className}__option--active`;
  }

  if (isDisabled) {
    optionClass += ` ${className}__option--disabled`;
  }

  return (
    <div
      className={optionClass}
      onClick={() => onOptionClick(id)}
    >
      <span className={`${className}__option-state`} />
      <span className={`${className}__option-label`}>{value}</span>
    </div>
  );
};

Option.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  onOptionClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

Option.defaultProps = {
  className: 'advance-select',
  isSelected: false,
  isDisabled: false,
};

export default Option;
