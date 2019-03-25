import React from 'react';
import PropTypes from 'prop-types';

import { SmartTable } from 'components/smart-table';

import { tableConfig } from '../../constants';

const Listing = (props) => {
  const { className, data } = props;
  return (
    <div className={`${className}__listing`}>
      <SmartTable
        tableId="log-manager/log-manager"
        hasMultiTagSearch
        data={data}
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

export default Listing;
