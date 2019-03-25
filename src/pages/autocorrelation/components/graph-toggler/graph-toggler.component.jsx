import React from 'react';
import PropTypes from 'prop-types';

import TogglerItem from './components/toggler-item.component';

import './graph-toggler.style.scss';

const GraphToggler = props => (
  <div className={props.className}>
    {
      props.list.map(el => (
        <TogglerItem
          key={el.id}
          active={el.id === props.active}
          className={`${props.className}__item`}
          disabled={el.disabled}
          name={el.id}
          onClick={props.onClick}
        />
      ))
    }
  </div>
);
GraphToggler.propTypes = {
  'active': PropTypes.string.isRequired,
  'className': PropTypes.string,
  'list': PropTypes.array,
  'onClick': PropTypes.func,
};
GraphToggler.defaultProps = {
  'className': 'graphToggler',
  'list': [],
  'onClick': () => null,
};

export default GraphToggler;
