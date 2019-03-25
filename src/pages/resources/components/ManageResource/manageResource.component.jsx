import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modal';
import { Button } from 'components/forms';
import { FormattedHTMLMessage } from 'react-intl';

import './manageResource.style';

const ManageResource = props => (
  <div className="addDeactivateResource" >
    <Modal>
      <div className="addDeactivateResource__row +header +spaceBetween +borderBottom">
        Manage Resources
        <span
          className="icon-close2"
          onClick={props.onCancel}
        />
      </div>
      <div className="addDeactivateResource__row addDeactivateResource__mainBody">
        <FormattedHTMLMessage
          id="resource.manageResource"
          values={{
            'type': props.type,
            'name': props.data.name,
          }}
        />
      </div>
      <div className="addDeactivateResource__row +right">
        <Button className="button--success +small" onClick={props.onSubmit}>
          <FormattedHTMLMessage
            id="resource.activateDeactivate"
            values={{
              'type': props.type,
            }}
          />
        </Button>
        <Button className="button--dark +small" onClick={props.onCancel}>
          <FormattedHTMLMessage
            id="resource.cancel"
          />
        </Button>
      </div>
    </Modal>
  </div>
);

ManageResource.propTypes = {
  'type': PropTypes.oneOf(['activate', 'deactivate', 'delete']).isRequired,
  'data': PropTypes.object.isRequired,
  'onCancel': PropTypes.func.isRequired,
  'onSubmit': PropTypes.func.isRequired,
};

export default ManageResource;
