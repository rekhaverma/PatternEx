import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';

import WithBox from 'components/withBox';
import { Input } from 'components/forms';
import { DayPickerSingleDateController } from 'react-dates';

import './time-range.style.scss';

const isDayAfterToday = (date, today) => date.isAfter(today);

class TimeRange extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'focused': true,
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.manuallyChangeDate = this.manuallyChangeDate.bind(this);
  }

  componentDidMount() {
    this.setState({
      'date': this.props.date,
      'manualDate': this.props.date.format('MM-DD-YYYY'),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.date.isSame(this.state.date)) {
      this.setState({
        'date': nextProps.date,
        'manualDate': nextProps.date.format('MM-DD-YYYY'),
      });
    }
  }

  onDateChange(date) {
    this.setState({
      date,
      'manualDate': date.format('MM-DD-YYYY'),
    }, () => {
      this.props.closeBox();
      this.props.onDateChange(date);
    });
  }

  manuallyChangeDate(date, value, setMoment = false) {
    const today = moment()
      .hour(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);

    if (moment(value).isAfter(today)) {
      this.setState({
        [date]: today,
        'manualDate': today.format('MM-DD-YYYY'),
      });
      return null;
    }


    // If we have to set a moment() value, only on Blur
    if (date === 'date') {
      if (setMoment && moment(value).isValid()) {
        this.setState({
          [date]: moment(value),
        }, () => {
          this.props.onDateChange(this.state.date);
        });
      }
    } else {
      // If the user is typing, set the manualDate
      const { isStartDate, limitDate } = this.props;

      const noSpecialCharsDate = value.replace(/[a-zA-Z`~!@#$%^&*()_|+=?;:'",.<>/]/gi, '');
      const defaultDate = isStartDate ? limitDate : today.format('MM-DD-YYYY');

      this.setState({
        [date]: moment(noSpecialCharsDate).isValid()
          ? noSpecialCharsDate
          : defaultDate,
      });
    }

    return null;
  }

  render() {
    const { className, currentDate, boxIsOpen } = this.props;
    const { date, manualDate } = this.state;
    return (
      <div className={className}>
        <div className={`${className}__inputBox`}>
          <Input
            className={`${className}__input`}
            onClick={() => this.props.openBox()}
            onChange={e => this.manuallyChangeDate('manualDate', e.target.value)}
            onBlur={e => this.manuallyChangeDate('date', e.target.value, true)}
            value={manualDate}
          />
        </div>
        {
          boxIsOpen && (
            <div className={`${className}__box`}>
              <DayPickerSingleDateController
                date={date}
                numberOfMonths={1}
                onDateChange={this.onDateChange}
                focused={this.state.focused}
                onFocusChange={({ focused }) => this.setState({ focused })}
                isDayBlocked={day => isDayAfterToday(day, currentDate)}
                navNext={<span className="icon-chevron-right" />}
                navPrev={<span className="icon-chevron-left" />}
                hideKeyboardShortcutsPanel
              />
            </div>
          )
        }
      </div>
    );
  }
}
TimeRange.displayName = 'TimeRange';
TimeRange.propTypes = {
  'boxIsOpen': PropTypes.bool.isRequired,
  'className': PropTypes.string,
  'currentDate': momentPropTypes.momentObj.isRequired,
  'date': PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    momentPropTypes.momentObj,
  ]).isRequired,
  'format': PropTypes.string,
  'closeBox': PropTypes.func.isRequired,
  'openBox': PropTypes.func.isRequired,
  'onDateChange': PropTypes.func,
  'isStartDate': PropTypes.bool,
  'limitDate': PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    momentPropTypes.momentObj,
  ]).isRequired,
};
TimeRange.defaultProps = {
  'className': 'timeRange',
  'format': 'MM-DD-YYYY',
  'onDateChange': () => null,
  'isStartDate': false,
};

export default WithBox(TimeRange);
