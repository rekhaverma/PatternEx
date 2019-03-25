import React from 'react';
import PropTypes from 'prop-types';

const OptionLabel = props => (
  <div className={props.className}>
    <span>{props.text}</span>
    {
      props.hasCancel && (
        <span
          className="icon-close"
          onClick={props.onClose}
        />
      )
    }
  </div>
);
OptionLabel.displayName = 'OptionLabel';
OptionLabel.propTypes = {
  'className': PropTypes.string,
  'hasCancel': PropTypes.bool,
  'text': PropTypes.string,
  'onClose': PropTypes.func,
};
OptionLabel.defaultProps = {
  'className': 'multipleSelectBox__label',
  'hasCancel': false,
  'text': 'Untitled label',
  'onClose': () => null,
};

export default OptionLabel;
