import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedHTMLMessage } from 'react-intl';
import { nameToPipeline } from 'lib/decorators';
import { createModel, fetchResultSummary } from 'model/actions/rest/models.actions';
import { fetchColumnFormat } from 'model/actions/rest/pipelines.actions';
import { trueFeatureDictionary, getEnableDates, getAvailableRTDaysFromResultSummary } from 'model/selectors';
import SelectBox from 'components/select-box';
import { Button, MaterialInput } from 'components/forms';
import DateRange from 'components/date-range';
// import MultiSelect from 'components/multi-select';
import { dataMode } from 'config.js';

import { getMinDiffHours } from '../../../pipeline/lib/utils';
import FeatureSelectionModal from '../featureSelection';
import { entityFeature } from '../../../explodedview/config';

import './create-model.style.scss';

const isDateToday = (date) => {
  const today = moment.utc();
  return today.isSame(date, 'day');
};

const getFilters = pipeline => Object.keys(entityFeature[pipeline]);

class CreateModel extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      'activeEntity': 'domain',
      'activeModelType': 'classifier',
      'startDate': moment.utc().subtract(7, 'day'),
      'endDate': moment.utc(),
      'modelName': '',
      'modelAlias': '',
      'mode': 'batch',
      'showFeatureSelectionModal': false,
      'selectedFeatures': [],
      'returningFromFeatures': false,
    };
    this.changeStateValue = this.changeStateValue.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.createModel = this.createModel.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handlePipelineChange = this.handlePipelineChange.bind(this);
  }
  componentDidMount() {
    const { modelDate } = this.state;
    this.props.fetchColumnFormat(this.state.activeEntity);
    this.handleMonthChange(modelDate);
  }

  componentWillReceiveProps(nextProps) {
    const { enableDates, enableRTDates } = nextProps;
    let { startDate, endDate } = this.state;
    const { mode } = this.state;
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

  componentDidUpdate() {
    if (this.props.modelCreated === 'success') {
      this.props.onCancel({ 'type': 'success', 'text': 'Successfully Created' });
    } else if (this.props.modelCreated === 'failed') {
      this.props.onCancel({ 'type': 'fail', 'text': 'Failed' });
    }
  }
  getOptions() {
    const features = this.props.columnFormat;
    let options = [];
    if (features && typeof features === 'object') {
      options = Object.keys(features).map(key => (
        {
          'label': features[key].name,
          'description': features[key].description,
          'value': key,
        }
      ));
    }
    return options;
  }
  changeStateValue(key, value) {
    const state = {};

    state[key] = value;
    this.setState(state);
  }
  handleDateChange(startDate, endDate) {
    this.setState({ startDate, endDate });
  }
  handleMonthChange(date) {
    // Get two months(current and previous) dates
    // TODO - make the range of summary APIs generic
    const { activeEntity, activeModelType, mode } = this.state;
    const startDayOfMonth = moment(date).startOf('month').startOf('d');
    const lastDayOfMonth = moment(date).endOf('month').endOf('d');
    const minDiffernceHour = getMinDiffHours();
    let params;

    if (mode === 'realtime') {
      params = {
        'mode': mode,
        'pipeline': activeEntity,
        'model_type': activeModelType,
        'start_time': startDayOfMonth.unix(),
        'end_time': lastDayOfMonth.unix(),
        'summary_range': parseInt(minDiffernceHour, 10) * 60,
        'fetchDayPerMonth': true,
      };
    } else {
      params = {
        'mode': mode,
        'pipeline': activeEntity,
        'model_type': activeModelType,
        'start_time': startDayOfMonth.subtract(30, 'd').unix(),
        'end_time': lastDayOfMonth.unix(),
      };
    }

    this.props.fetchResultSummary(params);
  }
  createModel() {
    const params = {
      'model_name': this.state.modelName,
      'model_alias': this.state.modelAlias,
      'start_date': this.state.startDate.format('YYYY-MM-DD'),
      'end_date': this.state.endDate.format('YYYY-MM-DD'),
      'pipeline': this.state.activeEntity,
      'type': this.state.activeModelType,
      'features': this.state.selectedFeatures.join(','),
      'mode': this.state.mode,
    };
    this.props.createModel(params);
    this.props.onCancel();
  }

  handlePipelineChange(value) {
    const { returningFromFeatures } = this.state;
    if (!returningFromFeatures) {
      this.setState({
        'activeEntity': value,
        'selectedFeatures': [],
      }, () => {
        this.props.fetchColumnFormat(this.state.activeEntity);
        this.handleMonthChange(this.state.startDate);
      });
    } else {
      this.setState({
        'returningFromFeatures': false,
      });
    }
  }
  render() {
    const { pipelines, modelTypes, enableDates, enableRTDates } = this.props;
    const {
      modelName,
      modelAlias,
      startDate,
      endDate,
      mode,
      showFeatureSelectionModal,
      selectedFeatures,
    } = this.state;
    if (showFeatureSelectionModal) {
      return (
        <FeatureSelectionModal
          filters={getFilters(nameToPipeline(this.state.activeEntity))}
          features={this.getOptions()}
          onClose={
            () => {
              this.setState({
                'showFeatureSelectionModal': false,
                'returningFromFeatures': true,
              });
            }
          }
          onSelect={
            arr => this.setState({
              'selectedFeatures': arr,
              'showFeatureSelectionModal': false,
              'returningFromFeatures': true,
            })
          }
          pipeline={nameToPipeline(this.state.activeEntity)}
          selected={selectedFeatures}
        />
      );
    }
    return (
      <div className="add-new-model">
        <div className="row big-heading">
          <div className="col-md-12">
            <h5 className="new-model-header">Add new model</h5>
          </div>
        </div>
        <div className="create-model-row">
          <div className="select-box-width--left">
            <SelectBox
              showLabel
              singleSelect
              activeOption={this.state.activeEntity}
              options={pipelines}
              placeholder="Entity type"
              style={{ 'marginRight': '20px', 'width': '45%' }}
              onClick={value => this.handlePipelineChange(value)}
            />
          </div>
          <div className="select-box-width--right">
            <SelectBox
              showLabel
              singleSelect
              activeOption={this.state.activeModelType}
              options={modelTypes}
              placeholder="Model type"
              style={{ 'width': '50%' }}
              onClick={(value) => {
                this.setState({
                  'activeModelType': value,
                }, () => {
                  this.handleMonthChange(this.state.startDate);
                });
              }}
            />
          </div>
        </div>
        <div className="create-model-row add-new-model__inputField">
          <MaterialInput
            inputOptions={{
              value: modelName,
              type: 'text',
              onChange: e => this.changeStateValue('modelName', e.target.value),
              id: 'createModelName',
            }}
            label="Model Name"
          />
          <MaterialInput
            inputOptions={{
              value: modelAlias,
              type: 'text',
              onChange: e => this.changeStateValue('modelAlias', e.target.value),
              id: 'createModelAlias',
            }}
            label="Model Alias"
          />
        </div>
        <div className="create-model-row date-row">
          <SelectBox
            showLabel
            singleSelect
            activeOption={mode}
            options={dataMode}
            placeholder="Mode"
            style={{ 'width': '50%' }}
            onClick={(value) => {
              this.setState({
                'mode': value,
              }, () => {
                this.handleMonthChange(this.state.startDate);
              });
            }}
          />
          <div className="datepicker-container">
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
        </div>
        <div className="create-model-row" id="featureMultiSelect">
          <div className="create-model-row__selectFeatures">
            <span className={`create-model-row__selectFeatures__text ${selectedFeatures.length > 0 && 'create-model-row__selectFeatures__selected'}`}>
              Select Features
            </span>
            {
              selectedFeatures.length > 0 && (
                <span className="create-model-row__selectFeatures__selectedText">
                  <FormattedHTMLMessage
                    id="model.features.featureSelectedCount"
                    values={{
                      'count': selectedFeatures.length,
                    }}
                  />
                  <span
                    className="icon-error redIcon"
                    onClick={() => this.setState({ 'selectedFeatures': [] })}
                  />
                </span>
              )
            }
            <span
              className="icon-error transform45"
              onClick={() => this.changeStateValue('showFeatureSelectionModal', true)}
            />
          </div>
        </div>
        <div className="create-model-row create-model-actions">
          {this.props.modelCreated === 'inprogress' ?
            <div className="loader" /> : ''}
          <Button className="button--success +smal" onClick={this.createModel}>
            Save and train
          </Button>
          <Button className="button--dark +smal" onClick={() => this.props.onCancel(null)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

CreateModel.propTypes = {
  'modelCreated': PropTypes.string,
  'columnFormat': PropTypes.object,
  'onCancel': PropTypes.func.isRequired,
  'fetchColumnFormat': PropTypes.func.isRequired,
  'createModel': PropTypes.func.isRequired,
  'pipelines': PropTypes.array.isRequired,
  'modelTypes': PropTypes.array.isRequired,
  'fetchResultSummary': PropTypes.func.isRequired,
  'enableDates': PropTypes.array,
  'enableRTDates': PropTypes.array.isRequired,
};

CreateModel.defaultProps = {
  'modelCreated': '',
  'columnFormat': {},
  'enableDates': [],
};

const mapStateToProps = state => (
  {
    'modelCreated': state.data.models.toJS().modelCreated,
    'columnFormat': trueFeatureDictionary(state),
    'enableDates': getEnableDates(state.data.models.toJS()),
    'enableRTDates': getAvailableRTDaysFromResultSummary(state),
  }
);

const mapDispatchToProps = dispatch => ({
  'createModel': params => dispatch(createModel(params)),
  'fetchColumnFormat': pipeline => dispatch(fetchColumnFormat(pipeline)),
  'fetchResultSummary': params => dispatch(fetchResultSummary(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateModel);
