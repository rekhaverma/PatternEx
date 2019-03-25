import React from 'react';
import PropTypes from 'prop-types';

const RadioButton = props => (
  <div className={`radio ${props.className}`}>
    <input
      id={props.id}
      name={props.name}
      type="radio"
      value={props.value}
      onChange={props.onChange}
      checked={props.checked}
    />
    <label htmlFor={props.id} className="radio-label">{props.label}</label>
  </div>
);

RadioButton.propTypes = {
  'id': PropTypes.any.isRequired,
  'onChange': PropTypes.func.isRequired,
  'label': PropTypes.string.isRequired,
  'name': PropTypes.string.isRequired,
  'checked': PropTypes.bool.isRequired,
  'value': PropTypes.any.isRequired,
  'className': PropTypes.string,
};

RadioButton.defaultProps = {
  'className': '',
};
export default RadioButton;
