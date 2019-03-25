import React from 'react';
import PropTypes from 'prop-types';

const createClassName = (props) => {
  if (props.isActive) {
    return `${props.className} +active`;
  }
  if (!props.isEnabled) {
    return `${props.className} +disabled`;
  }
  return props.className;
};

const Option = ({
  content,
  onClick,
  subOptions,
  ...props
}) => (
  <span
    className={createClassName(props)}
    data-id={props.id}
    onClick={props.isEnabled ? onClick : null}
  >
    <p className="multi-step-select__option__optionName" style={props.style} title={content}>
      { content }
      {
          subOptions.length > 0 && <span className="icon-chevron-right" />
      }
    </p>
  </span>
);
Option.displayName = 'Option';
Option.propTypes = {
  'className': PropTypes.string,
  'id': PropTypes.string.isRequired,
  'isActive': PropTypes.bool,
  'isEnabled': PropTypes.bool,
  'content': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  'subOptions': PropTypes.array,
  'onClick': PropTypes.func.isRequired,
  'style': PropTypes.object,
};
Option.defaultProps = {
  'className': 'multi-step-select__option',
  'isActive': false,
  'isEnabled': true,
  'subOptions': [],
  'style': {},
};

export default Option;
