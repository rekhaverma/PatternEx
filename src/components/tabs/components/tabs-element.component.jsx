import React from 'react';
import PropTypes from 'prop-types';

const TabElement = props => (
  <div
    className={props.active ? `${props.className} +active` : props.className}
    onClick={() => props.onClick(props.id)}
  >
    <span>{props.title}</span>
  </div>
);

TabElement.displayName = 'TabElement';
TabElement.propTypes = {
  'active': PropTypes.bool,
  'className': PropTypes.string,
  'title': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  'id': PropTypes.string,
  'onClick': PropTypes.func,
};
TabElement.defaultProps = {
  'active': '',
  'className': 'tabs__element',
  'title': '',
  'id': '',
  'onClick': () => null,
};

export default TabElement;
