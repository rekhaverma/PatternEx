import React from 'react';
import { Button } from 'components/forms';
import Tooltip from 'components/tooltip';
import LoaderSmall from 'components/loader/loader-small.component';

// sipdip -> sip, dip
// sip -> sip
// dip -> dip
// domain -> domain
// sipdomain -> sip, domain
// hpa -> ip addr
// request -> URL, sip

const tooltipDataFormat = cell => (
  <span className="table__cell">
    <Tooltip
      position="bottom"
      trigger={<div className="table_ellipsis">{cell}</div>}
    >

      <div className="table_ellipsis">{cell}</div>
    </Tooltip>
  </span>
);

const tooltipUsersDataFormat = (cell, row) => {
  const placeholder = (length, users) => {
    if (length >= 2) {
      return (() => <span>Many (<span className="manyCount">{length}</span>)</span>)();
    }
    return users;
  };

  let users = [];
  let keys = [];
  if (row.map_users) {
    keys = Object.keys(row.map_users);
  } else if (row.src_ip_65_map_users) {
    keys = Object.keys(row.src_ip_65_map_users);
  }
  users = keys.map(key => <span key={key}>{key} </span>);

  return (
    <span className="table__cell">
      <Tooltip
        position="bottom"
        trigger={(<div className="table_ellipsis">{placeholder(keys.length, users)}</div>)}
      >

        <div className="table_ellipsis">{users}</div>
      </Tooltip>
    </span>
  );
};

export const buildTableColumns = (pipeline, modelType, selectedFeatures, topFeatureColumn) => [
  {
    'className': 'table__headerColumn',
    'isKey': true,
    'field': 'hash',
    'hidden': true,
    'label': 'Hash',
    'width': '0px',
    'intl': 'pipeline.table.hash',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'url',
    'hidden': !(pipeline === 'request'),
    'label': 'URL',
    'dataFormat': tooltipDataFormat,
    'intl': 'pipeline.table.url',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'srcip',
    'hidden': !(pipeline === 'sip'
      || pipeline === 'sipdip'
      || pipeline === 'sipdomain'
      || pipeline === 'request'),
    'label': 'Source IP',
    'dataFormat': tooltipDataFormat,
    'intl': 'pipeline.table.srcip',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'user',
    'hidden': !(pipeline === 'useraccess'),
    'label': 'User',
    'dataFormat': tooltipDataFormat,
    'intl': 'pipeline.table.user',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'dstip',
    'hidden': !(pipeline === 'dip'
      || pipeline === 'sipdip'),
    'label': 'Destination IP',
    'dataFormat': tooltipDataFormat,
    'intl': 'pipeline.table.dstip',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'domain',
    'hidden': !(pipeline === 'domain'
      || pipeline === 'sipdomain'),
    'label': 'Domain',
    'dataFormat': tooltipDataFormat,
    'intl': 'pipeline.table.domain',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'ip',
    'hidden': !(pipeline === 'hpa'),
    'label': 'IP Address',
    'dataFormat': tooltipDataFormat,
    'intl': 'pipeline.table.ip',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'description',
    'hidden': false,
    'label': 'Description',
    'dataFormat': tooltipDataFormat,
    'intl': 'pipeline.table.description',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'map_users',
    'hidden': pipeline === 'useraccess',
    'label': 'Users',
    'dataFormat': tooltipUsersDataFormat,
    'intl': 'pipeline.table.map_users',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'predicted_tag_name',
    'hidden': !(modelType === 'classifier'),
    'label': 'Prediction',
    'dataFormat': tooltipDataFormat,
    'intl': 'pipeline.table.predicted_tag_name',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'predicted_prob',
    'hidden': !(modelType === 'classifier'),
    'label': 'Attack Probability',
    'intl': 'pipeline.table.predicted_prob',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'score',
    'hidden': !(modelType === 'ranking'),
    'label': 'Outlier Score',
    'intl': 'pipeline.table.score',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'feedback_tag_name',
    'hidden': false,
    'label': 'Feedback',
    'intl': 'pipeline.table.feedback_tag_name',
    'dataFormat': (cell, row) => (
      <span className="table__cell">
        {
          row.showLoader && (
            <div className="loaderSmall">
              <LoaderSmall />
            </div>)
        }
        {
          !row.showLoader && row.user_tag.label_id === null &&
            <Button
              className="button--success +small +tableButton"
              onClick={e => row.handlers.setLabel(e, row)}
            >
          Set Label
            </Button>
        }
        {
          !row.showLoader && row.user_tag.label_id !== null &&
          (
            <span>{row.user_tag.name}
              <span
                className="icon-Trash-icon"
                onClick={e => row.handlers.deleteLabel(e, row)}
              />
            </span>
          )
        }
      </span>
    ),
    'width': '150px',
  },
  {
    'className': 'table__headerColumn +noPadding',
    'isKey': false,
    'field': 'top_features',
    'hidden': false,
    'label': topFeatureColumn(),
    'thStyle': { overflow: 'visible', 'display': 'flex', 'flex': 1 },
    'dataFormat': (cell, row) => (
      <span className="table__cell">
        {
          row.top_features.length > 0
            ? row.top_features.map(el => (
              <Tooltip
                key={el.displayName}
                position="bottom"
                trigger={(
                  <span
                    key={el.name}
                    className="pipeline__feature"
                    style={{ 'color': selectedFeatures.includes(el.name) ? 'white' : 'inherit' }}
                  >
                    {`${el.displayName} (${el.count})`}
                  </span>
                  )
                }
              >
                {`${el.displayName} (${el.count})`}
              </Tooltip>
            ))
            : <span style={{ margin: '0 auto' }}>No top features</span>
        }
      </span>
    ),
    'width': '435px',
  },
];
