import React from 'react';
import PropTypes from 'prop-types';

import './tag.style.scss';

const Tag = props => ((
  <div className={props.className}>
    <span>{props.label}</span>
    {props.onRemove && (
      <span
        className={`${props.className}__remove icon-Trash-icon`}
        onClick={props.onRemove}
      />
    )}
  </div>
));

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  className: PropTypes.string,
};

Tag.defaultProps = {
  onRemove: false,
  className: 'advanced-tag',
};

export default Tag;
