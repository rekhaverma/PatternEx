import React from 'react';

import noData from 'public/images/no_data.png';

const SuspiciousNoData = () => (
  <div className="suspicious-widget__no-data">
    <img src={noData} alt="No Data" />
    <p>No data found</p>
  </div>
);
SuspiciousNoData.displayName = 'SuspiciousNoData';

export default SuspiciousNoData;
