import React from 'react';
import PropTypes from 'prop-types';

import './listing-table.style.scss';

import MaliciousListing from './components/malicious-listing.component';
import SuspiciousListing from './components/suspicious-listing.component';

const ListingTable = props => (
  <div>
    {
      props.type === 'malicious' ? (
        <MaliciousListing {...props} />
      ) : (
        <SuspiciousListing {...props} />
      )
    }
  </div>
);
ListingTable.propTypes = {
  'type': PropTypes.string,
};
ListingTable.defaultProps = {
  'type': 'malicious',
};

export default ListingTable;

