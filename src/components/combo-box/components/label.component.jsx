import React from 'react';
import PropTypes from 'prop-types';

const OptionLabel = props => (
  <div className={props.className}>
    <span>{props.text}</span>
    {
      props.hasCancel && (
        <span
          className="icon-close"
          onClick={props.onCancel}
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
  'onCancel': PropTypes.func,
};
OptionLabel.defaultProps = {
  'className': 'comboBox__label',
  'hasCancel': false,
  'text': 'Untitled label',
  'onCancel': () => null,
};

export default OptionLabel;
