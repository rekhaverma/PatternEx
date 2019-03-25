import React from 'react';
import PropTypes from 'prop-types';

const Tag = ({ type, onClick }) => (
  <div className="tag">
    <span className={`icon-${type}`} />
    <span className="tag__close" onClick={onClick} />
  </div>
);
Tag.displayName = 'Tag';
Tag.propTypes = {
  'type': PropTypes.string,
  'onClick': PropTypes.func.isRequired,
};
Tag.defaultProps = {
  'type': 'suspicious',
};

export default Tag;
