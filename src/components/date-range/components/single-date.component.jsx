import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';
import 'react-dates/initialize';

import { SingleDatePicker } from 'react-dates';

const isDayBlocked = (date, today, enableDates) =>
  enableDates.indexOf(date.format('YYYYMMDD')) < 0;

const isDateToday = (date) => {
  const today = moment.utc();
  return today.isSame(date, 'day');
};

class SingleDate extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      'focused': false,
      'date': moment.utc(),
    };
    this.getDate = this.getDate.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onMonthChange = this.onMonthChange.bind(this);
  }

  onDateChange(date) {
    const { onDateChange } = this.props;
    this.setState({
      date,
    });
    if (date !== null) {
      onDateChange(date);
    }
  }

  onMonthChange(date) {
    const { onMonthChange } = this.props;
    onMonthChange(date);
  }

  getDate() {
    const { enableDates } = this.props;
    const { date } = this.state;
    if (enableDates && enableDates.length > 0) {
      // set the defualt selected date from the enable dates
      if (isDateToday(date) && enableDates.indexOf(date.format('YYYYMMDD')) < 0) {
        return moment.utc(enableDates[enableDates.length - 1], 'YYYYMMDD');
      }
    }
    return date;
  }

  render() {
    const {
      numberOfMonths, className, currentDate, enableDates,
    } = this.props;
    //  date set to current date , to avoid date change on pipeline page with month change
    return (
      <div className={className}>
        <SingleDatePicker
          date={currentDate}
          onDateChange={date => this.onDateChange(date)}
          focused={this.state.focused}
          onFocusChange={({ focused }) => this.setState({ focused })}
          numberOfMonths={numberOfMonths}
          isDayBlocked={day => isDayBlocked(day, currentDate, enableDates)}
          isOutsideRange={() => null}
          navNext={<span className="icon-chevron-right" />}
          navPrev={<span className="icon-chevron-left" />}
          onPrevMonthClick={month => this.onMonthChange(month)}
          onNextMonthClick={month => this.onMonthChange(month)}
          hideKeyboardShortcutsPanel
          displayFormat="MM-DD-YYYY"
        />
      </div>
    );
  }
}

SingleDate.propTypes = {
  'numberOfMonths': PropTypes.number,
  'onDateChange': PropTypes.func,
  'className': PropTypes.string,
  'currentDate': momentPropTypes.momentObj.isRequired,
  'enableDates': PropTypes.array,
  'onMonthChange': PropTypes.func,
};
SingleDate.defaultProps = {
  'numberOfMonths': 1,
  'onDateChange': () => null,
  'className': 'dateSelect',
  'enableDates': [],
  'onMonthChange': () => null,
};

export default SingleDate;
