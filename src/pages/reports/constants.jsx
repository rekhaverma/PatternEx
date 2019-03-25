import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Tooltip from 'components/tooltip';
import moment from 'moment';
import { dateFormats } from 'config';

export const reportsColumns = [
  {
    'label': 'Name',
    'field': 'name',
    'isKey': true,
    'columnTitle': true,
    'intl': 'reports.table.name',
  },
  {
    'label': 'Module',
    'field': 'pipeline',
    'isKey': false,
    'columnTitle': true,
    'intl': 'reports.table.pipeline',
  },
  {
    'label': 'Last Updated',
    'field': 'update_time',
    'isKey': false,
    'columnTitle': true,
    'intl': 'reports.table.update_time',
    'dataFormat': (cell, row) =>
      moment.utc(row.update_time, 'X').format(dateFormats.longFormatWithTimeZoneAMPM),
  },
  {
    'label': 'Actions',
    'field': 'id',
    'intl': 'reports.table.id',
    'dataFormat': (cell, row) => (
      <span className="report-actions">
        <Tooltip
          position="bottom"
          trigger={(
            <span className="icon-edit" onClick={e => row.handlers.onEdit(e, row)} />
          )}
        >
          <FormattedHTMLMessage
            id="reports.details"
          />
        </Tooltip>
        <Tooltip
          position="bottom"
          trigger={(
            <span className="icon-trash-outline" onClick={e => row.handlers.onDelete(e, row)} />
          )}
        >
          <FormattedHTMLMessage
            id="reports.delete"
          />
        </Tooltip>
      </span>
    ),
    'isKey': false,
    'width': '100px',
    'columnTitle': false,
  },
];

export const modes = [{ 'id': 'batch', 'content': 'Batch' }, { 'id': 'realtime', 'content': 'Realtime' }];
export const allPipelines = [{ 'id': '', 'content': 'Select Pipeline' }];
export const formFieldsToValidate = ['name', 'rules'];
