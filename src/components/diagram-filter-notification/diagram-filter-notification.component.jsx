import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as d3 from 'd3';

import './diagram-filter-notification.style.scss';

const FilterNotification = ({ date, clearFilter }) => {
  const formatedDate = moment.utc(date).format('MM · DD · YYYY');

  if (d3.select('.popper-wrap')) {
    d3.selectAll('.popper-wrap').remove();
  }

  return (
    <div className="filter_notification">
      <div className="filter_notification__close">
        <span className="icon-close" onClick={clearFilter} />
      </div>
      <span className="filter_notification__info">Showing Results for {formatedDate}</span>
    </div>
  );
};

FilterNotification.displayName = 'FilterNotification';
FilterNotification.propTypes = {
  'date': PropTypes.object,
  'clearFilter': PropTypes.func.isRequired,
};
FilterNotification.defaultProps = {
  'date': {},
};

export default FilterNotification;
