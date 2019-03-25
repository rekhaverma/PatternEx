import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

const Button = props => (
  <button
    {...omit(props, ['children'])}
  >
    {props.children}
  </button>
);
Button.displayName = 'Button';
Button.propTypes = {
  'children': PropTypes.any.isRequired,
};

export default Button;
