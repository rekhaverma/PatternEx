import React from 'react';
import PropTypes from 'prop-types';
import { Input, Textarea, Button } from 'components/forms';
import { FormattedMessage } from 'react-intl';
import Modal from 'components/modal';
import SelectBox from 'components/select-box';

const EditLabelModal = props => (
  <Modal>
    <div className="editLabel">
      <h2>Set label for {props.data.entity_name}
        <span className="icon-close" onClick={props.onCancel} />
      </h2>
      <div className="editLabel__row">
        <div className="editLabel__row--tactics">
          <SelectBox
            singleSelect
            activeOption={props.data.tag_id}
            options={props.tags}
            placeholder="Tactics"
            onClick={value => props.onChange('tag_id', value)}
          />
        </div>
        <div className="editLabel__row--status">
          <SelectBox
            singleSelect
            activeOption={props.data.status}
            options={props.status}
            placeholder="Status"
            onClick={value => props.onChange('status', value)}
          />
        </div>
      </div>
      <div className="editLabel__row">
        <Input
          className="input--v2"
          placeholder="Weight"
          value={props.data.weight || ''}
          onChange={value => props.onChange('weight', value.target.value)}
        />
      </div>
      <div className="editLabel__row">
        <Textarea
          className="textarea"
          placeholder="Description"
          rows={5}
          value={props.data.description || ''}
          onChange={value => props.onChange('description', value.target.value)}
        />
      </div>
      <div className="action">
        <Button className="delete" onClick={() => props.onSuccess(props.data.id)}>
          <FormattedMessage id="labels.save" />
        </Button>
        <Button className="cancel" onClick={props.onCancel}>
          <FormattedMessage id="labels.cancel" />
        </Button>
      </div>
    </div>
  </Modal>
);

EditLabelModal.propTypes = {
  'data': PropTypes.object.isRequired,
  'onCancel': PropTypes.func.isRequired,
  'onSuccess': PropTypes.func.isRequired,
  'onChange': PropTypes.func.isRequired,
  'status': PropTypes.array.isRequired,
  'tags': PropTypes.array.isRequired,
};


export default EditLabelModal;
