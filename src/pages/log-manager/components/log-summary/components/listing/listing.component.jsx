import React from 'react';
import PropTypes from 'prop-types';

import { SmartTable } from 'components/smart-table';

import { tableConfig } from '../../constants';
import { ExpandedRow } from '../expanded-row/expanded-row.component';

export const Listing = (props) => {
  const { className, data } = props;
  const dataWithExpandData = data.map(item => ({
    ...item,
    expandedData: (
      <ExpandedRow
        data={Object.keys(item.logSummaryEntities).map(key => ({
          title: key,
          value: item.logSummaryEntities[key],
        }))}
        className={className}
      />
    ),
  }));
  return (
    <div className={`${className}__listing`}>
      <SmartTable
        tableId="log-manager/log-summary"
        hasMultiTagSearch
        acceptExpand
        expandedHeight={155}
        data={dataWithExpandData}
        tableConfig={tableConfig}
      />
    </div>
  );
};

Listing.propTypes = {
  data: PropTypes.array.isRequired,
  className: PropTypes.string,
};

Listing.defaultProps = {
  className: 'log-manager',
};
