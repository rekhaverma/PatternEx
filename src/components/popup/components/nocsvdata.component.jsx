import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/forms';

import { connect } from 'react-redux';
import { setPopup } from 'model/actions/ui.actions';

export const NoCSVData = props => (
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
        onClick={() => props.onClick('')}
      >
        Ok
      </Button>
    </div>
  </div>
);
NoCSVData.propTypes = {
  'className': PropTypes.string,
  'onClick': PropTypes.func,
  'text': PropTypes.any.isRequired,
};
NoCSVData.defaultProps = {
  'className': '',
  'onClick': () => {},
};

export const mapDispatchToProps = dispatch => ({
  'onClick': (...args) => dispatch(setPopup(...args)),
});

export default connect(null, mapDispatchToProps)(NoCSVData);
