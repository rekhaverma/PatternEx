import React from 'react';
import PropTypes from 'prop-types';

/**
 * Check if the cell should be highlighted or not
 *
 *  If the settings object includes the pipeline,
 * check if the clicked cell tag UUID is equal with
 * settings pipeline's value
 *
 * @param {Object} settings   The active prop
 * @param {*} field           The tag UUID
 * @param {*} id              The row ID (pipeline)
 */
const isCellHighlighted = (settings, field, id) => {
  if (Object.keys(settings).includes(id)) {
    const rowHighlight = settings[id];
    if (rowHighlight.includes(field)) {
      return true;
    }
  }
  return false;
};

/**
 * Check if the cell is active or not
 *
 *  If the settings object includes the pipeline,
 * check if the clicked cell tag UUID is equal with
 * settings pipeline's value
 *
 * Sample settings object:
 *  {
 *    'sipdip': 'tag UUID'
 *  }
 *
 * @param {Object} settings   The active prop
 * @param {*} field           The tag UUID
 * @param {*} id              The row ID (pipeline)
 * @return {Boolean}
 */
const isCellActive = (settings, field, id) => {
  if (Object.keys(settings).includes(id)) {
    const rowActive = settings[id];
    if (rowActive === field) {
      return true;
    }
  }
  return false;
};

const HeatMapCell = (props) => {
  let finalClassName = props.className;
  const active = isCellActive(props.active, props.field, props.row.id);
  const highlighted = isCellHighlighted(props.highlighted, props.field, props.row.id);

  if (active === true || props.severity === props.activeSeverity) {
    finalClassName += `--${props.severity} +active`;
  } else if (highlighted === true) {
    finalClassName += `--${props.severity} +highlight +${props.opacity} ${Object.keys(props.active).length !== 0 ? '+opacity' : ''}`;
  } else if (props.cell.length > 0) {
    finalClassName += `--${props.severity} +${props.opacity} ${Object.keys(props.active).length !== 0 || Object.keys(props.highlighted).length !== 0 ? '+opacity' : ''}`;
  }

  return (
    <span className={finalClassName} onClick={props.onClick}>
      {props.cell.length === 0 ? '-' : props.cell.length}
    </span>
  );
};
HeatMapCell.propTypes = {
  'active': PropTypes.object,
  'activeSeverity': PropTypes.string,
  'className': PropTypes.string,
  'cell': PropTypes.any.isRequired,
  'field': PropTypes.string,
  'highlighted': PropTypes.object,
  'opacity': PropTypes.number,
  'row': PropTypes.object,
  'severity': PropTypes.string,
  'onClick': PropTypes.func,
};
HeatMapCell.defaultProps = {
  'active': {},
  'activeSeverity': '',
  'className': 'heatMap__cell',
  'field': '',
  'highlighted': {},
  'opacity': 1,
  'row': {},
  'severity': '',
  'onClick': () => null,
};

export default HeatMapCell;
