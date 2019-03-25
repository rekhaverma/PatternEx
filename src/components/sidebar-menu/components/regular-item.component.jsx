import React from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';

const saveToLocal = (key, value) => localStorage.setItem(key, value);

const RegularItem = props => (
  <div
    className={props.active ? `${props.className} +active` : props.className}
    onClick={props.disabled
      ? () => null
      : () => {
        if (Object.keys(props.query).length > 0 && props.params.length > 0) {
          Object.keys(pick(props.query, props.params))
            .map(key => saveToLocal(key, props.query[key]));
        }
        props.onClick(props.id);
      }}
    style={props.style}
  >
    { props.icon && <span className={`${props.className}__icon ${props.icon}`} /> }
    {
      props.label && (
        <p className={`${props.className}__label`}>{props.label}</p>
      )
    }
  </div>
);
RegularItem.propTypes = {
  'active': PropTypes.bool,
  'className': PropTypes.string.isRequired,
  'disabled': PropTypes.bool,
  'id': PropTypes.string.isRequired,
  'icon': PropTypes.string,
  'label': PropTypes.string,
  'style': PropTypes.object,
  'query': PropTypes.object,
  'params': PropTypes.array,
  'onClick': PropTypes.func,
};
RegularItem.defaultProps = {
  'active': false,
  'disabled': false,
  'icon': '',
  'label': '',
  'style': {},
  'query': {},
  'params': [],
  'onClick': () => null,
};

export default RegularItem;
