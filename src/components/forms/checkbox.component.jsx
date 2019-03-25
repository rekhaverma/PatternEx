import React from 'react';
import PropTypes from 'prop-types';

const CheckBox = props => (
  <div className="checkbox">
    <input
      type="checkbox"
      value={props.value}
      id={props.id}
      checked={props.checked}
      onChange={props.onChange}
      onMouseOver={props.onMouseOver}
      onFocus={props.onFocus}
      name={props.name}
    />
    <label htmlFor={props.id} className="check-tick">
      <span className="check-label">{props.label}</span>
    </label>
  </div>
);

CheckBox.propTypes = {
  'id': PropTypes.any.isRequired,
  'onChange': PropTypes.func.isRequired,
  'onMouseOver': PropTypes.func.isRequired,
  'onFocus': PropTypes.func.isRequired,
  'label': PropTypes.string.isRequired,
  'value': PropTypes.any.isRequired,
  'checked': PropTypes.bool.isRequired,
  'name': PropTypes.string,
};

CheckBox.defaultProps = {
  'name': '',
};

export default CheckBox;
