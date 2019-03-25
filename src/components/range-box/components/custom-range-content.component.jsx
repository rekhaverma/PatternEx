import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';
import 'react-dates/initialize';

import { Input } from 'components/forms';
import { DayPickerRangeController } from 'react-dates';

const isDayAfterToday = (date, today) => date.isAfter(today);

class CustomRangeContent extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'focusedInput': 'startDate',
    };

    this.onFocusChange = this.onFocusChange.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.manuallyChangeDate = this.manuallyChangeDate.bind(this);
  }

  componentWillMount() {
    this.setState({
      'startDate': this.props.startDate,
      'manualStartDate': this.props.startDate,
      'endDate': this.props.endDate,
      'manualEndDate': this.props.endDate,
    });
  }

  onFocusChange(focusedInput) {
    this.setState({
      'focusedInput': !focusedInput ? 'startDate' : focusedInput,
    });
  }

  onDatesChange({ startDate, endDate }) {
    this.setState(
      {
        startDate,
        endDate,
        'manualStartDate': startDate,
        'manualEndDate': endDate,
      },
      this.props.onDatesChange({ startDate, endDate }),
    );
  }

  manuallyChangeDate(date, value, setMoment = false) {
    const today = moment().hour(0).minutes(0).seconds(0)
      .milliseconds(0);

    if (date === 'endDate' && moment(value).isAfter(today)) {
      this.setState({
        [date]: today,
        'manualEndDate': today.format('MM-DD-YYYY'),
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
      }
    } else {
      this.setState({
        [date]: value,
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
    } = this.props;
    const { manualStartDate, manualEndDate } = this.state;
    const startDateInput = moment.isMoment(manualStartDate)
      ? manualStartDate.format('MM-DD-YYYY')
      : manualStartDate;
    const endDateInput = moment.isMoment(manualEndDate)
      ? manualEndDate.format('MM-DD-YYYY')
      : manualEndDate;
    return (
      <div className={className}>
        <div className={`${className}__inputs`}>
          <div className={`${className}__group`}>
            <span className="icon-Calendar-icon" />
            <Input
              className={`${className}__input`}
              value={startDateInput || ''}
              onChange={e => this.manuallyChangeDate('manualStartDate', e.target.value)}
              onBlur={e => this.manuallyChangeDate('startDate', e.target.value, true)}
            />
          </div>
          <div className={`${className}__group`}>
            <span className="icon-Calendar-icon" />
            <Input
              className={`${className}__input`}
              value={endDateInput || ''}
              onChange={e => this.manuallyChangeDate('manualEndDate', e.target.value)}
              onBlur={e => this.manuallyChangeDate('endDate', e.target.value, true)}
            />
          </div>
        </div>
        <DayPickerRangeController
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          numberOfMonths={numberOfMonths}
          onDatesChange={this.onDatesChange}
          focusedInput={this.state.focusedInput}
          onFocusChange={this.onFocusChange}
          isDayBlocked={noDayAfterToday ? day => isDayAfterToday(day, currentDate) : () => null}
          navNext={<span className="icon-chevron-right" />}
          navPrev={<span className="icon-chevron-left" />}
          hideKeyboardShortcutsPanel
        />
      </div>
    );
  }
}
CustomRangeContent.displayName = 'CustomRangeContent';
CustomRangeContent.propTypes = {
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
};
CustomRangeContent.defaultProps = {
  'numberOfMonths': 2,
  'noDayAfterToday': false,
  'onDatesChange': () => null,
};

export default CustomRangeContent;
