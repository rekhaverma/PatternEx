import React from 'react';
import PropTypes from 'prop-types';

import './back-to.style.scss';

const BackTo = props => (
  <div className={props.className} onClick={props.onClick}>
    <span className={`${props.className}__icon ${props.icon}`} />
    <div className={`${props.className}__container`}>
      <p>{props.text}</p>
    </div>
  </div>
);
BackTo.displayName = 'BackTo';
BackTo.propTypes = {
  'className': PropTypes.string,
  'icon': PropTypes.string,
  'text': PropTypes.string,
  'onClick': PropTypes.func,
};
BackTo.defaultProps = {
  'className': 'backToBtn',
  'icon': 'icon-chevron-left',
  'text': 'Back to Dashboard',
  'onClick': () => null,
};

export default BackTo;
