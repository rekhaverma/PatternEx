import React from 'react';
import PropTypes from 'prop-types';
import { pipelineToName, mapIcons, seedTypeToName } from 'lib';

const getCellIcon = (rowType, text) => (
  rowType === 'pipeline' ? pipelineToName(text) : seedTypeToName(text)
);

const HeatMapCellIcon = (props) => {
  let output = props.isText === true
    ? getCellIcon(props.rowType, props.id)
    : mapIcons(props.id);

  if (props.isText === false && output === '') {
    output = 'icon-unknown';
  }

  return props.isText === true
    ? (
      <span>
        {getCellIcon(props.rowType, props.id)}
      </span>
    ) : (
      <span className={output} />
    );
};
HeatMapCellIcon.propTypes = {
  'id': PropTypes.string.isRequired,
  'isText': PropTypes.bool,
  'rowType': PropTypes.string.isRequired,
};
HeatMapCellIcon.defaultProps = {
  'isText': false,
};

export default HeatMapCellIcon;

