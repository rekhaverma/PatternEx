import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isEqual } from 'lodash';

import WithBox from '../withBox';

import ColumnTheme from './components/column-theme.component';
import RowTheme from './components/row-theme.component';
import RowThemeWithLabel from './components/row-theme-with-label.component';
import RangeBox from './components/range-box';
import SingleDate from './components/single-date.component';
import PredefinedOptions from './components/predefined-options.component';

import './date-range.style.scss';

const setDefaultState = (prevState, props) => ({
  ...prevState,
  'activeOption': props.activeOption || prevState.activeOption,
  'startDate': props.startDate,
  'endDate': props.endDate,
});

const updateRange = (state) => {
  const { activeOption } = state;
  let startDate = state.startDate;
  let endDate = state.endDate;
  const currentMonth = moment().get('month');

  switch (activeOption.toLowerCase()) {
    case 'yesterday':
      startDate = moment().subtract(1, 'day');
      endDate = moment().subtract(1, 'day');
      break;

    case '7days':
      startDate = moment().subtract(7, 'day');
      endDate = moment();
      break;

    case '30days':
      startDate = moment().subtract(30, 'day');
      endDate = moment();
      break;

    case 'thismonth':
      startDate = moment().month(currentMonth).date(1);
      endDate = moment();
      break;

    case 'lastmonth':
      startDate = moment().month(currentMonth - 1).date(1);
      endDate = moment().month(currentMonth).date(0);
      break;

    default:
      break;
  }

  return {
    ...state,
    startDate,
    endDate,
  };
};


class DateRange extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'startDate': moment().subtract(7, 'days'),
      'activeOption': '',
      'endDate': moment(),
    };

    this.applyChanges = this.applyChanges.bind(this);
    this.setActiveOption = this.setActiveOption.bind(this);
    this.updateDates = this.updateDates.bind(this);
  }

  componentDidMount() {
    this.setState(setDefaultState(this.state, this.props));
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props, nextProps) && this.props.type !== 'daily') {
      this.setState(setDefaultState(this.state, nextProps));
    }
  }

  setActiveOption(name) {
    this.setState({
      'activeOption': name,
    }, () => this.setState(
      updateRange(this.state),
      () => {
        if (this.state.activeOption !== 'customRange') {
          this.props.updateDateRange(
            this.state.startDate,
            this.state.endDate,
          );
          this.props.closeBox();
        }
      },
    ));
  }

  updateDates({ startDate, endDate }, callback = () => {}) {
    if (this.props.type === 'daily' && this.props.allowEnableDatesHours) {
      this.props.onUpdateDailyDate(startDate);
    }
    this.setState({
      'startDate': startDate !== null ? startDate : this.state.startDate,
      'endDate': endDate !== null ? endDate : this.state.endDate,
    }, () => {
      callback();
    });
  }

  applyChanges() {
    if (this.state.activeOption === 'customRange' || this.props.type === 'daily') {
      this.props.updateDateRange(this.state.startDate, this.state.endDate);
      this.props.closeBox();
    }
  }

  render() {
    const {
      className, options, theme, type,
      onDateChange, onMonthChange, enableDates,
      disableDays, showHoursList, enableHours,
      allowEnableDatesHours,
    } = this.props;
    const { startDate, endDate } = this.state;
    let format = 'MM - DD - YYYY';
    let presentation = null;

    if ((moment(startDate).isSame(endDate, 'day') || endDate.diff(startDate, 'hours') === 2) && showHoursList) {
      format = 'MM - DD - YYYY, HH:mm';
    }

    // type single, then SingleDateSelector
    if (type === 'single') {
      return (
        <div className={className}>
          <div className={`${className}__select`}>
            <SingleDate
              className={`${className}__picker`}
              currentDate={this.props.currentSingleDate}
              onDateChange={onDateChange}
              onMonthChange={onMonthChange}
              enableDates={enableDates}
            />
          </div>
          <span className="icon-Calendar-icon" />
        </div>
      );
    }

    if (type === 'daily') {
      return (
        <div className={className}>
          <RowTheme
            className={`${className}__presentation`}
            startDate={startDate}
            endDate={endDate}
            onClick={this.props.openBox}
            format={format}
          />
          { this.props.boxIsOpen && (
            <div className={`${className}__range`}>
              <RangeBox
                noDayAfterToday
                className={`${className}__picker`}
                startDate={startDate}
                endDate={endDate}
                currentDate={moment()}
                onDatesChange={this.updateDates}
                onMonthChange={onMonthChange}
                onApply={this.applyChanges}
                oneDayOnly
                enableDates={enableDates}
                enableHours={enableHours}
                allowEnableDatesHours={allowEnableDatesHours}
              />
            </div>
          )}
        </div>
      );
    }

    switch (theme) {
      case 'row':
        presentation = (
          <RowTheme
            className={`${className}__presentation`}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onClick={this.props.openBox}
            format={format}
          />
        );
        break;
      case 'rowWithLabel':
        presentation = (
          <RowThemeWithLabel
            className={`${className}__presentation`}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onClick={this.props.openBox}
            format={format}
            label={this.props.label}
          />
        );
        break;
      default:
        presentation = (
          <ColumnTheme
            className={`${className}__presentation`}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onClick={this.props.openBox}
          />
        );
        break;
    }

    if (options.length > 0) {
      return (
        <div className={className}>
          {presentation}
          { this.props.boxIsOpen && (
            <div className={`${className}__range`}>
              <PredefinedOptions
                // activeOption={this.state.activeOption}
                className={`${className}__predefinedList`}
                options={options}
                onClick={this.setActiveOption}
                onApply={this.applyChanges}
                onCancel={this.props.closeBox}
                hasButtons
              />
              { this.state.activeOption === 'customRange' && (
                <RangeBox
                  noDayAfterToday={!disableDays}
                  className={`${className}__picker`}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  currentDate={moment()}
                  onDatesChange={this.updateDates}
                  onMonthChange={onMonthChange}
                  enableDates={enableDates}
                  showHoursList={showHoursList}
                  allowEnableDatesHours={allowEnableDatesHours}
                />
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={className}>
        {presentation}
        { this.props.boxIsOpen && (
          <div className={`${className}__range`}>
            <RangeBox
              noDayAfterToday
              className={`${className}__picker`}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              currentDate={moment()}
              onDatesChange={this.updateDates}
            />
          </div>
        )}
      </div>
    );
  }
}
DateRange.propTypes = {
  // 'activeOption': PropTypes.string,
  'boxIsOpen': PropTypes.bool.isRequired,
  'className': PropTypes.string,
  'currentSingleDate': PropTypes.object,
  // 'dateFormat': PropTypes.string,
  // 'endDate': PropTypes.oneOfType([
  //   PropTypes.instanceOf(Date),
  //   momentPropTypes.momentObj,
  // ]),
  'options': PropTypes.array,
  // 'startDate': PropTypes.oneOfType([
  //   PropTypes.instanceOf(Date),
  //   momentPropTypes.momentObj,
  // ]),
  'openBox': PropTypes.func.isRequired,
  'closeBox': PropTypes.func.isRequired,
  'updateDateRange': PropTypes.func,
  'theme': PropTypes.string,
  'type': PropTypes.string,
  'onDateChange': PropTypes.func,
  'onMonthChange': PropTypes.func,
  'enableDates': PropTypes.array,
  'label': PropTypes.string,
  'showHoursList': PropTypes.bool,
  'disableDays': PropTypes.bool,
  'onUpdateDailyDate': PropTypes.func,
  'enableHours': PropTypes.array,
  'allowEnableDatesHours': PropTypes.bool,
};
DateRange.defaultProps = {
  'activeOption': '7days',
  'className': 'dateRange',
  'currentSingleDate': moment.utc(),
  'dateFormat': 'YYYY-MM-DD',
  'endDate': moment(),
  'options': [
    { 'id': 'yesterday', 'label': 'Yesterday' },
    { 'id': '7days', 'label': '7 Days' },
    { 'id': '30days', 'label': '30 Days' },
    { 'id': 'thismonth', 'label': 'This Month' },
    { 'id': 'lastmonth', 'label': 'Last Month' },
    { 'id': 'customRange', 'label': 'Custom Range' },
  ],
  'startDate': moment().subtract(7, 'day'),
  'updateDateRange': () => null,
  'theme': 'column',
  'type': '',
  'onDateChange': () => null,
  'onMonthChange': () => null,
  'enableDates': [],
  'label': 'Date range',
  'disableDays': false,
  'showHoursList': true,
  'onUpdateDailyDate': () => null,
  'enableHours': [],
  'allowEnableDatesHours': false,
};

export default WithBox(DateRange);
