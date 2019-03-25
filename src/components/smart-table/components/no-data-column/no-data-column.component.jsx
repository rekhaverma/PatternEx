import React from 'react';
import PropTypes from 'prop-types';
import { Cell, Column } from 'fixed-data-table-2';
import { FormattedMessage } from 'react-intl';

export const NoDataColumn = props => (
  <Column
    columnKey="id"
    header={
      <Cell className="no-data">
        <div className={`${props.className}__no-data`}>
          <FormattedMessage id="global.nodata" />
        </div>
      </Cell>
    }
    width={props.width - 100}
  />
);

NoDataColumn.propTypes = {
  width: PropTypes.number.isRequired,
  className: PropTypes.string,
};

NoDataColumn.defaultProps = {
  className: 'smart-table',
};
