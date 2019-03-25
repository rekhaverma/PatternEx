import React from 'react';
import PropTypes from 'prop-types';

import List from '../../components/list';

const PerformanceDetails = props => (
  <section className="dashboard__content +withGradient +column">
    <List rowsData={props.rowsData} mostRecentDate={props.mostRecentDate} />
  </section>
);

PerformanceDetails.propTypes = {
  'rowsData': PropTypes.object.isRequired,
  'mostRecentDate': PropTypes.string.isRequired,
};

export default PerformanceDetails;
