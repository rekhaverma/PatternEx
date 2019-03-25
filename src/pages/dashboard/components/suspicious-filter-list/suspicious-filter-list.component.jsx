import React from 'react';
import PropTypes from 'prop-types';

import EntityCard from '../entity-card';

import './suspicious-filter-list.style.scss';

const SuspiciousFilterList = props => (
  <div
    className="suspiciousFilterList"
    onClick={props.onClick}
  >
    {
      props.list.map(el => (
        <EntityCard
          active={props.active === el.id}
          key={el.id}
          id={el.id}
          icon={el.icon}
          label={el.label}
          onClick={props.onClick}
        />
      ))
    }
  </div>
);
SuspiciousFilterList.propTypes = {
  'active': PropTypes.string,
  'list': PropTypes.arrayOf(PropTypes.shape({
    'id': PropTypes.string.isRequired,
    'icon': PropTypes.string,
    'label': PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
  })).isRequired,
  'onClick': PropTypes.func,
};
SuspiciousFilterList.defaultProps = {
  'active': '',
  'onClick': () => null,
};

export default SuspiciousFilterList;
