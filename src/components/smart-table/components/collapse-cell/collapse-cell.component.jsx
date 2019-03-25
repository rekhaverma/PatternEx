import React from 'react';
import PropTypes from 'prop-types';
import { Cell } from 'fixed-data-table-2';

export const CollapseCell = (props) => {
  const { rowIndex, collapsedRows, callback } = props;
  return (
    <Cell>
      <span onClick={() => callback(rowIndex)}>
        {collapsedRows.has(rowIndex) ? '\u25BC' : '\u25BA'}
      </span>
    </Cell>
  );
};

CollapseCell.propTypes = {
  collapsedRows: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired,
  rowIndex: PropTypes.number,
};

CollapseCell.defaultProps = {
  rowIndex: 0,
};
