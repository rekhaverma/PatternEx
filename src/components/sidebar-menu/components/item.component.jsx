import React from 'react';
import PropTypes from 'prop-types';

import LinkItem from './link-item.component';
import DropdownItem from './dropdown-item.component';
import RegularItem from './regular-item.component';

const Item = (props) => {
  switch (props.type) {
    case 'link':
      return <LinkItem {...props} />;

    case 'dropdown':
      return <DropdownItem {...props} />;

    default:
      return <RegularItem {...props} />;
  }
};
Item.propTypes = {
  'className': PropTypes.string,
  'type': PropTypes.string,
  'active': PropTypes.bool,
  'disabled': PropTypes.bool,
  'id': PropTypes.string,
  'icon': PropTypes.string,
  'label': PropTypes.string,
  'style': PropTypes.object,
  'query': PropTypes.object,
  'params': PropTypes.array,
  'onClick': PropTypes.func,
  'location': PropTypes.string,
  'activeDropdown': PropTypes.bool,
  'items': PropTypes.array,
  'onDropdownClick': PropTypes.func,
};
Item.defaultProps = {
  'className': 'sidebarMenu__item',
  'type': '',
  'active': false,
  'activeDropdown': false,
  'disabled': false,
  'icon': '',
  'label': '',
  'items': [],
  'onClick': () => null,
  'onDropdownClick': () => null,
  'style': {},
  'query': {},
  'params': [],
  'location': '',
  'id': '',
};

export default Item;
