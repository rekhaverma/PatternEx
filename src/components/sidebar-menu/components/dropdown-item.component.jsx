import React from 'react';
import PropTypes from 'prop-types';

import Item from './item.component';

const DropdownItem = props => (
  <div
    className={props.active ? `${props.className}--dropdown +active` : `${props.className}--dropdown`}
    onClick={props.disabled ? () => null : () => props.onDropdownClick(props.id)}
  >
    <div className={props.activeDropdown ? `${props.className}__dropdown-item +active` : `${props.className}__dropdown-item`}>
      { props.icon && <span className={`${props.className}__icon ${props.icon}`} /> }
      <div className={`${props.className}__dropdown-title`}>
        {
          props.label && (
            <p className={`${props.className}__label`}>{props.label}</p>
          )
        }
        <span className={`icon-chevron-down ${props.className}__arrow-icon ${props.activeDropdown ? '+rotate' : ''}`} />
      </div>
    </div>
    <div className={`${props.className}__dropdown-list ${props.activeDropdown ? `+no-items-${props.items.length}` : ''}`} >
      {
        props.items.map(el => <Item {...el} key={el.id} onClick={props.onClick} />)
      }
    </div>
  </div>
);
DropdownItem.propTypes = {
  'active': PropTypes.bool,
  'activeDropdown': PropTypes.bool,
  'className': PropTypes.string.isRequired,
  'disabled': PropTypes.bool,
  'id': PropTypes.string.isRequired,
  'icon': PropTypes.string,
  'items': PropTypes.array,
  'label': PropTypes.string,
  'onClick': PropTypes.func,
  'onDropdownClick': PropTypes.func,
};
DropdownItem.defaultProps = {
  'active': false,
  'activeDropdown': false,
  'disabled': false,
  'icon': '',
  'label': '',
  'items': [],
  'onClick': () => null,
  'onDropdownClick': () => null,
};

export default DropdownItem;
