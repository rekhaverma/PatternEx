import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import Modal from 'components/modal';
import DateRange from 'components/date-range';
import { Button } from 'components/forms';
import { FormattedMessage } from 'react-intl';
import { fetchResultSummary } from 'model/actions/rest/models.actions';
import { getEnableDates, getAvailableRTDaysFromResultSummary } from 'model/selectors';
import { isDateToday } from 'lib';
import './onDemand.scss';
import { getMinDiffHours } from '../../../pipeline/lib/utils';

export class OnDemand extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      'startDate': moment.utc(),
      'endDate': moment.utc(),
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.onApply = this.onApply.bind(this);
  }

  componentDidMount() {
    const { endDate } = this.state;
    this.handleMonthChange(endDate);
  }

  componentWillReceiveProps(nextProps) {
    const { enableDates, enableRTDates, mode } = nextProps;
    let { startDate, endDate } = this.state;
    const enableDatesSet = mode === 'batch' ? enableDates : enableRTDates.map(day => day.tsMoment.local().format('YYYYMMDD'));
    if (enableDatesSet.length > 0) {
      if (isDateToday(endDate) && enableDatesSet.indexOf(endDate.format('YYYYMMDD')) < 0) {
        endDate = moment.utc(enableDatesSet[enableDatesSet.length - 1], 'YYYYMMDD');
        startDate = moment.utc(endDate);
        this.setState({
          'startDate': startDate,
          'endDate': endDate,
        });
      }
    }
  }

  onApply() {
    const { startDate, endDate } = this.state;
    const { mode, pipeline } = this.props;
    const params = {
      'mode': mode,
      'pipeline': pipeline,
      'start_date': startDate.format('YYYY-MM-DD'),
      'end_date': endDate.format('YYYY-MM-DD'),
    };
    this.props.onApply(params);
  }

  handleDateChange(startDate, endDate) {
    this.setState({ startDate, endDate });
  }

  handleMonthChange(date) {
    const { pipeline, mode } = this.props;
    const startDayOfMonth = moment(date).startOf('month').startOf('d').subtract(1, 'month');
    const lastDayOfMonth = moment(date).endOf('month').endOf('d').add(1, 'month');
    const minDiffernceHour = getMinDiffHours();
    let params;
    if (mode === 'realtime') {
      params = {
        'mode': mode,
        'pipeline': pipeline,
        'start_time': startDayOfMonth.unix(),
        'end_time': lastDayOfMonth.unix(),
        'summary_range': parseInt(minDiffernceHour, 10) * 60,
        'fetchDayPerMonth': true,
      };
    } else {
      params = {
        'mode': mode,
        'pipeline': pipeline,
        'start_time': startDayOfMonth.subtract(30, 'd').unix(),
        'end_time': lastDayOfMonth.unix(),
      };
    }

    this.props.fetchResultSummary(params);
  }

  render() {
    const { startDate, endDate } = this.state;
    const { mode, enableDates, enableRTDates } = this.props;
    return (
      <section className="onDemand">
        <Modal>
          <div className="onDemand__row +header +spaceBetween">
            <FormattedMessage id="reports.onDemandHeading" />
            <span
              className="icon-close2"
              onClick={this.props.onCancel}
            />
          </div>
          <div className="onDemand__row">
            <DateRange
              theme="rowWithLabel"
              startDate={startDate}
              endDate={endDate}
              updateDateRange={this.handleDateChange}
              onMonthChange={this.handleMonthChange}
              enableDates={mode === 'batch' ? enableDates : enableRTDates.map(day => day.tsMoment.local().format('YYYYMMDD'))}
              label="Select Date Range"
              activeOption="customRange"
              showHoursList={false}
              disableDays
              allowEnableDatesHours
            />
          </div>
          <div className="onDemand__row +rightSide">
            <Button className="button--success +small" onClick={this.onApply}>
              <FormattedMessage id="reports.apply" />
            </Button>
            <Button className="button--dark +small" onClick={this.props.onCancel}>
              <FormattedMessage id="reports.cancel" />
            </Button>
          </div>
        </Modal>
      </section>
    );
  }
}

OnDemand.propTypes = {
  'onCancel': PropTypes.func.isRequired,
  'fetchResultSummary': PropTypes.func.isRequired,
  'enableDates': PropTypes.array,
  'enableRTDates': PropTypes.array.isRequired,
  'pipeline': PropTypes.string.isRequired,
  'mode': PropTypes.string.isRequired,
  'onApply': PropTypes.func.isRequired,
};

OnDemand.defaultProps = {
  enableDates: [],
};

const mapStateToProps = state => ({
  'enableDates': getEnableDates(state.data.models.toJS()),
  'enableRTDates': getAvailableRTDaysFromResultSummary(state),
});

const mapDispatchToProps = dispatch => ({
  'fetchResultSummary': params => dispatch(fetchResultSummary(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OnDemand);
