import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/forms';
import Modal from 'components/modal';
import { FormattedMessage } from 'react-intl';

const DeleteLabelModal = props => (
  <Modal>
    <div className="deleteModal">
      <h2 className="deleteModal__heading">
        Delete label for {props.data.entity_name}
        <span className="deleteModal__heading--close icon-close" onClick={props.onCancel} />
      </h2>
      <p className="deleteModal__text">
        Are you sure you want to delete label for {props.data.entity_name} ?
      </p>
      <div className="action">
        <Button className="delete" onClick={() => props.onSuccess(props.data.id)}>
          <FormattedMessage id="labels.delete" />
        </Button>
        <Button className="cancel" onClick={props.onCancel}>
          <FormattedMessage id="labels.cancel" />
        </Button>
      </div>
    </div>
  </Modal>
);

DeleteLabelModal.propTypes = {
  'data': PropTypes.object.isRequired,
  'onCancel': PropTypes.func.isRequired,
  'onSuccess': PropTypes.func.isRequired,
};

export default DeleteLabelModal;
