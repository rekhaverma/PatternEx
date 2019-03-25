import React from 'react';
import PropTypes from 'prop-types';

const Tag = (props) => {
  let item = props.value;
  let removable = true;
  let className = props.className;
  if (typeof item === 'object') {
    item = item.label;
    removable = item.removable;
    className += ` ${props.className}--sticky`;
  }

  return (
    <div className={className}>
      <span>{item}</span>
      { removable && <span className="icon-remove" onClick={props.onRemove} /> }
    </div>
  );
};

Tag.propTypes = {
  onRemove: PropTypes.func.isRequired,
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

Tag.defaultProps = {
  className: '',
  value: '',
};

export default Tag;
