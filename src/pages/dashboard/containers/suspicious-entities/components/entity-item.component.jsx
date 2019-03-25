import React from 'react';
import PropTypes from 'prop-types';

import { HeatMapCellIcon } from '../../../components/heat-map-2';

const EntityItem = props => (
  <div>
    <div
      className={props.active ? 'entity__item +active' : 'entity__item'}
      onClick={() => props.onClick(props.icon)}
    >
      <div className="entity__group">
        <HeatMapCellIcon id={props.icon} />
        <div className="entity__details">
          <span className="highlight">{props.amount}</span>
          <span>{props.label}</span>
        </div>
      </div>
      <span className={props.active ? 'icon-chevron-up' : 'icon-chevron-down'} />
    </div>
    <div className={props.active ? 'entity__table +active' : 'entity__table'}>
      {props.active && props.content}
    </div>
  </div>
);
EntityItem.propTypes = {
  'icon': PropTypes.string,
  'amount': PropTypes.number,
  'label': PropTypes.string,
  'onClick': PropTypes.func,
  'content': PropTypes.any.isRequired,
  'active': PropTypes.bool,
};
EntityItem.defaultProps = {
  'icon': '',
  'amount': 0,
  'label': '',
  'onClick': () => null,
  'active': false,
};

export default EntityItem;
