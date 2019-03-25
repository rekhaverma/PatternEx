import React from 'react';
import PropTypes from 'prop-types';

import './entity-card.style.scss';

const EntityCard = props => (
  <div className={props.className} data-id={props.id}>
    { props.icon !== '' && <span className={`${props.icon} ${props.className}__icon`} />}
    { props.label }
    <span
      className={props.active === true
        ? `${props.className}__radio +active`
        : `${props.className}__radio`
      }
      data-id={props.id}
      onClick={props.onClick}
    />
  </div>
);
EntityCard.propTypes = {
  'active': PropTypes.bool,
  'className': PropTypes.string,
  'id': PropTypes.string.isRequired,
  'icon': PropTypes.string,
  'label': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  'onClick': PropTypes.func,
};
EntityCard.defaultProps = {
  'active': false,
  'className': 'entityCard',
  'icon': '',
  'onClick': () => null,
};

export default EntityCard;
