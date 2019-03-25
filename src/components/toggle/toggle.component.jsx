import React from 'react';
import PropTypes from 'prop-types';
import { generateString } from 'lib';

import './toggle.style.scss';

const Toggle = (props) => {
  const { checked, disabled, onValueChange, id } = props;
  const componentId = id || generateString();
  let className = 'toggle';
  if (disabled) {
    className += ' toggle--disabled';
  }

  if (checked) {
    className += ' toggle--checked';
  }
  return (
    <div className={className}>
      <input
        type="checkbox"
        id={componentId}
        checked={checked}
        onChange={onValueChange}
        value={checked}
      />
      <label htmlFor={componentId}>
        <span>{checked ? 'On' : 'Off'}</span>
      </label>
    </div>
  );
};

Toggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onValueChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  id: PropTypes.string,
};

Toggle.defaultProps = {
  id: '',
  disabled: false,
};

export default Toggle;
