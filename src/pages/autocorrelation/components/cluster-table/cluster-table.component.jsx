import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { Scrollbars } from 'react-custom-scrollbars';
import Table from 'components/table';

import './cluster-table.style.scss';

const clusterColumns = [
  {
    'className': 'table__headerColumn',
    'isKey': true,
    'field': 'central_entity',
    'hidden': false,
    'label': 'Central Entity',
    'width': '200px',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'counts',
    'hidden': false,
    'label': 'Details',
    'dataFormat': (cell, row) => (
      <span className="clusterTable__cell">
        { Object.keys(row.counts).map(key => (
          <span key={`key-${key}`} className="clusterTable__count">
            <span className={`icon-${key}`} />
            {parseInt(row.counts[key], 10)}
          </span>
        ))}
      </span>
    ),
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'ts',
    'hidden': false,
    'label': 'Timestamp',
    'width': '100px',
    'dataFormat': cell => <span>{moment.utc(cell).format('YYYY - MM - DD')}</span>,
  },
];

const ClusterTable = props => (
  <Scrollbars
    autoHeight
    autoHeightMax={props.clientHeight}
  >
    <Table
      className="table"
      columns={clusterColumns}
      customTrClassName="clusterTable__row"
      activeCluster={props.activeCluster}
      data={props.data}
      options={props.options}
      expandableRow={() => false}
      expandComponent={() => null}
    />
  </Scrollbars>
);
ClusterTable.propTypes = {
  'clientHeight': PropTypes.number.isRequired,
  'data': PropTypes.array,
  'options': PropTypes.object,
  'activeCluster': PropTypes.string,
};
ClusterTable.defaultProps = {
  'data': [],
  'options': {},
  'activeCluster': '',
};

export default ClusterTable;
