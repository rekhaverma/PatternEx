import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'components/forms';

const PredefinedOptions = ({
  activeOption,
  className,
  options,
  onClick,
  ...props
}) => (
  <ul className={className}>
    {
      options.map(el => (
        <li
          className={el.id === activeOption ? `${className}__element +active` : `${className}__element`}
          key={el.id}
        >
          <span onClick={() => onClick(el.id)}>
            {el.label}
          </span>
        </li>
      ))
    }
    {
      props.hasButtons && (
        <div>
          <Button className="button--success +small" onClick={props.onApply}>
            <span>Apply</span>
          </Button>
          <Button
            className="button--dark +small"
            style={{ 'marginLeft': 15 }}
            onClick={props.onCancel}
          >
            <span>Cancel</span>
          </Button>
        </div>
      )
    }
  </ul>
);
PredefinedOptions.displayName = 'PredefinedOptions';
PredefinedOptions.propTypes = {
  'activeOption': PropTypes.string,
  'className': PropTypes.string.isRequired,
  'options': PropTypes.array,
  'hasButtons': PropTypes.bool,
  'onApply': PropTypes.func,
  'onCancel': PropTypes.func,
  'onClick': PropTypes.func,
};
PredefinedOptions.defaultProps = {
  'activeOption': '',
  'options': [],
  'hasButtons': false,
  'onApply': e => e.preventDefault(),
  'onCancel': e => e.preventDefault(),
  'onClick': e => e.preventDefault(),
};

export default PredefinedOptions;
