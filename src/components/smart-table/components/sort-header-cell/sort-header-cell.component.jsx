import React from 'react';
import PropTypes from 'prop-types';
import { Cell } from 'fixed-data-table-2';

import { reverseSortDirection } from '../../utils';
import { sortTypes } from '../../constants';

export const SortHeaderCell = (props) => {
  const { onSortChange, sortDirection, children, columnKey, className } = props;
  let sortClass = 'icon-sort';

  if (sortDirection) {
    sortClass = sortDirection === sortTypes.DESC ? 'icon-sort-desc' : 'icon-sort-asc';
  }

  const onSortChangeHandler = () => {
    onSortChange(columnKey, reverseSortDirection(sortDirection));
  };

  return (
    <Cell
      className={`${className}__header-cell ${className}__header-cell--sortable`}
      onClick={onSortChangeHandler}
    >
      {children}
      <span className={sortClass} />
    </Cell>
  );
};
SortHeaderCell.propTypes = {
  sortDirection: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  columnKey: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

SortHeaderCell.defaultProps = {
  children: null,
  columnKey: '',
  className: 'smart-table',
};
