import React from 'react';
import PropTypes from 'prop-types';
import { Cell, Column } from 'fixed-data-table-2';

const NoDataColumn = props => (
  <Column
    columnKey="id"
    header={
      <Cell className="no-data">There is no data to display</Cell>
    }
    width={props.width}
  />
);

NoDataColumn.displayName = 'NoDataColumn';

NoDataColumn.propTypes = {
  'width': PropTypes.number.isRequired,
};

export default NoDataColumn;
