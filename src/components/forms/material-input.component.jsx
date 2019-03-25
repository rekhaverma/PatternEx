import React from 'react';
import PropTypes from 'prop-types';

const MaterialInput = (props) => {
  const { label, className, inputOptions, errorMessage } = props;
  return (
    <div className={`${className}`}>
      <input {...inputOptions} className={`${className}__input`} required />
      <label htmlFor={inputOptions.id} className={`${className}__label`}>{label}</label>
      {errorMessage && (
        <div className={`${className}__error-message`}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

MaterialInput.displayName = 'Input';
MaterialInput.propTypes = {
  'inputOptions': PropTypes.shape({
    'autoFocus': PropTypes.bool,
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
  }),
  'className': PropTypes.string,
  'errorMessage': PropTypes.string,
  'label': PropTypes.string,
};
MaterialInput.defaultProps = {
  'label': 'Label',
  'className': 'materialInput',
  'errorMessage': '',
  'inputOptions': {
    'autoFocus': false,
    'disabled': false,
    'id': '',
    'name': '',
    'onClick': () => {
    },
    'onMouseEnter': () => {
    },
    'onMouseLeave': () => {
    },
    'onSubmit': () => {
    },
    'onChange': () => {
    },
    'onKeyPress': () => {
    },
    'placeholder': '',
    'style': {},
    'type': 'text',
    'value': '',
  },
};

export default MaterialInput;
