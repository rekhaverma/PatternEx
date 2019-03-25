import React from 'react';
import PropTypes from 'prop-types';

const HeaderAlert = (props) => {
  let className = props.className;
  if (props.active !== '' && !props.noInactive) {
    if (props.active) {
      className = `${props.className} +active`;
    } else {
      className = `${props.className} +inactive`;
    }
  }
  return (
    <div
      className={className}
      onClick={props.onClick}
    >
      <span className={`icon-${props.image}`} />
      <p>{props.label}</p>
    </div>
  );
};
HeaderAlert.displayName = 'HeaderAlert';
HeaderAlert.propTypes = {
  'active': PropTypes.bool,
  'noInactive': PropTypes.bool,
  'className': PropTypes.string,
  'image': PropTypes.oneOf([
    'malicious',
    'suspicious',
    'unknown',
  ]),
  'label': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  'onClick': PropTypes.func,
};
HeaderAlert.defaultProps = {
  'active': false,
  'noInactive': true,
  'className': 'header1__alert',
  'image': 'malicious',
  'label': '',
  'onClick': () => null,
};

export default HeaderAlert;
