import React from 'react';
import moment from 'moment';
import { FormattedHTMLMessage } from 'react-intl';
import Tooltip from 'components/tooltip';
import { dateFormats } from 'config';

export const labelsColumns = [
  {
    'label': 'Entity Name',
    'field': 'entity_name',
    'isKey': true,
    'columnTitle': true,
    'intl': 'labels.table.entity_name',
  },
  {
    'label': 'Tactic Name',
    'field': 'tactic',
    'isKey': false,
    'width': '200px',
    'columnTitle': true,
    'intl': 'labels.table.tactic',
  },
  {
    'label': 'Entity',
    'field': 'pipelinev2',
    'isKey': false,
    'width': '150px',
    'columnTitle': true,
    'intl': 'labels.table.pipelinev2',
  },
  {
    'label': 'Type',
    'field': 'type',
    'isKey': false,
    'width': '100px',
    'columnTitle': true,
    'intl': 'labels.table.type',
  },
  {
    'label': 'Status',
    'field': 'status',
    'isKey': false,
    'width': '100px',
    'columnTitle': true,
    'intl': 'labels.table.status',
  },
  {
    'label': 'Timestamp',
    'field': 'start_time_x',
    'dataFormat': (cell, row) => moment.utc(row.start_time_x, 'X').format(dateFormats.longFormatWithOffset),
    'isKey': false,
    'width': '350px',
    'columnTitle': true,
    'intl': 'labels.table.start_time_x',
  },
  {
    'label': 'Actions',
    'field': 'id',
    'intl': 'labels.table.id',
    'dataFormat': (cell, row) => (
      <span className="report-actions">
        <Tooltip
          position="bottom"
          trigger={(
            <span className="icon-edit" onClick={e => row.handlers.onEdit(e, row)} />
          )}
        >
          <FormattedHTMLMessage
            id="labels.details"
          />
        </Tooltip>
        <Tooltip
          position="bottom"
          trigger={(
            <span className="icon-trash-outline" onClick={e => row.handlers.onDelete(e, row)} />
          )}
        >
          <FormattedHTMLMessage
            id="labels.delete"
          />
        </Tooltip>
      </span>
    ),
    'isKey': false,
    'width': '100px',
    'columnTitle': false,
  },
];

export const allPipelines = [{ 'id': '', 'content': 'All Entities' }];
