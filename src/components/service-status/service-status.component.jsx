import React from 'react';
import PropTypes from 'prop-types';

import StatusItem from './components/status-item.component';

import './service-status.style.scss';

const ServiceStatus = ({ states, ...props }) => (
  <div className={props.className}>
    {states.sort((a, b) => a.order - b.order).map((el, index) => (
      <StatusItem
        key={`status-${index}`}
        className={`${props.className}__item`}
        name={el.name}
        serviceState={el.running}
      />
    ))}
  </div>
);
ServiceStatus.propTypes = {
  'className': PropTypes.string,
  'states': PropTypes.arrayOf(PropTypes.shape({
    'name': PropTypes.string.isRequired,
    'state': PropTypes.string.isRequired,
    'running': PropTypes.string.isRequired,
  })).isRequired,
};
ServiceStatus.defaultProps = {
  'className': 'serviceStatus',
};

export default ServiceStatus;
