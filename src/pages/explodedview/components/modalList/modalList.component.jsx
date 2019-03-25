import React from 'react';
import PropTypes from 'prop-types';

import './modalList.style.scss';

const ModalList = props => (
  <div className={props.className}>
    <div className={`${props.className}__header`}>
      <span>{props.title}</span>
      <span className="icon-close" onClick={props.onClose} />
    </div>
    <div className={`${props.className}__content`} >
      {props.children}
    </div>
  </div>
);
ModalList.propTypes = {
  'className': PropTypes.string,
  'title': PropTypes.oneOfType([
    PropTypes.string, PropTypes.object,
  ]),
  'onClose': PropTypes.func,
  'children': PropTypes.any,
};
ModalList.defaultProps = {
  'className': 'modalList',
  'title': {},
  'onClose': () => null,
  'children': <span />,
};

export default ModalList;
