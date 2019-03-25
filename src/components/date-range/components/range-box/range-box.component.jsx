import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';
import 'react-dates/initialize';

import { Input } from 'components/forms';
import { DayPickerRangeController } from 'react-dates';
import HoursList from './components/hours-list.component';

const isDayAfterToday = (date, today, enableDates, noDayAfterToday, allowEnableDatesHours) => {
  if (noDayAfterToday) {
    /**
     * Below logic is used to set the same timezone(utc) for both dates(`date` and `today`)
     */
    const utcDate = moment.utc(date.startOf('day').format('YYYY-MM-DD'), 'YYYY-MM-DD');
    const utcToday = moment.utc(today.startOf('day').format('YYYY-MM-DD'), 'YYYY-MM-DD');

    if (utcDate.isAfter(utcToday)) {
      return true;
    }
  }

  if (allowEnableDatesHours) {
    return enableDates.indexOf(date.format('YYYYMMDD')) < 0;
  }

  return false;
};

class RangeBox extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'focusedInput': 'startDate',
      'hoursListVisibility': false,
      'selectedHour': null,
    };

    this.onFocusChange = this.onFocusChange.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.manuallyChangeDate = this.manuallyChangeDate.bind(this);
    this.onSelectHour = this.onSelectHour.bind(this);
    this.onMonthChange = this.onMonthChange.bind(this);
  }

  componentWillMount() {
    this.setState({
      'startDate': this.props.startDate,
      'manualStartDate': this.props.startDate,
      'endDate': this.props.endDate,
      'manualEndDate': this.props.endDate,
    });
  }

  onSelectHour(hour, offset = 2) {
    this.setState({
      'selectedHour': hour,
      'startDate': moment(this.props.startDate).local().hour(0).add('h', hour)
        .minutes(0),
      'endDate': moment(this.props.endDate).local().hour(0).add('h', hour + offset)
        .minutes(0),
    }, () => {
      const { startDate, endDate } = this.state;
      this.props.onDatesChange({ startDate, endDate }, this.props.onApply);
    });
  }

  onFocusChange(focusedInput) {
    this.setState({
      'focusedInput': !focusedInput ? 'startDate' : focusedInput,
    });
  }

  onDatesChange({ startDate, endDate }) {
    let endDateCustom = endDate;
    let isSameDaySelected = false;
    if (moment(startDate).utc().dayOfYear() === moment(endDate).utc().dayOfYear()) {
      isSameDaySelected = true;
    }

    if (this.props.oneDayOnly) {
      isSameDaySelected = true;
      endDateCustom = startDate;
    }
    this.setState(
      {
        startDate,
        'endDate': endDateCustom,
        'manualStartDate': startDate,
        'manualEndDate': endDate,
        'hoursListVisibility': isSameDaySelected,
      },
      this.props.onDatesChange({ startDate, 'endDate': endDateCustom }),
    );
  }

  onMonthChange(date) {
    const { onMonthChange } = this.props;
    onMonthChange(date);
  }

  manuallyChangeDate(date, value, setMoment = false) {
    const today = moment().hour(0).minutes(0).seconds(0)
      .milliseconds(0);

    // check endDate to be valid date and after startDate
    if (date === 'endDate' && (moment(value).isAfter(today) || moment(value).isBefore(this.state.startDate))) {
      this.setState({
        [date]: today,
        'manualEndDate': today.format('MM-DD-YYYY'),
      });
      return null;
    }

    // check startDate to be valid date and after endDate
    if (date === 'startDate' && (moment(value).isAfter(today) || moment(value).isAfter(this.state.endDate))) {
      this.setState({
        [date]: this.state.endDate,
        'manualStartDate': this.state.endDate,
      });
      return null;
    }

    if (date === 'endDate' || date === 'startDate') {
      if (setMoment && moment(value).isValid()) {
        this.setState({
          [date]: moment(value),
        }, () => {
          const { startDate, endDate } = this.state;
          this.props.onDatesChange({ startDate, endDate });
        });
      } else {
        // if manual start date or end date is invalid
        this.setState({
          'manualStartDate': this.state.startDate,
          'manualEndDate': this.state.endDate,
        });
      }
    } else {
      // don't allow string or special characters
      this.setState({
        [date]: value.replace(/[a-zA-Z`~!@#$%^&*()_|+=?;:'",.<>/]/gi, ''),
      });
    }

    return null;
  }

  render() {
    const {
      className,
      numberOfMonths,
      currentDate,
      noDayAfterToday,
      enableDates,
      enableHours,
      allowEnableDatesHours,
    } = this.props;
    const { manualStartDate, manualEndDate } = this.state;
    const startDateInput = moment.isMoment(manualStartDate)
      ? manualStartDate.format('MM-DD-YYYY')
      : manualStartDate;
    const endDateInput = moment.isMoment(manualEndDate)
      ? manualEndDate.format('MM-DD-YYYY')
      : manualEndDate;

    return (
      <div className={`${className}__flex`}>
        <div>
          {this.props.oneDayOnly !== true &&
            <div className={`${className}__inputs`}>
              <div className={`${className}__group`}>
                <span>Start Date</span>
                <Input
                  className={`${className}__input`}
                  value={startDateInput || ''}
                  onChange={e => this.manuallyChangeDate('manualStartDate', e.target.value)}
                  onBlur={e => this.manuallyChangeDate('startDate', e.target.value, true)}
                />
              </div>
              <div className="icon-arrow-right" />
              <div className={`${className}__group +right`}>
                <span>End Date</span>
                <Input
                  className={`${className}__input +right`}
                  value={endDateInput || ''}
                  onChange={e => this.manuallyChangeDate('manualEndDate', e.target.value)}
                  onBlur={e => this.manuallyChangeDate('endDate', e.target.value, true)}
                />
              </div>
            </div>
          }
          <DayPickerRangeController
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            numberOfMonths={numberOfMonths}
            onDatesChange={this.onDatesChange}
            focusedInput={this.state.focusedInput}
            onFocusChange={this.onFocusChange}
            isDayBlocked={day => isDayAfterToday(
              day, currentDate, enableDates,
              noDayAfterToday, allowEnableDatesHours,
            )}
            navNext={<span className="icon-chevron-right" />}
            navPrev={<span className="icon-chevron-left" />}
            hideKeyboardShortcutsPanel
            minimumNights={0}
            onPrevMonthClick={month => this.onMonthChange(month)}
            onNextMonthClick={month => this.onMonthChange(month)}
          />
        </div>
        {this.state.hoursListVisibility && this.props.showHoursList && (
          <HoursList
            onSelectHour={this.onSelectHour}
            selectedHour={this.state.selectedHour}
            enableHours={enableHours}
            allowEnableDatesHours={allowEnableDatesHours}
          />
        )}
      </div>
    );
  }
}
RangeBox.propTypes = {
  'className': PropTypes.string.isRequired,
  'currentDate': momentPropTypes.momentObj.isRequired,
  'endDate': PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    momentPropTypes.momentObj,
  ]).isRequired,
  'numberOfMonths': PropTypes.number,
  'noDayAfterToday': PropTypes.bool,
  'startDate': PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    momentPropTypes.momentObj,
  ]).isRequired,
  'onDatesChange': PropTypes.func,
  'oneDayOnly': PropTypes.bool,
  'onApply': PropTypes.func,
  'enableDates': PropTypes.array,
  'onMonthChange': PropTypes.func,
  'showHoursList': PropTypes.bool,
  'enableHours': PropTypes.array,
  'allowEnableDatesHours': PropTypes.bool,
};
RangeBox.defaultProps = {
  'numberOfMonths': 1,
  'noDayAfterToday': false,
  'onDatesChange': () => null,
  'oneDayOnly': false,
  'onApply': () => null,
  'enableDates': [],
  'onMonthChange': () => null,
  'showHoursList': true,
  'enableHours': [],
  'allowEnableDatesHours': false,
};

export default RangeBox;
