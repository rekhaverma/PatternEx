import React from 'react';
import PropTypes from 'prop-types';

import { VALUES_PROP, LABEL_HISTORY, DOMAIN_INFO_RESOLUTIONS } from '../constants.jsx';

const ListItem = (props) => {
  if (props.type === VALUES_PROP) {
    return (
      <div className={`${props.customClass}`}>{props.data}</div>
    );
  }

  return (
    <div className={`${props.customClass}`}>
      <div className={`${props.customClass}__key`} >
        { props.type === LABEL_HISTORY &&
        [props.data.canBeDeleted ?
          <span className="icon-Trash-icon" key={`icon-${props.data.labelId}`} onClick={() => { props.handlers.deleteLabel(props.data.labelId); }} />
        :
          <span className="icon-Trash-icon +disabled" key={`icon-${props.data.labelId}`} />,
        ]
      }
        <span className={`${props.customClass}__key__label`} >
          <span>{props.data.name}</span>
          {(props.data.value !== '' && props.type !== DOMAIN_INFO_RESOLUTIONS) && <span>:</span> }
        </span>
      </div>
      <span className={`${props.customClass}__value`}>{props.data.value}</span>
    </div>
  );
};

ListItem.displayName = 'ListItem';
ListItem.propTypes = {
  'data': PropTypes.any.isRequired,
  'type': PropTypes.string.isRequired,
  'customClass': PropTypes.string,
  'handlers': PropTypes.object,
};

ListItem.defaultProps = {
  'customClass': '',
  'handlers': {},
};

export default ListItem;
