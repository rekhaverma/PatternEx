import React from 'react';
import PropTypes from 'prop-types';
import Table from 'components/table-v2';

import './cluster-table.style.scss';

const clusterColumns = [
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'ts_formatted',
    'hidden': false,
    'label': 'Timestamp',
    'resizable': true,
    'tooltip': 'investigateCluster',
  },
  {
    'className': 'table__headerColumn--entity',
    'isKey': true,
    'field': 'central_entity',
    'hidden': false,
    'label': 'Central Entity',
    'resizable': true,
    'tooltip': 'investigateCluster',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'counts',
    'hidden': false,
    'label': 'Details',
    'resizable': true,
    'tooltip': 'investigateCluster',
  },
];

const ClusterTable = props => (
  <Table
    className="table"
    tableConfig={clusterColumns}
    data={props.data}
    pageSize="10"
  />
);
ClusterTable.propTypes = {
  'data': PropTypes.array,
};
ClusterTable.defaultProps = {
  'data': [],
  'options': {},
  'activeCluster': '',
};

export default ClusterTable;
