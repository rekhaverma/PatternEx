import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import moment from 'moment';
import { isEqual, uniq, findIndex } from 'lodash';

import { dateFormats, HBM_TABLE } from 'config';
import { createURL, locationBackUrl } from 'lib';
import { findEntityName } from 'lib/decorators';
import Loader from 'components/loader/loader-v2.component';
import DateRange from 'components/date-range';
import SelectBox from 'components/select-box';
import AdvancedTable from 'components/advanced-table';
import { Button } from 'components/forms';
import { fetchColumnFormat } from 'model/actions';
import {
  setLabelHandler,
  getSearchData,
  getHistoricalData,
} from 'model/actions/exploded-view';
import { deleteLabel } from 'model/actions/rest/labels.actions.js';
import { tagsSelectBox } from 'model/selectors';
import ChangeLabel from 'containers/change-label';
import Modal from 'components/modal';

import { Search } from '../dashboard/components/search';
import BackTo from '../behavior/components/back-to/';
import D3HistoricalBehaviourMap from './components/d3-historical-behaviour-map';
import {
  getUniqueFeatures,
  formatFeatures,
  defaultDimensions,
  getMapData,
  getTableData,
  historicalTableFormatData,
  isSameDay, getAvailableTactics,
} from './config';
import { entityFeature } from '../explodedview/config';

import './historical-behaviour-map.style.scss';

const ALL_FEATURES = 'all_features';

class HistoricalBehaviourMap extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      'addedFeatures': [],
      'activeTactic': '',
      'mapData': [],
      'startDate': {},
      'endDate': {},
      'searchValue': '',
      'selectedDate': {},
      'predictionRow': {},
      'changeLabelModal': false,
      'backURL': '',
    };

    this.changeTactic = this.changeTactic.bind(this);
    this.changeDateValue = this.changeDateValue.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.setSelectedDate = this.setSelectedDate.bind(this);
    this.handleSetLabel = this.handleSetLabel.bind(this);
    this.setLabelActionHandler = this.setLabelActionHandler.bind(this);
    this.deleteLabelActionHandler = this.deleteLabelActionHandler.bind(this);
  }

  componentDidMount() {
    const { location } = this.props;
    const queryParams = location.query;
    this.props.getHistoricalData(queryParams, true);

    this.props.fetchColumnFormat(queryParams.pipeline);

    const addedFeatures = [];

    this.setState({
      'addedFeatures': addedFeatures,
      'startDate': moment.utc(queryParams.start_time, dateFormats.mmddyyDash),
      'endDate': moment.utc(queryParams.end_time, dateFormats.mmddyyDash),
      'backURL': locationBackUrl.getBackUrl(),
    }, () => {
      const { historicalData } = this.props;
      if (historicalData.length > 0) {
        const mapData = getMapData(historicalData, defaultDimensions, this.state.activeTactic);
        this.setState({
          'mapData': mapData,
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { addedFeatures, activeTactic } = this.state;

    if (!isEqual(this.props.historicalData, nextProps.historicalData)) {
      if (nextProps.historicalData.length > 0) {
        const mapData = getMapData(
          nextProps.historicalData,
          defaultDimensions.concat(addedFeatures), activeTactic,
        );
        this.setState({
          'mapData': mapData,
        });
      } else {
        this.setState({
          'mapData': [],
        });
      }
    }
    if (!isEqual(this.props.location.query, nextProps.location.query)) {
      this.props.getHistoricalData(nextProps.location.query);
    }
  }

  shouldComponentUpdate(nextState, nextProps) {
    if (!isEqual(this.props.historicalData, nextProps.historicalData)
      || !isEqual(this.state.startDate, nextState.startDate)
      || !isEqual(this.state.endDate, nextState.endDate)
      || !isEqual(this.state.selectedDate, nextState.selectedDate)
      || !isEqual(this.state.addedFeatures, nextState.addedFeatures)) {
      return true;
    }
    return false;
  }

  setLabelActionHandler(row) {
    const { query } = this.props.location;
    const behaviorType = query.behavior_type;
    const getLabels = () => {
      this.props.getSearchData(query);
      this.props.getHistoricalData(query);
    };
    this.props.setLabelHandler(row, behaviorType, getLabels);
  }

  setSelectedDate(selected) {
    const { selectedDate } = this.state;
    let newSelectedDate = {};

    if (!moment.isMoment(selected)) {
      newSelectedDate = moment(selected.date, 'MM - DD - YYYY HH:mm');
    } else {
      newSelectedDate = selected;
    }

    this.setState({
      'selectedDate': isEqual(selectedDate, newSelectedDate) ? {} : newSelectedDate,
    });
  }

  deleteLabelActionHandler(labelId) {
    const { query } = this.props.location;
    const getLabels = () => {
      this.props.getSearchData(query);
      this.props.getHistoricalData(query);
    };
    this.props.deleteLabel(labelId, getLabels);
  }

  handleSetLabel(modal = false, index) {
    const { historicalData, location } = this.props;
    const { pipeline } = location.query;
    const newState = {
      'changeLabelModal': modal,
      'predictionRow': this.state.predictionRow,
    };

    if (modal) {
      newState.predictionRow = {
        ...historicalData[index],
        index,
        pipeline,
        mode: location.query.mode,
        model_name: location.query.model_name,
        id: location.query.entity_id,
        tag_id: historicalData[index].predicted_tag_id,
        method_name: location.query.method_name,
      };
    }

    this.setState(newState);
  }

  changeTactic(value) {
    this.setState({
      'activeTactic': this.state.activeTactic === value ? '' : value,
    });
  }

  addFeatures(feature) {
    const queryParams = this.props.location.query;
    const { addedFeatures } = this.state;
    let newFeatures = [];
    if (feature === ALL_FEATURES) {
      const pipelineFeatures = getUniqueFeatures(entityFeature[queryParams.pipeline]);
      pipelineFeatures.push(ALL_FEATURES);

      // deselecting all
      if (isEqual(addedFeatures.sort(), pipelineFeatures.sort())) {
        newFeatures = [];
      } else {
        // selecting all
        newFeatures = [...this.state.addedFeatures, ...pipelineFeatures];
      }
    } else if (addedFeatures.includes(feature)) {
      addedFeatures.splice(addedFeatures.indexOf(feature), 1);
      // check if all_features is selected before, deselect it
      if (addedFeatures.includes(ALL_FEATURES)) {
        addedFeatures.splice(addedFeatures.indexOf(ALL_FEATURES), 1);
      }
      newFeatures = addedFeatures;
    } else {
      // ading one new feature
      newFeatures = [...this.state.addedFeatures, feature];
    }

    this.setState({
      'addedFeatures': uniq(newFeatures),
    });
  }

  applyFilters() {
    const { addedFeatures, activeTactic, startDate, endDate } = this.state;
    const location = this.props.location;

    const mapData = getMapData(
      this.props.historicalData,
      defaultDimensions.concat(addedFeatures), activeTactic,
    );

    // remove ALL_FEATURES
    delete mapData[0][ALL_FEATURES];

    this.setState({
      'mapData': mapData,
    }, () => {
      if (!moment(location.query.start_time).isSame(startDate, 'day') ||
        !moment(location.query.end_time).isSame(endDate, 'day')) {
        const nextLocation = createURL(
          location.pathname,
          { ...location.query, 'start_time': moment(startDate).format('MM-DD-YYYY'), 'end_time': moment(endDate).format('MM-DD-YYYY') },
        );
        this.props.updateLocation(nextLocation);
      }
    });
  }

  changeDateValue(startDate, endDate) {
    const utcStartDate = !startDate.isUTC() ? moment.utc(startDate.format('MM-DD-YYYY'), 'MM-DD-YYYY') : startDate;
    const utcEndDate = !endDate.isUTC() ? moment.utc(endDate.format('MM-DD-YYYY'), 'MM-DD-YYYY') : endDate;

    this.setState({
      'startDate': utcStartDate,
      'endDate': utcEndDate,
    });
  }


  resetFilters() {
    const queryParams = this.props.location.query;
    const mapData = getMapData(
      this.props.historicalData,
      defaultDimensions,
    );

    this.setState({
      'addedFeatures': [],
      'mapData': mapData,
      'startDate': moment(queryParams.start_time),
      'endDate': moment(queryParams.end_time),
      'activeTactic': '',
    });
  }

  handleSearchInput(e) {
    this.setState({
      'searchValue': e.target.value,
    });
  }

  render() {
    const queryParams = this.props.location.query;
    const { tactics, columnFormatData } = this.props;
    const { mapData, startDate, endDate, searchValue, backURL } = this.state;
    const allTactics = [{ 'id': 'alltactics', 'content': 'All Tactics' }];

    const pipelineFeatures = getUniqueFeatures(entityFeature[queryParams.pipeline]);

    let pipelineFeaturesName = [];
    if (columnFormatData.length > 0) {
      pipelineFeaturesName = formatFeatures(pipelineFeatures, columnFormatData);
      pipelineFeaturesName.sort((a, b) => {
        if (a.content < b.content) {
          return -1;
        }

        if (a.content > b.content) {
          return 1;
        }

        return 0;
      });
      pipelineFeaturesName.unshift({
        'content': 'All features',
        'id': ALL_FEATURES,
      });
    }

    const tableData = getTableData(this.props.historicalData, queryParams.pipeline, searchValue);

    let filteredData = tableData;

    if (searchValue !== '') {
      filteredData = tableData.filter((entity) => {
        const searchBy = searchValue.toLowerCase();

        if (entity.entity_name.split(' ').length === 2) {
          if (entity.entity_name.split(' ')[0].includes(searchBy)
            || entity.entity_name.split(' ')[1].includes(searchBy)) {
            return entity;
          }
        }
        if (entity.entity_name.includes(searchBy)) {
          return entity;
        }
        return null;
      });
    }

    const rowHighlightIndex = findIndex(filteredData, item => isSameDay(
      moment(item.date, 'MM - DD - YYYY HH:mm'),
      moment(this.state.selectedDate),
    ));

    const availableTactics = getAvailableTactics(filteredData, tactics);

    return (
      <div className="historical-behaviour">
        <div className="historical-behaviour__header">
          <span className="historical-behaviour__title">
            <FormattedMessage id="historical.title" />
          </span>
          <span className="historical-behaviour__title--entity">
            {queryParams.entity_name}
          </span>
        </div>
        <div className="historical-behaviour__row">
          <span className="historical-behaviour__backBTNSection">
            { backURL && <BackTo
              className="backButton"
              onClick={() => this.props.updateLocation(backURL)}
              text="Back to Exploded View"
            /> }
          </span>
        </div>

        {!this.props.isHistoricalDataLoaded && <Loader />}

        <div className="historical-behaviour__row">
          <div className="historical-behaviour__filters">
            <DateRange
              startDate={startDate}
              endDate={endDate}
              updateDateRange={this.changeDateValue}
            />
            {
              columnFormatData.length > 0 &&
              <SelectBox
                autocomplete
                hasScrollbar
                activeOption={this.state.addedFeatures}
                options={pipelineFeaturesName}
                onClick={values => this.addFeatures(values)}
                placeholder="Select to add feature"
                style={{ 'marginRight': 20 }}
              />
            }
            <SelectBox
              singleSelect
              hasScrollbar
              activeOption={this.state.activeTactic}
              options={allTactics.concat(availableTactics)}
              onClick={value => this.changeTactic(value)}
              placeholder="Tactics"
              style={{ 'marginRight': 20 }}
            />
          </div>
          <div>
            <Button
              className="button--success +small"
              onClick={() => this.applyFilters()}
            >Apply
            </Button>
            <Button
              className="button--dark +small"
              onClick={() => this.resetFilters()}
            >Reset
            </Button>
          </div>
        </div>
        <div className="historical-behaviour__row--chart">
          <D3HistoricalBehaviourMap
            startDate={startDate}
            endDate={endDate}
            featuresNumber={(defaultDimensions.concat(this.state.addedFeatures)).length}
            historicalData={mapData}
            columnFormat={this.props.columnFormatData}
            selectedDate={this.state.selectedDate}
            setSelectedDate={this.setSelectedDate}
          />
        </div>
        <div className="historical-behaviour__row">
          <AdvancedTable
            data={filteredData.map((el, index) => ({
              ...el,
              'handlers': {
                ...el.handlers,
                'setLabel': (e) => {
                  e.stopPropagation();
                  this.handleSetLabel(true, index);
                },
                'deleteLabel': (e) => {
                  e.stopPropagation();
                  this.deleteLabelActionHandler(el.user_tag_id);
                },
              },
            }))}
            rowHeight={40}
            tableConfig={historicalTableFormatData}
            onRowClick={this.setSelectedDate}
            rowHighlightIndex={rowHighlightIndex}
            locationPage={HBM_TABLE}
          >
            <Search
              placeholder="Search for entity"
              value={searchValue}
              onChange={this.handleSearchInput}
            />
          </AdvancedTable>
        </div>
        {
          this.state.changeLabelModal && (
            <Modal>
              <ChangeLabel
                predictionRow={this.state.predictionRow}
                onCancel={() => this.handleSetLabel()}
                onSave={this.setLabelActionHandler}
                title={findEntityName(this.state.predictionRow.pipeline, this.state.predictionRow) !== ''
                  ? <FormattedHTMLMessage
                    id="historical.setLabelFor"
                    values={{ 'entity_name': findEntityName(this.state.predictionRow.pipeline, this.state.predictionRow) }}
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

HistoricalBehaviourMap.displayName = 'HistoricalBehaviourMap';

HistoricalBehaviourMap.propTypes = {
  'location': PropTypes.object,
  'tactics': PropTypes.array,
  'columnFormatData': PropTypes.array,
  'updateLocation': PropTypes.func.isRequired,
  'getSearchData': PropTypes.func,
  'fetchColumnFormat': PropTypes.func,
  'setLabelHandler': PropTypes.func.isRequired,
  'deleteLabel': PropTypes.func.isRequired,
  'getHistoricalData': PropTypes.func,
  'historicalData': PropTypes.array,
  'isHistoricalDataLoaded': PropTypes.bool,
};

HistoricalBehaviourMap.defaultProps = {
  'location': {},
  'tactics': [],
  'columnFormatData': [],
  'getSearchData': () => null,
  'fetchColumnFormat': () => null,
  'setLabelHandler': () => { },
  'getHistoricalData': () => {},
  'historicalData': {},
  'isHistoricalDataLoaded': false,
};

const mapStateToProps = state => ({
  'tactics': tagsSelectBox(state),
  'columnFormatData': state.raw.toJS().columnFormat.items,
  'historicalData': state.raw.toJS().explodedView.historicalData || {},
  'isHistoricalDataLoaded': state.raw.toJS().loadStatus.historicalAPI || false,
});

const mapDispatchToProps = dispatch => ({
  'updateLocation': location => dispatch(routerActions.push(location)),
  'getSearchData': params => dispatch(getSearchData(params)),
  'fetchColumnFormat': params => dispatch(fetchColumnFormat(params)),
  'setLabelHandler': (...params) => dispatch(setLabelHandler(...params)),
  'deleteLabel': (...args) => dispatch(deleteLabel(...args)),
  'getHistoricalData': (...args) => dispatch(getHistoricalData(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalBehaviourMap);
