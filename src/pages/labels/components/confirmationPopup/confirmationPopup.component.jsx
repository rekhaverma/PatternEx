import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/forms';
import { FormattedMessage } from 'react-intl';

import './confirmationPopup.style.scss';

const ConfirmationPopup = props => (
  <div className={props.className}>
    <div className={`${props.className}__content`}>
      <span>{props.actionText}</span>
      <Button
        className="button"
        style={{ 'width': 100 }}
        onClick={props.onSuccess}
      >
        <FormattedMessage id="labels.upload" />
      </Button>
      <Button
        className="button"
        style={{ 'width': 100 }}
        onClick={props.onCancel}
      >
        <FormattedMessage id="labels.cancel" />
      </Button>
    </div>
  </div>
);
ConfirmationPopup.displayName = 'ConfirmationPopup';
ConfirmationPopup.propTypes = {
  'className': PropTypes.string,
  'onSuccess': PropTypes.func.isRequired,
  'onCancel': PropTypes.func.isRequired,
  'actionText': PropTypes.string,
};
ConfirmationPopup.defaultProps = {
  'className': 'listingTablePopup',
  'actionText': '',
};

export default ConfirmationPopup;
