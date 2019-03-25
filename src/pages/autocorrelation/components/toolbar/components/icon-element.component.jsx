import React from 'react';
import PropTypes from 'prop-types';

const openIcon = 'icon-chevron-down';

const ToolbarIcon = ({
  active,
  className,
  name,
  onClick,
  ...props
}) => (
  <span
    className={active
      ? `${className}__icon +active`
      : `${className}__icon`
    }
    data-name={name}
    onClick={onClick}
  >
    <span className={active ? props.backIcon : openIcon} />
  </span>
);
ToolbarIcon.propTypes = {
  'active': PropTypes.bool,
  'backIcon': PropTypes.string.isRequired,
  'className': PropTypes.string.isRequired,
  'name': PropTypes.string.isRequired,
  'onClick': PropTypes.func.isRequired,
};
ToolbarIcon.defaultProps = {
  'active': false,
};

export default ToolbarIcon;
