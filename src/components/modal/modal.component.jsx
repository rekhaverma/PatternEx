import React from 'react';
import PropTypes from 'prop-types';

import { isEmpty } from 'lodash';

import './modal.style.scss';

const standardStyle = {
  'width': '650px',
};

const Modal = props => (
  <div className={props.className}>
    <div
      className={`${props.className}__content`}
      style={!isEmpty(props.style) ? props.style : standardStyle}
    >
      {props.children}
    </div>
  </div>
);
Modal.propTypes = {
  'className': PropTypes.string,
  'children': PropTypes.any,
  'style': PropTypes.object,
};
Modal.defaultProps = {
  'className': 'ptrx-modal',
  'type': '',
  'children': <span />,
  'style': {},
};

export default Modal;

