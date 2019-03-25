import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cell } from 'fixed-data-table-2';

import './sort-header-cell.style.scss';

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

class SortHeaderCell extends Component {
  constructor(props) {
    super(props);

    this.onSortChange = this.onSortChange.bind(this);
  }

  onSortChange(e) {
    e.preventDefault();
    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDirection ?
          reverseSortDirection(this.props.sortDirection) :
          SortTypes.DESC,
      );
    }
  }

  render() {
    const { onSortChange, sortDirection, children, ...props } = this.props;
    let sortClass = 'icon-sort';

    if (sortDirection) {
      sortClass = sortDirection === SortTypes.DESC ? 'icon-sort-desc' : 'icon-sort-asc';
    }

    return (
      <Cell
        className="table-v2-header"
        onClick={this.onSortChange}
        {...props}
      >
        {children}
        <span className={sortClass} />
      </Cell>
    );
  }
}

SortHeaderCell.displayName = 'SortHeaderCell';

SortHeaderCell.propTypes = {
  'sortDirection': PropTypes.string.isRequired,
  'onSortChange': PropTypes.func.isRequired,
  'columnKey': PropTypes.string,
  'children': PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

SortHeaderCell.defaultProps = {
  'children': null,
  'columnKey': '',
};

export default SortHeaderCell;
