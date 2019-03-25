import React from 'react';
import PropTypes from 'prop-types';

import './inspect-modal.style.scss';

const InspectModal = props => (
  <div className={`inspect-modal +${props.bevahior}`}>
    <h3>{props.name}</h3>
    <p>{props.description}</p>
  </div>
);
InspectModal.displayName = 'InspectModal';
InspectModal.propTypes = {
  'bevahior': PropTypes.string,
  'description': PropTypes.string.isRequired,
  'name': PropTypes.string.isRequired,
};
InspectModal.defaultProps = {
  'bevahior': 'suspicious',
};

export default InspectModal;
