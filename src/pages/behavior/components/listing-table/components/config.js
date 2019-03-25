export const suspiciousConfig = [
  {
    'className': 'table__headerColumn',
    'isKey': true,
    'field': 'id',
    'hidden': true,
    'label': 'Id',
    'resizable': false,
    'intl': 'behavior.suspicious.table.id',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'sip',
    'hidden': false,
    'label': 'Source IP',
    'resizable': true,
    'tooltip': 'investigate',
    'intl': 'behavior.suspicious.table.sip',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'dip',
    'hidden': false,
    'label': 'Destination IP',
    'resizable': true,
    'tooltip': 'investigate',
    'intl': 'behavior.suspicious.table.dip',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'domain',
    'hidden': false,
    'label': 'Domain',
    'resizable': true,
    'tooltip': 'investigate',
    'intl': 'behavior.suspicious.table.domain',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'uid',
    'hidden': false,
    'label': 'UID',
    'resizable': true,
    'intl': 'behavior.suspicious.table.uid',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'user',
    'hidden': false,
    'label': 'User',
    'resizable': true,
    'intl': 'behavior.suspicious.table.user',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'type',
    'hidden': false,
    'label': 'Entity',
    'resizable': true,
    'intl': 'behavior.suspicious.table.type',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'related_entities',
    'hidden': false,
    'label': 'Related Entities',
    'resizable': true,
    'intl': 'behavior.suspicious.table.related_entities',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'alias_name',
    'hidden': false,
    'label': 'Model Alias',
    'resizable': true,
    'title': true,
    'intl': 'behavior.suspicious.table.alias_name',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'method_score',
    'hidden': false,
    'label': 'Score',
    'resizable': true,
    'intl': 'behavior.suspicious.table.method_score',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'create_time',
    'hidden': false,
    'label': 'Processed Date',
    'resizable': true,
    'intl': 'behavior.suspicious.table.create_time',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'start_time',
    'hidden': false,
    'label': 'Log Date',
    'resizable': true,
    'intl': 'behavior.suspicious.table.start_time',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'tactic',
    'hidden': true,
    'label': 'Tactic',
    'resizable': true,
    'tooltip': 'investigate',
    'intl': 'behavior.suspicious.table.tactic',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'description',
    'hidden': true,
    'label': 'Description',
    'resizable': true,
    'intl': 'behavior.suspicious.table.description',
  },
  {
    'className': 'table__headerColumn--actions',
    'isKey': false,
    'field': 'actions',
    'hidden': false,
    'label': 'Actions',
    'resizable': true,
    'sort': false,
    'intl': 'behavior.suspicious.table.actions',
  },
];

export const maliciousConfig = [
  {
    'className': 'table__headerColumn',
    'isKey': true,
    'field': 'id',
    'hidden': true,
    'label': 'Id',
    'resizable': false,
    'intl': 'behavior.malicious.table.id',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'sip',
    'hidden': false,
    'label': 'Source IP',
    'resizable': true,
    'tooltip': 'investigate',
    'intl': 'behavior.malicious.table.sip',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'dip',
    'hidden': false,
    'label': 'Destination IP',
    'resizable': true,
    'tooltip': 'investigate',
    'intl': 'behavior.malicious.table.dip',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'domain',
    'hidden': false,
    'label': 'Domain',
    'resizable': true,
    'tooltip': 'investigate',
    'intl': 'behavior.malicious.table.domain',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'uid',
    'hidden': false,
    'label': 'UID',
    'resizable': true,
    'intl': 'behavior.malicious.table.uid',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'user',
    'hidden': false,
    'label': 'User',
    'resizable': true,
    'intl': 'behavior.malicious.table.user',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'type',
    'hidden': false,
    'label': 'Entity',
    'resizable': true,
    'intl': 'behavior.malicious.table.type',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'related_entities',
    'hidden': false,
    'label': 'Related Entities',
    'resizable': true,
    'intl': 'behavior.malicious.table.related_entities',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'alias_name',
    'hidden': false,
    'label': 'Model Alias',
    'resizable': true,
    'title': true,
    'intl': 'behavior.malicious.table.alias_name',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'score',
    'hidden': false,
    'label': 'Score',
    'resizable': true,
    'intl': 'behavior.malicious.table.score',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'create_time',
    'hidden': false,
    'label': 'Processed Date',
    'resizable': true,
    'intl': 'behavior.malicious.table.create_time',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'tactic',
    'hidden': false,
    'label': 'Tactic',
    'resizable': true,
    'intl': 'behavior.malicious.table.tactic',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'description',
    'hidden': false,
    'label': 'Description',
    'resizable': true,
    'intl': 'behavior.malicious.table.description',
  },
  {
    'className': 'table__headerColumn--actions',
    'isKey': false,
    'field': 'actions',
    'hidden': false,
    'label': 'Actions',
    'resizable': true,
    'sort': false,
    'intl': 'behavior.malicious.table.actions',
  },
];
