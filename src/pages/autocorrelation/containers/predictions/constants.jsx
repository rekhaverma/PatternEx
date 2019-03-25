import React from 'react';
import { mapIcons } from 'lib';

import { pipelineToName } from 'lib/decorators';
import Tooltip from 'components/tooltip';

export const predictionsColumns = [
  {
    'className': 'table__headerColumn',
    'isKey': true,
    'field': 'hash',
    'hidden': true,
    'label': 'Hash',
    'width': '0px',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'momentDay',
    'hidden': false,
    'label': 'Date',
    'width': '100px',
  },
  {
    'className': 'table__headerColumn--entity',
    'isKey': false,
    'field': 'entity_name',
    'hidden': false,
    'label': 'Entity',
    'dataFormat': (cell, row) => (
      <span className="table__cell +ellipsis">
        <span className="table__predictionEntityCell">
          <div className="table__predictionEntityCell--flex">
            <Tooltip
              trigger={(
                <span className={mapIcons(row.entity_type)} />
              )}
              position="bottom"
              key={row}
            >
              {row.entity_type ? pipelineToName(row.entity_type) : ''}
            </Tooltip>
            {row.is_central_entity &&
              <Tooltip
                trigger={(
                  <span className="icon-M-icon" />
                )}
                position="bottom"
              >
                Central entity
              </Tooltip>
            }
          </div>
        </span>
        {cell}
      </span>
    ),
    'width': '250px',
  },
  {
    'className': 'table__headerColumn--highlighted',
    'isKey': false,
    'field': 'threat',
    'hidden': false,
    'label': 'Threat Tactic',
    'width': '90px',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'score',
    'hidden': false,
    'label': 'Score',
    'width': '50px',
  },
  {
    'className': 'table__headerColumn--actions',
    'isKey': false,
    'field': 'id',
    'hidden': false,
    'label': 'Actions',
    'dataFormat': (cell, row) => (
      <span className="table__cell--actions">
        {
          row.behavior &&
          row.behavior.toLowerCase() !== 'unknown' && (
            <Tooltip
              trigger={(
                <span
                  className="icon-tab"
                  onClick={e => row.handlers.openEVP(e, row)}
                />
              )}
              position="bottom"
              key={row}
            >
              See Details
            </Tooltip>
          )
        }
        <span>
          <Tooltip
            trigger={(
              <span
                className="icon-add"
                onClick={e => row.handlers.setLabel(e, row)}
              />
            )}
            position="bottom"
            key={row}
          >
            Add Label
          </Tooltip>
        </span>
      </span>
    ),
    'width': '80px',
  },
];

export const labelsColums = [
  {
    'className': 'table__headerColumn',
    'isKey': true,
    'field': 'hash',
    'hidden': true,
    'label': 'Hash',
    'width': '0px',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'momentDay',
    'hidden': false,
    'label': 'Update Date',
    'width': '80px',
  },
  {
    'className': 'table__headerColumn--entity',
    'isKey': false,
    'field': 'entity_name',
    'hidden': false,
    'label': 'Entity',
    'dataFormat': (cell, row) => (
      <span className="table__cell +ellipsis">
        <span className="table__predictionEntityCell">
          <div className="table__predictionEntityCell--flex">
            <Tooltip
              trigger={(
                <span className={mapIcons(row.entity_type)} />
              )}
              position="bottom"
              key={row}
            >
              {row.entity_type ? pipelineToName(row.entity_type) : ''}
            </Tooltip>
            {row.is_central_entity &&
              <Tooltip
                trigger={(
                  <span className="icon-M-icon" />
                )}
                position="bottom"
              >
                Central entity
              </Tooltip>
            }
          </div>
        </span>
        {cell}
      </span>
    ),
    'width': '250px',
  },
  {
    'className': 'table__headerColumn--highlighted',
    'isKey': false,
    'field': 'threat',
    'hidden': false,
    'label': 'Threat Tactic',
    'width': '100px',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'action',
    'hidden': false,
    'label': 'Actions',
    'width': '100px',
    'dataFormat': (cell, row) => (
      <span className="table__cell">
        <span className="table__predictionEntityCell--flex +spaceBetween">
          Change Label
          <span className={row.action === true ? 'icon-confirm' : 'icon-deny'} />
        </span>
      </span>
    ),
  },
];
