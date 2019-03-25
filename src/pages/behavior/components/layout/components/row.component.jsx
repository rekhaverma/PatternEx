import React from 'react';
import PropTypes from 'prop-types';

const Row = ({
  className,
  customClass,
  children,
  style,
}) => (
  <div className={`${className} ${customClass}`} style={style}>
    {children}
  </div>
);
Row.displayName = 'Row';
Row.propTypes = {
  'className': PropTypes.string,
  'customClass': PropTypes.string,
  'children': PropTypes.any.isRequired,
  'style': PropTypes.object,
};
Row.defaultProps = {
  'className': 'behaviorLayout__row',
  'customClass': '',
  'style': {},
};

export default Row;
