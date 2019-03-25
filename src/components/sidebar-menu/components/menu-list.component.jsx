import React from 'react';
import PropTypes from 'prop-types';

import MenuItem from './menu-item.component';

const MenuList = props => (
  <div>
    {
      props.list.map(item => (
        <div key={item.id}>
          <MenuItem
            {...item}
            active={item.id === props.active}
            className={props.openItem === item.id ? 'menu1__item +open' : 'menu1__item'}
            hasSubmenu={item.items.length > 0}
            onClick={item.items.length > 0 ? props.onOpen : props.onClick}
          />
          {
            props.openItem === item.id
            && item.items.length > 0
            && item.items.map((subItem) => {
              if (Object.keys(subItem).includes('label')) {
                if (props.privileges[subItem.label]
                && props.privileges[subItem.label].read) {
                  return (
                    <MenuItem
                      {...subItem}
                      key={subItem.id}
                      active={subItem.id === props.active}
                      className="menu1__item +subitem"
                      onClick={props.onClick}
                    />
                  );
                }
                return null;
              }

              return (
                <MenuItem
                  {...subItem}
                  key={subItem.id}
                  active={subItem.id === props.active}
                  className="menu1__item +subitem"
                  onClick={props.onClick}
                />
              );
            })
          }
        </div>
      ))
    }
  </div>
);
MenuList.displayName = 'MenuList';
MenuList.propTypes = {
  'active': PropTypes.string,
  'openItem': PropTypes.string,
  'list': PropTypes.array,
  'onClick': PropTypes.func,
  'onOpen': PropTypes.func,
};
MenuList.defaultProps = {
  'active': '',
  'openItem': '',
  'list': [],
  'onClick': () => null,
  'onOpen': () => null,
};

export default MenuList;
