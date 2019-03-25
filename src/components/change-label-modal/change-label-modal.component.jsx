import React from 'react';
import PropTypes from 'prop-types';
import { MaterialInput, Button, Textarea, Select } from 'components/forms';

import './change-label-modal.style.scss';

const ChangeModal = props => (
  <div className={props.className}>
    <div className={`${props.className}__header`}>
      <span>{props.title}</span>
      <span className="icon-close" onClick={props.onCancel} />
    </div>
    <div className={`${props.className}__content`}>
      <div className={`${props.className}__row`}>
        <div className={`${props.className}__cell`}>
          <Select
            showLabel
            placeholder="Tactic"
            active={props.selectedLabel}
            options={props.tags}
            onItemClick={props.onItemClick}
          />
        </div>
        <div className={`${props.className}__cell`}>
          <MaterialInput
            inputOptions={{
              value: props.weight,
              type: 'text',
              onChange: props.onWeightChange,
              id: 'addLabelWeight',
            }}
            label="Weight (Default: 1)"
          />
        </div>
      </div>
      <div className={`${props.className}__row`}>
        <Textarea
          className="textarea"
          placeholder="Description"
          rows={5}
          value={props.description}
          onChange={props.onDescriptionChange}
        />
      </div>
      <div className={`${props.className}__row +right`}>
        <Button
          className="button--success"
          onClick={props.onSave}
        >
          Save
        </Button>
        <Button
          className="button"
          onClick={props.onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
);
ChangeModal.propTypes = {
  'className': PropTypes.string,
  'tags': PropTypes.array.isRequired,
  'selectedLabel': PropTypes.string,
  'weight': PropTypes.string.isRequired,
  'description': PropTypes.string.isRequired,
  'title': PropTypes.object,
  'onItemClick': PropTypes.func,
  'onSave': PropTypes.func,
  'onCancel': PropTypes.func,
  'onWeightChange': PropTypes.func,
  'onDescriptionChange': PropTypes.func,
};
ChangeModal.defaultProps = {
  'className': 'changeModal',
  'selectedLabel': '',
  'title': {},
  'onSave': () => null,
  'onCancel': () => null,
  'onItemClick': () => null,
  'onWeightChange': () => null,
  'onDescriptionChange': () => null,
};

export default ChangeModal;

