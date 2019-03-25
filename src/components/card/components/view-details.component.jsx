import React from 'react';
import PropTypes from 'prop-types';

const ViewDetails = (props) => {
  if (props.text !== '') {
    return (
      <span
        className={props.className}
        onClick={props.onClick}
      >
        {props.text}
      </span>
    );
  }

  return (
    <span
      className={props.className}
      onClick={props.onClick}
    >
      <span>view details</span>
      <span className="icon-arrow-right" />
    </span>
  );
};
ViewDetails.displayName = 'ViewDetails';
ViewDetails.propTypes = {
  'className': PropTypes.string,
  'text': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  'onClick': PropTypes.func,
};
ViewDetails.defaultProps = {
  'className': 'inline-footer',
  'text': '',
  'onClick': () => null,
};

export default ViewDetails;
