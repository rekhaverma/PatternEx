import React from 'react';
import PropTypes from 'prop-types';

const TabCountElement = props => (
  <div
    className={props.active ? `${props.className}--count +active` : `${props.className}--count`}
    onClick={() => props.onClick(props.id)}
  >
    <span>{props.title}</span>
    <span className={props.active ? `${props.className}__delimiter +active` : `${props.className}__delimiter`} />
    <span className={`${props.className}__counter`}>{props.count}</span>
  </div>
);

TabCountElement.displayName = 'TabCountElement';
TabCountElement.propTypes = {
  'active': PropTypes.bool,
  'className': PropTypes.string,
  'count': PropTypes.any.isRequired,
  'title': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  'id': PropTypes.string,
  'onClick': PropTypes.func,
};
TabCountElement.defaultProps = {
  'active': '',
  'className': 'tabs__element',
  'title': '',
  'id': '',
  'onClick': () => null,
};

export default TabCountElement;
