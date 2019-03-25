import React from 'react';
import { pipelineToName } from 'lib/decorators';
import { FormattedHTMLMessage } from 'react-intl';
import Tooltip from 'components/tooltip';

export const rulesColumns = [
  {
    'label': 'Name',
    'field': 'name',
    'isKey': true,
    'columnTitle': true,
  },
  {
    'label': 'Module',
    'field': 'pipeline',
    'dataFormat': (cell, row) => (
      pipelineToName(row.pipeline)
    ),
    'isKey': false,
    'columnTitle': true,
  },
  {
    'label': 'Last Updated',
    'field': 'update_time',
    'isKey': false,
    'columnTitle': true,
  },
  {
    'label': 'Actions',
    'field': 'id',
    'dataFormat': (cell, row) => (
      <span className="report-actions">
        <Tooltip
          position="bottom"
          trigger={(
            <span
              className="icon-edit"
              onClick={(e) => {
                e.stopPropagation();
                row.handlers.onEdit(e, row, 'Edit');
              }}
            />
          )}
        >
          <FormattedHTMLMessage
            id="rule.details"
          />
        </Tooltip>
        <Tooltip
          position="bottom"
          trigger={(
            <span
              className="icon-trash-outline"
              onClick={(e) => {
                e.stopPropagation();
                row.handlers.onDelete(e, row);
              }}
            />
          )}
        >
          <FormattedHTMLMessage
            id="rule.delete"
          />
        </Tooltip>
      </span>
    ),
    'isKey': false,
    'width': '100px',
    'columnTitle': false,
  },
];
