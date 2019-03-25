import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/forms';

import './popup.style.scss';

const Popup = props => (
  <div className={props.className}>
    <div className={`${props.className}__content`}>
      <span>No data found.</span>
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
Popup.displayName = 'Popup';
Popup.propTypes = {
  'className': PropTypes.string,
  'onClick': PropTypes.func.isRequired,
};
Popup.defaultProps = {
  'className': 'listingTablePopup',
};

export default Popup;
