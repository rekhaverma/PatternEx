import React from 'react';
import PropTypes from 'prop-types';

const ExpandedRow = props => (
  <div className={`${props.className}__expandedRow`}>
    <div className={`${props.className}__expandedRow__metas`}>
      {
        props.metas.map(meta => (
          <p key={meta.key} className={`${props.className}__expandedRow__meta`}>
            <span className={`${props.className}__expandedRow__meta--highlight`}>{meta.key}</span>
            <span>{meta.value}</span>
          </p>
        ))
      }
    </div>
    <div className={`${props.className}__expandedRow__actions`}>
      {
        props.actions.map(action => (
          <span key={action.label} onClick={action.click}>{action.label}</span>
        ))
      }
    </div>
  </div>
);
ExpandedRow.propTypes = {
  'actions': PropTypes.array,
  'className': PropTypes.string,
  'metas': PropTypes.array,
};
ExpandedRow.defaultProps = {
  'actions': [],
  'className': 'table',
  'metas': [],
};

export default ExpandedRow;
