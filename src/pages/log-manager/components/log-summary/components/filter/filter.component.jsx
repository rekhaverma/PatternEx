import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';

import DateRange from 'components/date-range';
import LoaderSmall from 'components/loader/loader-small.component';

export const Filter = (props) => {
  const {
    className,
    startDate,
    endDate,
    isLoading,
    onDateUpdate,
  } = props;
  return (
    <div className={`${className}__filter`}>

      <div className={`${className}__filter-date-range`}>
        <DateRange
          id="date-range"
          startDate={startDate}
          endDate={endDate}
          updateDateRange={onDateUpdate}
          showHoursList={false}
        />
      </div>
      <div className={`${className}__filter-multi-search`}>
        <div className={`${className}__filter-loader`}>
          {isLoading && <LoaderSmall />}
        </div>
      </div>
    </div>
  );
};

Filter.propTypes = {
  startDate: momentPropTypes.momentObj.isRequired,
  endDate: momentPropTypes.momentObj.isRequired,
  onDateUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

Filter.defaultProps = {
  className: 'log-manager',
};
