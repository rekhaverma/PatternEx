import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isEqual } from 'lodash';

import WithBox from '../withBox';

import PresentationBox from './components/presentation-box.component';
import RangeBox from './components/range-box.component';
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
    if (!isEqual(this.props, nextProps)) {
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

  updateDates({ startDate, endDate }) {
    this.setState({
      'startDate': startDate !== null ? startDate : this.state.startDate,
      'endDate': endDate !== null ? endDate : this.state.endDate,
    });
    // Call updateDateRange if options are null
    if (this.props.options && this.props.options.length === 0) {
      this.props.updateDateRange(startDate, endDate);
    }
  }

  applyChanges() {
    if (this.state.activeOption === 'customRange') {
      this.props.updateDateRange(this.state.startDate, this.state.endDate);
      this.props.closeBox();
    }
  }

  render() {
    const { className, options } = this.props;

    if (options.length > 0) {
      return (
        <div className={className}>
          <PresentationBox
            className={`${className}__presentation`}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onClick={this.props.openBox}
          />
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
                  noDayAfterToday
                  className={`${className}__picker`}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  currentDate={moment()}
                  onDatesChange={this.updateDates}
                />
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={className}>
        <PresentationBox
          className={`${className}__presentation`}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onClick={this.props.openBox}
        />
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
};
DateRange.defaultProps = {
  'activeOption': '7days',
  'className': 'dateRange',
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
};

export default WithBox(DateRange);
