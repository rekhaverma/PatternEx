import React from 'react';
import { omit } from 'lodash';

/* eslint-disable react/prop-types */
export default (Component, label) => (
  (props) => {
    const className = props.hasLabel > 0
      ? 'formGroup +no-bottom'
      : 'formGroup';
    return (
      <div className={className}>
        <span className="formGroup__label">{label}</span>
        <Component {...omit(props, 'hasLabel')} />
      </div>
    );
  }
);
