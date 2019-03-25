import React from 'react';
import PropTypes from 'prop-types';

import LogStat from './components/log-stat.component';

import './logs-stats.style.scss';

const LogsStats = (props) => {
  const renderLogs = (el, index) => (
    <LogStat
      key={index}
      count={el.count}
      label={el.label}
    />
  );

  return (
    <div className="logs_stats">
      {props.logs.map(renderLogs)}
    </div>
  );
};
LogsStats.displayName = 'LogsStats';
LogsStats.propTypes = {
  'logs': PropTypes.array,
};
LogsStats.defaultProps = {
  'logs': [],
};

export default LogsStats;
