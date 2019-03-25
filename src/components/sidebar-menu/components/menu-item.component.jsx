import React from 'react';
import PropTypes from 'prop-types';

const MenuItem = props => (
  <div
    className={props.active ? `${props.className} +active` : props.className}
    onClick={props.disabled ? () => null : () => props.onClick(props.id)}
  >
    { props.icon && <span className={props.icon} /> }
    {
      props.title && (
        <span>{props.title}</span>
      )
    }
    { props.hasSubmenu && <span className="icon-chevron-down" />}
  </div>
);
MenuItem.displayName = 'MenuItem';
MenuItem.propTypes = {
  'active': PropTypes.bool,
  'id': PropTypes.string,
  'className': PropTypes.string,
  'disabled': PropTypes.bool,
  'hasSubmenu': PropTypes.bool,
  'icon': PropTypes.string,
  'title': PropTypes.string,
  'onClick': PropTypes.func,
};
MenuItem.defaultProps = {
  'active': false,
  'className': 'menu1__item',
  'disabled': false,
  'hasSubmenu': false,
  'icon': '',
  'id': '',
  'title': '',
  'onClick': () => null,
};

export default MenuItem;
