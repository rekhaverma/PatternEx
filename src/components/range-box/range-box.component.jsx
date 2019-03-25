import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';
import { noAncestry } from 'lib/dom';
import { isEqual } from 'lodash';

import PredefinedOptions from './components/predefined-options.component';
import CustomRangeContent from './components/custom-range-content.component';

import './range-box.style.scss';

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

class RangeBox extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'endDate': '',
      'activeOption': '',
      'boxIsOpen': false,
    };

    this.root = null;
    this.setActiveOption = this.setActiveOption.bind(this);
    this.applyChanges = this.applyChanges.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.autoclose = this.autoclose.bind(this);
    this.closeBox = this.closeBox.bind(this);
    this.openBox = this.openBox.bind(this);
  }

  componentWillMount() {
    this.setState(setDefaultState(this.state, this.props));
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props, nextProps)) {
      this.setState(setDefaultState(this.state, nextProps));
    }
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({
      'startDate': startDate !== null ? startDate : this.state.startDate,
      'endDate': endDate !== null ? endDate : this.state.endDate,
    }, () => {
      if (this.state.activeOption !== 'customRange') {
        this.props.updateRange(this.state.startDate, this.state.endDate);
      }
    });
  }

  setActiveOption(name) {
    if (this.state.activeOption !== name) {
      this.setState({
        'activeOption': name,
      }, () => this.setState(
        updateRange(this.state),
        () => {
          if (this.state.activeOption !== 'customRange') {
            this.closeBox();
          }
          this.props.updateRange(this.state.startDate, this.state.endDate);
        },
      ));
    }
  }

  applyChanges() {
    if (this.state.activeOption === 'customRange') {
      this.closeBox();
      this.props.updateRange(this.state.startDate, this.state.endDate);
    }
  }

  openBox() {
    this.setState({ 'boxIsOpen': true }, () => { this.attachEvent(); });
  }

  closeBox() {
    this.setState({
      'boxIsOpen': false,
    }, () => {
      this.detachEvent();
    });
  }

  autoclose(ev) {
    if (noAncestry(ev.target, ReactDOM.findDOMNode(this.root))) {
      this.closeBox();
    }
  }

  attachEvent() {
    document.addEventListener('click', this.autoclose);
  }

  detachEvent() {
    document.removeEventListener('click', this.autoclose);
  }

  render() {
    const { className, options, currentDate } = this.props;
    return (
      <div className={className}>
        <span>Show: </span>
        <div className={`${className}__input`} onClick={this.openBox}>
          <span>{this.state.startDate.format(this.props.dateFormat)}</span>
          <span>{this.state.endDate.format(this.props.dateFormat)}</span>
          <span className="icon-Calendar-icon" style={{ 'marginLeft': 'auto' }} />
          <span>Show: </span>
          <div className={`${className}__input`} onClick={this.openBox}>
            <span>{this.state.startDate.format(this.props.dateFormat)}</span> -
            <span> {this.state.endDate.format(this.props.dateFormat)}</span>
          </div>
          <div
            ref={ref => this.root = ref}
            className={`${className}__comboBox`}
            style={{ 'display': this.state.boxIsOpen ? 'flex' : 'none' }}
          >
            <PredefinedOptions
              activeOption={this.state.activeOption}
              className={`${className}__predefinedList`}
              options={options}
              onClick={this.setActiveOption}
              onApply={this.applyChanges}
              onCancel={this.closeBox}
              hasButtons
            />
            {
              this.state.activeOption === 'customRange' && (
                <CustomRangeContent
                  noDayAfterToday
                  className={`${className}__customRange`}
                  currentDate={currentDate}
                  endDate={this.state.endDate}
                  startDate={this.state.startDate}
                  onDatesChange={this.onDatesChange}
                />
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

RangeBox.displayName = 'RangeBox';
RangeBox.propTypes = {
  // 'activeOption': PropTypes.string,
  'className': PropTypes.string,
  'dateFormat': PropTypes.string,
  // 'endDate': PropTypes.oneOfType([
  //   PropTypes.instanceOf(Date),
  //   momentPropTypes.momentObj,
  // ]),
  'options': PropTypes.array,
  // 'startDate': PropTypes.oneOfType([
  //   PropTypes.instanceOf(Date),
  //   momentPropTypes.momentObj,
  // ]),
  'updateRange': PropTypes.func,
  'currentDate': momentPropTypes.momentObj,
};
RangeBox.defaultProps = {
  'activeOption': '7days',
  'className': 'rangeBox',
  'dateFormat': 'MM-DD-YYYY',
  'endDate': moment(),
  'options': [],
  'startDate': moment().subtract(7, 'day'),
  'currentDate': moment(),
  'updateRange': () => null,
};

export default RangeBox;
