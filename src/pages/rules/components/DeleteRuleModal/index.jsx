import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/forms';
import Modal from 'components/modal';
import { FormattedMessage } from 'react-intl';

const DeleteRuleModal = props => (
  <Modal>
    <div className="ruleDeleteModal">
      <div className="ruleDeleteModal__header">
        <span className="big-heading">
          <FormattedMessage
            id="rule.deleteRule.title"
            values={{
              'ruleName': props.data.name,
            }}
          />
        </span>
        <span className="ruleDeleteModal__header--close icon-close" onClick={props.onCancel} />
      </div>
      <p className="ruleDeleteModal__text">
        <FormattedMessage
          id="rule.deleteRule.confirmation"
          values={{
            'ruleName': props.data.name,
          }}
        />
      </p>
      <div className="ruleDeleteModal__action">
        <Button
          className="button--success +small delete"
          onClick={() => props.onSuccess(props.data.id)}
        >
          <FormattedMessage id="rule.delete" />
        </Button>
        <Button className="button--dark +small cancel" onClick={props.onCancel}>
          <FormattedMessage id="rule.cancel" />
        </Button>
      </div>
    </div>
  </Modal>
);

DeleteRuleModal.propTypes = {
  'data': PropTypes.object.isRequired,
  'onCancel': PropTypes.func.isRequired,
  'onSuccess': PropTypes.func.isRequired,
};

export default DeleteRuleModal;
