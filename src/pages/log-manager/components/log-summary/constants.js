export const headerContent = [
  {
    i18n: 'logManager.logSources',
    field: 'logSources',
  },
  {
    i18n: 'logManager.noOfEvents',
    field: 'noEvents',
  },
  {
    i18n: 'logManager.noOfEntities',
    field: 'noEntities',
  },
  {
    i18n: 'logManager.storage',
    field: 'storage',
  },
  {
    i18n: 'logManager.firstIngestion',
    field: 'firstIngestion',
  },
  {
    i18n: 'logManager.lastUpdate',
    field: 'lastUpdate',
  },
];

export const tableConfig = [
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'logSummarySource',
    'hidden': false,
    'label': 'Log Source',
    'resizable': true,
    'alwaysVisible': true,
    'intl': 'logManager.table.source',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'logSummaryNoEvents',
    'cellClass': 'full-width',
    'hidden': false,
    'label': 'No. of Events',
    'resizable': true,
    'intl': 'logManager.table.noEvents',
    'width': 200,
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'logSummaryStorage',
    'cellClass': 'full-width',
    'hidden': false,
    'label': 'Storage',
    'resizable': true,
    'intl': 'logManager.table.storage',
    'width': 200,
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'logSummaryFirstIngestion',
    'hidden': false,
    'label': 'First Ingestion',
    'resizable': true,
    'intl': 'logManager.table.firstIngestion',
    'width': 270,
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'logSummaryLastUpdate',
    'hidden': false,
    'label': 'Last Update',
    'resizable': true,
    'intl': 'logManager.table.lastUpdate',
    'width': 270,
  },
];
