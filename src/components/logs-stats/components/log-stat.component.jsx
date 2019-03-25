import React from 'react';
import PropTypes from 'prop-types';

const LogStat = ({ count, label }) => (
  <div className="logs_stats__item">
    <span className="highlighted">{count}</span>
    {label}
  </div>
);

LogStat.displayName = 'LogStat';
LogStat.propTypes = {
  'count': PropTypes.number,
  'label': PropTypes.oneOfType([
    PropTypes.string, PropTypes.element,
  ]),
};
LogStat.defaultProps = {
  'count': 0,
  'label': {},
};

export default LogStat;
