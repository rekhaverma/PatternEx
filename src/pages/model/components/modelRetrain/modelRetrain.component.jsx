import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { MaterialInput, Button } from 'components/forms';
import Modal from 'components/modal';
import { fetchResultSummary } from 'model/actions/rest/models.actions';
import { getEnableDates, getAvailableRTDaysFromResultSummary } from 'model/selectors';
import DateRange from 'components/date-range';
import { getMinDiffHours } from '../../../pipeline/lib/utils';

import './modelRetrain.style';

const isDateToday = (date) => {
  const today = moment.utc();
  return today.isSame(date, 'day');
};
class ModelRetrain extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      'modelName': '',
      'modelNameLabel': 'Model Name',
      'modelNameValid': false,
      'modelNameClassName': '',
      'startDate': moment.utc().subtract(7, 'day'),
      'endDate': moment.utc(),
    };
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.trainModel = this.trainModel.bind(this);
    this.onChangeModelName = this.onChangeModelName.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidMount() {
    this.handleMonthChange(moment.utc());
  }

  componentWillReceiveProps(nextProps) {
    const { enableDates, modelData, enableRTDates } = nextProps;
    let { startDate, endDate } = this.state;
    const mode = modelData.mode;
    const enableDatesSet = mode === 'batch' ? enableDates : enableRTDates.map(day => day.tsMoment.local().format('YYYYMMDD'));
    if (enableDatesSet.length > 0) {
      if (isDateToday(endDate) && enableDatesSet.indexOf(endDate.format('YYYYMMDD')) < 0) {
        endDate = moment.utc(enableDatesSet[enableDatesSet.length - 1], 'YYYYMMDD');
        startDate = moment.utc(endDate).subtract(7, 'day');
        this.setState({
          'startDate': startDate,
          'endDate': endDate,
        });
      }
    }
  }

  /**
   * Function to validate the model_name field
   * @param {string} value
   */
  onChangeModelName(value = '') {
    if (value.length < 1) {
      this.setState({
        'modelNameClassName': 'modelRetrain__modelNameError',
        'modelNameValid': false,
        'modelNameLabel': 'Enter model name to continue',
        'modelName': value,
      });
    } else {
      this.setState({
        'modelNameClassName': '',
        'modelNameValid': true,
        'modelNameLabel': 'Model Name',
        'modelName': value,
      });
    }
  }

  /**
   * Function to train the model
   */
  trainModel() {
    const { modelName, startDate, endDate } = this.state;
    const { modelData } = this.props;
    if (!modelName) {
      this.onChangeModelName('');
      return;
    }
    const params = {
      'start_date': startDate.format('YYYY-MM-DD'),
      'end_date': endDate.format('YYYY-MM-DD'),
      'old_model_name': modelData.name,
      'model_name': modelName,
      'type': modelData.model_type && modelData.model_type.toLowerCase(),
      'pipeline': modelData.feature_type && modelData.feature_type.toLowerCase(),
      'model_alias': modelData.model_alias_formatted,
      'mode': modelData.mode,
    };
    this.props.retrainModel(params);
  }

  /**
   * Function to call resultSummary API
   * on every month change of the date-range component
   * @param {object} date
   */
  handleMonthChange(date) {
    const { modelData } = this.props;
    const mode = modelData.mode;
    const startDayOfMonth = moment(date).startOf('month').startOf('d');
    const lastDayOfMonth = moment(date).endOf('month').endOf('d');
    const minDiffernceHour = getMinDiffHours();
    let params;

    if (mode === 'realtime') {
      params = {
        'mode': mode,
        'pipeline': modelData.feature_type && modelData.feature_type.toLowerCase(),
        'model_type': modelData.model_type && modelData.model_type.toLowerCase(),
        'start_time': startDayOfMonth.unix(),
        'end_time': lastDayOfMonth.unix(),
        'summary_range': parseInt(minDiffernceHour, 10) * 60,
        'fetchDayPerMonth': true,
      };
    } else {
      params = {
        'mode': mode,
        'pipeline': modelData.feature_type && modelData.feature_type.toLowerCase(),
        'model_type': modelData.model_type && modelData.model_type.toLowerCase(),
        'start_time': startDayOfMonth.subtract(30, 'd').unix(),
        'end_time': lastDayOfMonth.unix(),
      };
    }

    this.props.fetchResultSummary(params);
  }

  /**
   * function to update startDate and endDate in the state
   * after updating the date in date-range component
   * @param {object} startDate
   * @param {object} endDate
   */
  handleDateChange(startDate, endDate) {
    this.setState({ startDate, endDate });
  }
  render() {
    const { modelName, startDate, endDate } = this.state;
    const { enableDates, modelData, enableRTDates } = this.props;
    const mode = modelData.mode;
    return (
      <div className="modelRetrain">
        <Modal>
          <div className="modelRetrain__row +spaceBetween +borderBottom +header" >
            <span>
              Retrain Model
            </span>
            <span
              className="icon-close2"
              onClick={this.props.onClose}
            />
          </div>
          <div className={`modelRetrain__row ${this.state.modelNameClassName}`}>
            <MaterialInput
              inputOptions={{
                value: modelName,
                type: 'text',
                id: 'modelRetrainName',
                onChange: e => this.onChangeModelName(e.target.value),
              }}
              label={`* ${this.state.modelNameLabel}`}
            />
          </div>
          <div className="modelRetrain__row">
            <DateRange
              theme="rowWithLabel"
              startDate={startDate}
              endDate={endDate}
              updateDateRange={this.handleDateChange}
              onMonthChange={this.handleMonthChange}
              enableDates={mode === 'batch' ? enableDates : enableRTDates.map(day => day.tsMoment.local().format('YYYYMMDD'))}
              label="Training Date Range (we recommend 7 days)"
              activeOption="customRange"
              showHoursList={false}
              disableDays
              allowEnableDatesHours
            />
          </div>
          <div className="modelRetrain__row +center">
            <Button
              className="button--success +small"
              onClick={this.trainModel}
              disabled={!this.state.modelNameValid}
            >
              Retrain Model
            </Button>
            <Button
              className="button--dark +small"
              onClick={this.props.onClose}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  'fetchResultSummary': params => dispatch(fetchResultSummary(params)),
});

const mapStateToProps = state => ({
  'enableDates': getEnableDates(state.data.models.toJS()),
  'enableRTDates': getAvailableRTDaysFromResultSummary(state),
});

ModelRetrain.propTypes = {
  'onClose': PropTypes.func.isRequired,
  'fetchResultSummary': PropTypes.func.isRequired,
  'modelData': PropTypes.object.isRequired,
  'enableDates': PropTypes.array.isRequired,
  'retrainModel': PropTypes.func.isRequired,
  'enableRTDates': PropTypes.array.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelRetrain);
