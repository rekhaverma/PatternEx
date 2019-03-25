import React from 'react';
import PropTypes from 'prop-types';

const Input = props => (
  <input {...props} />
);

Input.displayName = 'Input';
Input.propTypes = {
  'autoFocus': PropTypes.bool,
  'className': PropTypes.string,
  'disabled': PropTypes.bool,
  'id': PropTypes.string,
  'name': PropTypes.string,
  'onClick': PropTypes.func,
  'onMouseEnter': PropTypes.func,
  'onMouseLeave': PropTypes.func,
  'onSubmit': PropTypes.func,
  'onChange': PropTypes.func,
  'onKeyPress': PropTypes.func,
  'placeholder': PropTypes.string,
  'style': PropTypes.object,
  'type': PropTypes.string,
  'value': PropTypes.any,
};
Input.defaultProps = {
  'autoFocus': false,
  'className': 'input',
  'disabled': false,
  'id': '',
  'name': '',
  'onClick': () => {},
  'onMouseEnter': () => {},
  'onMouseLeave': () => {},
  'onSubmit': () => {},
  'onChange': () => {},
  'onKeyPress': () => {},
  'placeholder': '',
  'style': {},
  'type': 'text',
  'value': '',
};

export default Input;
