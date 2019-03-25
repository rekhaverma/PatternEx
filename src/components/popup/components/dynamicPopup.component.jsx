import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/forms';

const DynamicPopup = props => (
  <div className={props.className}>
    <div className={`${props.className}__content`}>
      {
        React.isValidElement(props.text) ? (
          React.cloneElement(props.text)
        ) : (
          <span>{props.text}</span>
        )
      }
      <Button
        className="button"
        style={{ 'width': 100 }}
        onClick={props.onClick}
      >
        Ok
      </Button>
    </div>
  </div>
);
DynamicPopup.propTypes = {
  'className': PropTypes.string,
  'onClick': PropTypes.func.isRequired,
  'text': PropTypes.any.isRequired,
};
DynamicPopup.defaultProps = {
  'className': '',
  'onClick': () => {},
};

export default DynamicPopup;
