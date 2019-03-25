import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';

import { dateFormats } from 'config';

import { Header } from './components/header/header.component';
import { Filter } from './components/filter/filter.component';
import { Listing } from './components/listing/listing.component';
import { TimelineGraph } from './components/timeline-graph';

// import D3ProgressBar from './components/progress-chart';

class LogSummary extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onDateUpdate = this.onDateUpdate.bind(this);
  }

  onDateUpdate(startDate, endDate) {
    const format = dateFormats.apiSendFormat; // used to fix eslint max-length issue
    const utcStartDate = !startDate.isUTC() ? moment.utc(startDate.format(format)) : startDate;
    const utcEndDate = !endDate.isUTC() ? moment.utc(endDate.format(format)) : endDate;
    const date = {
      startDate: utcStartDate.startOf('day'),
      endDate: utcEndDate.endOf('day'),
    };
    this.props.getSummaryData(date);
    this.props.onDateUpdate(date.startDate, date.endDate);
  }


  render() {
    const {
      className,
      startDate,
      endDate,
      summaryData,
    } = this.props;

    return (
      <div className={`${className}--log-summary`}>
        <Header
          data={summaryData.headerData}
          className={className}
        />
        <Filter
          isLoading={this.props.summaryDataLoading}
          startDate={startDate}
          endDate={endDate}
          onDateUpdate={this.onDateUpdate}
          className={className}
        />
        <TimelineGraph
          isLoading={this.props.summaryDataLoading}
          startDate={startDate}
          endDate={endDate}
          data={summaryData.graphData}
        />
        <Listing
          data={summaryData.tableData}
          className={className}
        />
      </div>
    );
  }
}

LogSummary.propTypes = {
  startDate: momentPropTypes.momentObj.isRequired,
  endDate: momentPropTypes.momentObj.isRequired,
  onDateUpdate: PropTypes.func.isRequired,
  getSummaryData: PropTypes.func.isRequired,
  summaryDataLoading: PropTypes.bool.isRequired,
  summaryData: PropTypes.shape({
    headerData: PropTypes.object.isRequired,
    tableData: PropTypes.array.isRequired,
    graphData: PropTypes.array.isRequired,
  }).isRequired,
  className: PropTypes.string,
};

LogSummary.defaultProps = {
  className: 'log-manager',
};

export default LogSummary;
