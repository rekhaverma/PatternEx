import React from 'react';
import PropTypes from 'prop-types';

import ToolbarIcon from './icon-element.component';

const ToolbarIconsBar = props => (
  <div className={`${props.className}__bar`}>
    {
      props.options.map(el => (
        <ToolbarIcon
          active={props.active === el}
          backIcon={props.backIcon}
          className={props.className}
          key={el}
          name={el}
          onClick={props.onClick}
        />
      ))
    }
  </div>
);
ToolbarIconsBar.propTypes = {
  'active': PropTypes.string,
  'backIcon': PropTypes.string.isRequired,
  'className': PropTypes.string.isRequired,
  'options': PropTypes.array,
  'onClick': PropTypes.func.isRequired,
};
ToolbarIconsBar.defaultProps = {
  'active': '',
  'options': [],
};

export default ToolbarIconsBar;
