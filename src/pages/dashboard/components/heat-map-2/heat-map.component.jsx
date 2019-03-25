import React from 'react';
import PropTypes from 'prop-types';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import './heat-map.style.scss';

const HeatMap = props => (
  <div>
    <BootstrapTable
      data={props.data}
      options={{
        ...props.options,
      }}
      headerContainerClass={props.headerContainerClass}
    >
      {
        props.columns.map(el => (
          <TableHeaderColumn
            dataFormat={el.dataFormat}
            dataField={el.field}
            hidden={el.hidden}
            key={el.field}
            isKey={el.isKey}
            width={el.width ? el.width : undefined}
            columnClassName={el.className}
            thStyle={{ 'textAlign': 'center', 'whiteSpace': 'normal' }}
            tdStyle={{ 'textAlign': 'center' }}
          >
            {el.label}
          </TableHeaderColumn>
        ))
      }
    </BootstrapTable>
  </div>
);
HeatMap.propTypes = {
  'columns': PropTypes.array.isRequired,
  'data': PropTypes.array.isRequired,
  'options': PropTypes.object.isRequired,
  'headerContainerClass': PropTypes.string,
};
HeatMap.defaultProps = {
  'headerContainerClass': 'heatMap__header',
};

export default HeatMap;
