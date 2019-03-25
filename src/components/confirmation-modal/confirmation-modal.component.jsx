import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Modal from 'components/modal/modal.component';
import { Button } from 'components/forms';

import './confirmation-modal.style.scss';

export const ConfirmationModal = (props) => {
  const { className, message, modalWidth, onConfirmation, onDecline } = props;
  return (
    <Modal style={{ width: modalWidth }}>
      <div className={className}>
        <div className={`${className}__content`}>
          <FormattedMessage id={message} />
        </div>
        <div className={`${className}__footer`}>
          <Button
            className="button +small"
            onClick={onConfirmation}
          >
            <FormattedMessage id="global.yes" />
          </Button>
          <Button
            className="button--success +small"
            onClick={onDecline}
          >
            <FormattedMessage id="global.no" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirmation: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  modalWidth: PropTypes.string.isRequired,
  className: PropTypes.string,
};

ConfirmationModal.defaultProps = {
  className: 'confirmation-modal',
};
