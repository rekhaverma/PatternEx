import React from 'react';
import PropTypes from 'prop-types';

import './nx-circle.style.scss';

const NXCircle = props => (
  <div className="nxcircle">
    <span>
      <span className="nxcircle__number">{props.domains.length}</span>
      <span>NX Domains</span>
    </span>
  </div>
);

NXCircle.displayName = 'NXCircle';
NXCircle.propTypes = {
  'domains': PropTypes.array,
};

NXCircle.defaultProps = {
  'domains': [],
};

export default NXCircle;

