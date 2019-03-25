import React from 'react';
import PropTypes from 'prop-types';

const TogglerItem = (props) => {
  let className = props.className;

  if (props.disabled === true) {
    className += ' +disabled';
  } else if (props.active === true) {
    className += ' +active';
  }

  return (
    <span
      className={`${className} icon-${props.name}`}
      data-name={props.name}
      onClick={props.disabled === true ? () => null : props.onClick}
    />
  );
};
TogglerItem.propTypes = {
  'active': PropTypes.bool,
  'className': PropTypes.string.isRequired,
  'disabled': PropTypes.bool,
  'name': PropTypes.string.isRequired,
  'onClick': PropTypes.func.isRequired,
};
TogglerItem.defaultProps = {
  'active': false,
  'disabled': false,
};

export default TogglerItem;
