import React from 'react';
import moment from 'moment';
import { dateFormats } from 'config';

export const resourceColumns = [
  {
    'label': 'Name',
    'field': 'name',
    'isKey': true,
    'columnTitle': true,
  },
  {
    'label': 'Description',
    'field': 'description',
    'isKey': false,
    'columnTitle': true,
  },
  {
    'label': 'URL',
    'field': 'url',
    'isKey': false,
    'columnTitle': true,
  },
  {
    'label': 'Created on',
    'field': 'create_time_x',
    'dataFormat': (cell, row) => (
      moment.utc(row.create_time_x, 'X')
        .format(dateFormats.longFormatWithUTC)
    ),
    'isKey': false,
    'columnTitle': true,
    'width': '180px',
  },
  {
    'label': 'Created by',
    'field': 'created_by_email',
    'isKey': false,
    'columnTitle': true,
  },
  {
    'label': 'Status',
    'field': 'active',
    'dataFormat': (cell, row) => (
      row.active ? <div title="Active" className="active-status">Active</div>
        : <div title="Inactive" className="in-active-status">Inactive</div>
    ),
    'isKey': false,
    'columnTitle': true,
  },
  {
    'label': 'Actions',
    'field': 'action',
    'dataFormat': (cell, row) => (
      <span>
        <span title="Edit" className="icon-edit" onClick={e => row.handlers.onEdit(e, row)} />
        <span
          title={row.active ? 'Deactivate' : 'Activate'}
          className={row.active ? 'icon-close' : 'icon-confirm'}
          onClick={e => row.handlers.manageResource(e, row, row.active ? 'deactivate' : 'activate')}
        />
        <span
          title="Delete"
          className="icon-trash-outline"
          onClick={e => row.handlers.manageResource(e, row, 'delete')}
        />
      </span>
    ),
    'isKey': false,
    'width': '150px',
    'columnTitle': false,
    'sortableColumns': false,
  },
];
