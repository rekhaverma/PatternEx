import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import moment from 'moment';
import { findIndex } from 'lodash';

import { createURL } from 'lib';
import { EvpOpenMethods } from 'model/classes/evp-open-methods';
import findEntityName from 'lib/decorators/find-entity-name';
import { pipelinesLabels } from 'model/selectors/raw.selectors';
import { fetchResultSummary } from 'model/actions/rest/models.actions';
import { setLabelForPipeline } from 'model/actions/malicious-activity.actions';
import { fetchEntitySearchData, resetSearchData } from 'model/actions/exploded-view.actions';
import { deleteLabel } from 'model/actions/malicious-activity.actions.js';
import {
  fetchColumnFormat,
  fetchPipelineModel,
  fetchPipelineModelMore,
  resetPipeline,
} from 'model/actions/rest/pipelines.actions';
import {
  getAvailableDatesFromResultSummary,
  getAvailableHoursFromResultHoursSummary,
  getAvailableRTDaysFromResultSummary,
  getPieChartData,
  getBarchartData, getModelsList } from 'model/selectors/resultsummary.selectors';

import { pipelineTypes, dataMode } from 'config';

import SelectBox from 'components/select-box';
import DateRange from 'components/date-range';
import { Button } from 'components/forms';
import Modal from 'components/modal';

import ChangeLabel from 'containers/change-label';

import { Search } from '../dashboard/components/search';

import BarChart from './components/barchart';
import { PieChart } from './components/piechart';

import PipelineTable from './container/pipeline-table';

import './pipeline.style.scss';
import { toMomentTime, propOrDefault } from './lib';
import { getMinDiffHours, isAheadUTC } from './lib/utils';

class Pipeline extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'searchValue': '',
      'predictionRow': {},
      'changeLabelModal': false,
      'selectedModel': '',
      'pageSize': 20,
      'currentPage': 1,
      'loaded': false,
      'updateTable': true,
    };

    this.defaults = {};
    this.changeStateValue = this.changeStateValue.bind(this);
    this.onMonthChange = this.onMonthChange.bind(this);
    this.updateDateRange = this.updateDateRange.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleApplyClick = this.handleApplyClick.bind(this);
    this.handleSetLabel = this.handleSetLabel.bind(this);
    this.handleFetchMore = this.handleFetchMore.bind(this);
    this.handleExplodedViewFromPipeline = this.handleExplodedViewFromPipeline.bind(this);
    this.updateChartParams = this.updateChartParams.bind(this);
    this.onModelChange = this.onModelChange.bind(this);
    this.getActiveModel = this.getActiveModel.bind(this);
    this.onClickAsyncBatchHandler = this.onClickAsyncBatchHandler.bind(this);
    this.onClickAsyncRTHandler = this.onClickAsyncRTHandler.bind(this);
    this.changePageState = this.changePageState.bind(this);
    this.getDefaultPipeline = this.getDefaultPipeline.bind(this);
    this.searchEntity = this.searchEntity.bind(this);
    this.onUpdateDailyDate = this.onUpdateDailyDate.bind(this);
  }

  componentWillMount() {
    this.updateChartParams();
  }

  componentDidMount() {
    const { location } = this.props;
    /* Set timestamp in url if not present */
    if (!location.query.timestamp) {
      this.changeStateValue('timestamp', toMomentTime().startOf('d').format('X'));
    }
  }

  componentDidUpdate() {
    const { location } = this.props;
    const params = propOrDefault(this.props);

    // If pipeline is undefined in URL and Pipelines are avaible then set pipeline
    if (!params.pipeline && this.props.pipelines.length > 0) {
      this.changeStateValue('pipeline', this.getDefaultPipeline());
    }

    // Load Entities listing on initial page load
    const { loaded } = this.state;
    if (!loaded && params.pipeline) {
      this.handleApplyClick();
    }

    /* Set timestamp in url if not present on  Reset */
    if (!location.query.timestamp) {
      this.changeStateValue('timestamp', toMomentTime().startOf('d').format('X'));
    }
  }

  /**
   * Get the "startDate" and, with current props (or defaults), dispatch
   * the result summary action, needed to display which date has data.
   *
   * @param {Object} startDate    Date returned by react-dates
   */

  onMonthChange(date, param = {}) {
    // date is  Moment object (UTC) with day same as selected
    const params = Object.assign({}, propOrDefault(this.props, true), param);

    // Start day of month
    let startDay = moment.utc(date).startOf('month').startOf('d');
    // End day of month
    const endDay = moment.utc(date).endOf('month').endOf('d');

    // the time difference between UTC time and local time, in minutes
    const minDiffernceHour = getMinDiffHours();

    if (params.mode === 'batch') {
      // Start day of previous month
      startDay = startDay.subtract(30, 'd');
      this.props.fetchResultSummary({
        ...params,
        'start_time': startDay.format('X'),
        'end_time': endDay.format('X'),
      });
    } else {
      this.props.fetchResultSummary({
        ...params,
        'start_time': startDay.format('X'),
        'end_time': endDay.format('X'),
        'summary_range': parseInt(minDiffernceHour, 10) * 60,
        'fetchDayPerMonth': true,
      });
    }
  }

  onModelChange(modelName) {
    this.setState({
      'selectedModel': modelName,
    });
  }

  async onClickAsyncBatchHandler(nextLocation, params) {
    await this.props.fetchResultSummary(nextLocation);
    this.props.fetchColumnFormat(params.pipeline);
    this.props.fetchPipelineModel(
      toMomentTime(params.start_time),
      {
        pipeline: params.pipeline,
        model_type: params.model_type,
        model_name: this.getActiveModel(),
        limit: this.state.pageSize,
      },
    );
    this.updateChartParams();
    this.props.resetSearchData();
  }

  async onClickAsyncRTHandler(nextLocation, params) {
    await this.props.fetchResultSummary(nextLocation);
    this.props.fetchColumnFormat(params.pipeline);
    this.props.fetchPipelineModel(
      null,
      {
        ...params,
        model_name: this.getActiveModel(),
        limit: this.state.pageSize,
      },
    );
    this.updateChartParams();
    this.props.resetSearchData();
  }

  /*
  ** get count by hours on date change for real time calendar
  */
  onUpdateDailyDate(date) {
    const utcDate = moment.utc(date.format('YYYY-MM-DD'), 'YYYY-MM-DD');
    const params = propOrDefault(this.props, true);
    const start = utcDate.clone().startOf('day');
    const end = utcDate.clone().endOf('day');

    const minDiffernceHour = getMinDiffHours();
    const isAheadOfUTC = isAheadUTC();


    this.props.fetchResultSummary({
      ...params,
      'start_time': isAheadOfUTC ? start.subtract(minDiffernceHour, 'h').format('X') : start.add(minDiffernceHour, 'h').format('X'),
      'end_time': isAheadOfUTC ? end.subtract(minDiffernceHour, 'h').format('X') : end.add(minDiffernceHour, 'h').format('X'),
      'summary_range': 60,
      'fetchHoursPerDay': true,
    });
  }

  getActiveModel() {
    const { selectedModel } = this.state;
    const { models } = this.props;
    if (models && models.length === 0) {
      return '';
    }
    const modelIndex = findIndex(models, model => model.id === selectedModel);
    if (modelIndex < 0) {
      // this.onModelChange(models[0].id);
      return models[0].id;
    }
    return models[modelIndex].id;
  }

  getDefaultPipeline(pipelines) {
    const enablePipelines = pipelines || this.props.pipelines;
    if (enablePipelines && enablePipelines.length > 0) {
      const defaultPipelineIndex = findIndex(enablePipelines, pipeline => (pipeline.default));
      // Handle default pipeline disabled
      if (defaultPipelineIndex > -1) {
        return enablePipelines[defaultPipelineIndex].id;
      }
      return enablePipelines[0].id;
    }
    return '';
  }

  updateChartParams() {
    const params = propOrDefault(this.props);
    const endTimeMoment = toMomentTime(params.end_time);

    const chartsParams = {
      bar: {
        className: 'pipeline',
        isRealTimeMode: params.mode === 'realtime',
        data: this.props.barchartData,
        calendarDay: endTimeMoment,
      },
      pie: {
        className: 'pipeline',
        pipeline: params.pipeline,
        data: this.props.piechartData,
        calendarDay: endTimeMoment,
      },
    };
    this.setState({ 'chartsParams': chartsParams });
  }

  handleSetLabel(row = {}, modal = false, index) {
    const params = propOrDefault(this.props);
    this.setState({
      'predictionRow': {
        ...row,
        index,
        pipeline: params.pipeline,
        entity_type: params.pipeline,
        mode: params.mode,
        model_name: this.getActiveModel(),
      },
      'changeLabelModal': modal,
    });
  }

  handleExplodedViewFromPipeline(row, behavior = 'pipeline') {
    const { isOldEVPActive, handleExplodedView } = this.props;
    const params = {
      ...this.props.location.query,
      ...row,
      selectedModel: this.getActiveModel() ? this.getActiveModel() : '',
    };
    EvpOpenMethods.onRowClickHandler(params, behavior, isOldEVPActive, handleExplodedView);
  }


  /**
   * Handle the onClick event on Apply button.
   *
   * When user clicks on Apply, two requests are being
   * triggered:
   *    - one to fetch column format for table (features)
   *    - one to fetch the results to populate the table.
   *
   * If URL doesn't contain the "pipeline" param, we will fetch
   * the features for the default pipeline.
   */
  handleApplyClick() {
    // Set loaded true on initial loading
    const { loaded, searchValue } = this.state;
    if (!loaded) {
      this.setState({
        'loaded': true,
      });
    }

    // To clear search box on click of apply
    if (searchValue !== '') {
      this.setState({
        'searchValue': '',
      });
    }

    const { location } = this.props;
    const resultSummaryParams = propOrDefault(this.props, true);
    const modelResultParams = propOrDefault(this.props);

    this.setState({
      'currentPage': 1,
      'updateTable': true,
      'modelType': resultSummaryParams.model_type,
    });

    if (location && location.query && location.query.mode !== 'batch') {
      const nextLocation = {
        ...resultSummaryParams,
        'summary_range': 60,
      };
      this.onClickAsyncRTHandler(nextLocation, modelResultParams);
    }

    if (location && location.query && location.query.mode === 'batch') {
      const nextLocation = {
        ...resultSummaryParams,
      };
      this.onClickAsyncBatchHandler(nextLocation, modelResultParams);
    }
  }

  handleFetchMore(start = 0, limit = 20) {
    const params = propOrDefault(this.props);

    if (params.mode === 'batch') {
      this.props.fetchPipelineModel(
        toMomentTime(params.start_time),
        {
          pipeline: params.pipeline,
          model_type: params.model_type,
          model_name: this.getActiveModel(),
          limit,
          start,
        },
      );
    } else {
      this.props.fetchPipelineModel(
        null,
        {
          ...params,
          model_name: this.getActiveModel(),
          limit,
          start,
        },
      );
    }
    this.props.resetSearchData();
  }

  handleSearchInput(e) {
    this.setState({
      'searchValue': e.target.value,
    });
  }

  handleKeyPress(e) {
    const { searchValue, currentPage, pageSize } = this.state;
    if (e.key === 'Enter') {
      if (searchValue === '') {
        const start = (parseInt(currentPage, 10) - 1) * parseInt(pageSize, 10);
        this.handleFetchMore(start, pageSize);
      } else {
        this.searchEntity(searchValue);
      }
    }
  }

  searchEntity(searchValue) {
    const params = propOrDefault(this.props);
    params.entity_name = searchValue;
    params.model_name = this.getActiveModel();
    this.props.resetSearchData();
    this.props.fetchEntitySearchData(params);
  }

  resetFilters() {
    this.setState({
      'selectedModel': '',
    });
    this.props.resetPipeline();
    this.props.updateLocation(this.props.location.pathname);
  }

  /**
  -   * Sets startDate and endDate to application state
  -   *
  -   * @params startDate & endDate Dates returned by react-dates
  -   */
  updateDateRange(startTime) {
    this.changeStateValue('timestamp', startTime.format('X'));
  }

  /**
     *  Whenever a filter is changed (pipeline, type of pipeline, data mode etc.)
     * we will have to update the URL as well with the new params.
     *
     * @param {String} key      Key of property
     * @param {Any}   value     Value of property
     */
  changeStateValue(key, value, updateEnableDates) {
    const { location } = this.props;
    const params = propOrDefault(this.props, true);

    // updateEnableDates = true on change of pipelines, mode and model_type, value will be pipeline
    if (updateEnableDates) {
      const newParam = {
        [key]: value,
      };
      this.onMonthChange(moment.unix(location.query.timestamp, 'X'), newParam);
    }

    delete params.start_time;
    delete params.end_time;

    // timestamp is not present in params so explicitly added it
    // to avoid losing timestamp in url
    if (location.query.timestamp) {
      params.timestamp = location.query.timestamp;
    }

    const nextUrl = createURL(
      location.pathname,
      { ...params, [key]: value },
    );
    this.props.updateLocation(nextUrl);
    if (this.state.updateTable) {
      this.setState({
        'updateTable': false,
      });
    }
  }

  /*
  * To update currentPage and pageSize
  */
  changePageState(key, value) {
    this.setState({
      [key]: value,
    });
  }

  render() {
    const { searchValue, changeLabelModal, updateTable, modelType } = this.state;
    const { enableDates, enableRTDates, enableHours, models, location } = this.props;
    const params = propOrDefault(this.props);

    // Initially Params.pipeline will be undefined (not set in url) , so get deafult pipeline
    const activePipeline = params.pipeline;

    const fetchPipelineParams = {
      timestamp: location.query.timestamp,
      params: {
        pipeline: params.pipeline,
        model_type: params.model_type,
        model_name: this.getActiveModel,
        limit: 100,
      },
    };

    if (params.mode !== 'batch') {
      fetchPipelineParams.params = {
        ...fetchPipelineParams.params,
        start_time: params.start_time,
        end_time: params.end_time,
        start: 0,
        length: 100,
      };
    }

    const chartParams = {
      ...this.state.chartsParams,
    };

    return (
      <div className="pipeline">
        <div className="pipeline__row +center">
          <span className="pipeline__title">
            <FormattedMessage id="pipeline.title" />
          </span>
        </div>
        <div className="pipeline__row">
          <div
            className="pipeline__filter pipeline__filter--first"
          >
            <SelectBox
              singleSelect
              activeOption={activePipeline}
              options={this.props.pipelines}
              onClick={value => this.changeStateValue('pipeline', value, true)}
              placeholder={activePipeline}
            />
          </div>
          <div className="pipeline__filter">
            <SelectBox
              singleSelect
              activeOption={params.model_type}
              options={pipelineTypes}
              onClick={value => this.changeStateValue('model_type', value, true)}
              placeholder={params.model_type}
            />
          </div>
          <div className="pipeline__filter">
            <SelectBox
              singleSelect
              activeOption={params.mode}
              options={dataMode}
              onClick={value => this.changeStateValue('mode', value, true)}
              placeholder={params.mode}
            />
          </div>
          {params.mode === 'batch' &&
            <div className="pipeline__filter">
              <div className="pipeline__datepicker">
                <DateRange
                  currentSingleDate={toMomentTime(location.query.timestamp)}
                  onMonthChange={this.onMonthChange}
                  enableDates={enableDates.map(day => day.tsMoment.format('YYYYMMDD'))}
                  onDateChange={date => this.changeStateValue('timestamp', date.startOf('d').format('X'))}
                  type="single"
                  className="dateRange"
                />
              </div>
            </div>
            }
          {params.mode === 'realtime' &&
            <div className="pipeline__filter--realtime">
              <div className="pipeline__datepicker">
                <DateRange
                  updateDateRange={this.updateDateRange}
                  endDate={toMomentTime(moment(params.end_time, 'X'))}
                  startDate={toMomentTime(moment(params.start_time, 'X'))}
                  onMonthChange={this.onMonthChange}
                  enableDates={enableRTDates.map(day => day.tsMoment.local().format('YYYYMMDD'))}
                  className="dateRange"
                  type="daily"
                  activeOption="daily"
                  onUpdateDailyDate={date => this.onUpdateDailyDate(date)}
                  enableHours={enableHours}
                  allowEnableDatesHours
                />
              </div>
            </div>
            }
          <div className="pipeline__filter">
            <SelectBox
              singleSelect
              activeOption={this.getActiveModel()}
              options={models}
              onClick={value => this.onModelChange(value)}
              placeholder="Model Alias"
            />
          </div>
          <div style={{ 'marginLeft': 'auto' }}>
            <Button
              onClick={this.handleApplyClick}
              className="button--success +small"
            >
              Apply
            </Button>
            <Button
              className="button--dark +small"
              onClick={() => this.resetFilters()}
            >
              Reset
            </Button>
          </div>
        </div>
        { modelType === pipelineTypes[0].id &&
          <div className="pipeline__row">
            <div className="pipeline__charts">
              <BarChart {...chartParams.bar} />
              <PieChart {...chartParams.pie} />
            </div>
          </div>
        }
        <div className="pipeline__row">
          <Search
            placeholder="Search..."
            value={searchValue}
            onChange={this.handleSearchInput}
            onKeyPress={this.handleKeyPress}
          />
        </div>
        <div className="pipeline__row">
          <PipelineTable
            pipeline={params.pipeline || ''}
            modelType={params.model_type || ''}
            handleSetLabel={this.handleSetLabel}
            deleteLabel={this.props.deleteLabel}
            handleFetchMore={this.handleFetchMore}
            fetchPipelineParams={fetchPipelineParams}
            handleExplodedView={this.handleExplodedViewFromPipeline}
            changePageSize={newPageSize => this.changePageState('pageSize', newPageSize)}
            pageSize={this.state.pageSize}
            currentPage={this.state.currentPage}
            onPageChange={newPage => this.changePageState('currentPage', newPage)}
            updateTable={updateTable}
          />
        </div>
        {
          changeLabelModal && (
            <Modal>
              <ChangeLabel
                predictionRow={this.state.predictionRow}
                onCancel={() => this.handleSetLabel()}
                onSave={this.props.setLabelForPipeline}
                title={findEntityName(this.state.predictionRow.pipeline, this.state.predictionRow) !== ''
                  ? <FormattedHTMLMessage
                    id="pipeline.setLabelFor"
                    values={{ 'entityName': findEntityName(this.state.predictionRow.pipeline, this.state.predictionRow) }}
                  />
                  : <FormattedMessage id="pipeline.setLabel" />}
              />
            </Modal>
          )
        }
      </div>
    );
  }
}

Pipeline.displayName = 'Pipeline';
Pipeline.propTypes = {
  'enableDates': PropTypes.array.isRequired,
  'enableRTDates': PropTypes.array.isRequired,
  'location': PropTypes.shape({
    'query': PropTypes.object.isRequired,
    'pathname': PropTypes.string.isRequired,
  }).isRequired,
  'pipelines': PropTypes.array,
  'fetchResultSummary': PropTypes.func,
  'resetPipeline': PropTypes.func.isRequired,
  'updateLocation': PropTypes.func.isRequired,
  'fetchColumnFormat': PropTypes.func.isRequired,
  'fetchPipelineModel': PropTypes.func.isRequired,
  'fetchPipelineModelMore': PropTypes.func.isRequired,
  'setLabelForPipeline': PropTypes.func.isRequired,
  'deleteLabel': PropTypes.func.isRequired,
  'handleExplodedView': PropTypes.func.isRequired,
  'piechartData': PropTypes.object,
  'barchartData': PropTypes.array,
  'models': PropTypes.array,
  'filterParams': PropTypes.object,
  'resetSearchData': PropTypes.func.isRequired,
  'fetchEntitySearchData': PropTypes.func.isRequired,
  'enableHours': PropTypes.array,
  'isOldEVPActive': PropTypes.bool,
};

Pipeline.defaultProps = {
  'pipelines': [],
  'piechartData': [],
  'barchartData': [],
  'models': [],
  'fetchResultSummary': () => {},
  'setLabelForPipeline': () => {},
  'handleExplodedView': () => {},
  'filterParams': {},
  'enableHours': [],
  'isOldEVPActive': false,
};

const mapStateToProps = (state, ownProps) => ({
  'filterParams': state.data.pipelines.toJS().filterParams,
  'enableRTDates': getAvailableRTDaysFromResultSummary(state),
  'enableDates': getAvailableDatesFromResultSummary(state),
  'enableHours': getAvailableHoursFromResultHoursSummary(state),
  'piechartData': getPieChartData(state, ownProps.location),
  'barchartData': getBarchartData(state, ownProps.location),
  'models': getModelsList(state, ownProps.location),
  'pipelines': pipelinesLabels(state),
  'searchData': state.raw.toJS().explodedView.searchData,
  'isOldEVPActive': !state.app.ui.toJS().newEVPVisibility,
});

const mapDispatchToProps = dispatch => ({
  'resetPipeline': () => dispatch(resetPipeline()),
  'updateLocation': location => dispatch(routerActions.push(location)),
  'fetchResultSummary': params => dispatch(fetchResultSummary(params)),
  'fetchColumnFormat': pipeline => dispatch(fetchColumnFormat(pipeline)),
  'fetchPipelineModel': (...args) => dispatch(fetchPipelineModel(...args)),
  'fetchPipelineModelMore': (...args) => dispatch(fetchPipelineModelMore(...args)),
  'setLabelForPipeline': (...args) => dispatch(setLabelForPipeline(...args)),
  'deleteLabel': (...args) => dispatch(deleteLabel(...args)),
  'handleExplodedView': (...args) => dispatch(routerActions.push(...args)),
  'fetchEntitySearchData': params => dispatch(fetchEntitySearchData(params)), // @todo: check if we can use the new action
  'resetSearchData': () => dispatch(resetSearchData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Pipeline);
