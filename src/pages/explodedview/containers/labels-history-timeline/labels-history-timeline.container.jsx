import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { compose } from 'redux';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import { Button } from 'components/forms';
import NoData from 'components/no-data';
import Modal from 'components/modal';
import ChangeLabel from 'containers/change-label';
import { findEntityName, getEntityTypeByPipeline } from 'lib/decorators';
import { getSourceLog } from 'lib';

import Section from '../../components/section';
import TimelineChart from '../../components/timelinechart';

import {
  withSearchData,
  withLabelsHistoryData,
  withLabelsActions,
  withLocationData,
  withHistoricalData,
} from '../../hoc';
import { entityNodebookID } from '../../config';

export class LabelsHistoryTimeline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'predictionRow': {},
      'changeLabelModal': false,
      'openModal': false,
    };

    this.handleInvestigate = this.handleInvestigate.bind(this);
    this.handleSetLabel = this.handleSetLabel.bind(this);
    this.setLabelActionHandler = this.setLabelActionHandler.bind(this);
    this.handleVirusScan = this.handleVirusScan.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { labelsHistory, searchData } = nextProps;
    const entityDate = moment(searchData.ts);
    let labelFound = false;
    for (let i = 0; i < labelsHistory.length; i += 1) {
      const labelDate = moment(labelsHistory[i].create_time);
      if (labelDate.isSame(entityDate, 'day')) {
        labelFound = true;
      }
    }
    this.props.changeSetLabelDisplay(labelFound);
  }

  setLabelActionHandler(row) {
    const { location } = this.props;
    const behaviorType = location.behavior_type;
    const getLabels = () => {
      this.props.getEntityLabelHistory(location);
      this.props.getSearchData(location);
      this.props.getHistoricalData(location);
      this.props.changeSetLabelDisplay(true);
    };

    const params = row;
    if (behaviorType !== 'suspicious' && behaviorType !== 'malicious') {
      if (!params.mode) {
        params.mode = location.mode;
      }
      if (!params.model_name) {
        params.model_name = location.model_name;
      }
    }
    this.props.setLabelHandler(row, behaviorType, getLabels);
  }


  handleVirusScan() {
    const { location } = this.props;
    const baseUrl = 'https://www.virustotal.com/#/';
    let url = `${baseUrl}home/search/`;

    if (location.pipeline === 'domain' || location.pipeline === 'sipdomain') {
      let domain;

      switch (location.pipeline) {
        case 'domain':
          domain = location.entity_name;
          break;
        case 'sipdomain':
          const dataSplit = location.entity_name.split(' ');
          domain = dataSplit[1];
          break;
        default:
          domain = '';
      }

      url = `${baseUrl}domain/${domain}`;
    }

    const win = window.open(url, '_blank');
    win.focus();
  }

  handleInvestigate() {
    const { searchData, location } = this.props;
    const pipeline = location.pipeline;
    const sourceLog = getSourceLog(pipeline, searchData);

    const entityName = `entity_name=${findEntityName(pipeline, searchData)}`;
    const entityType = `entity_type=${getEntityTypeByPipeline(pipeline)}`;
    const customerName = `customer_name=${this.props.customerName}`;
    const date = `date=${moment(this.props.searchData.ts).format('MM/DD/YYYY hh:mm A')}`;
    const sourceStr = `source=${sourceLog}`;
    const pipelineStr = `pipeline=${pipeline}`;

    const investigateURL = `/analytics/#/notebook/${entityNodebookID}?${customerName}&${entityName}&${entityType}&${pipelineStr}&${date}&${sourceStr}`;
    const win = window.open(investigateURL, '_blank');
    win.focus();
  }

  handleSetLabel(modal = true) {
    if (!this.props.setLabelDisabled) {
      const { searchData, location } = this.props;
      const { pipeline } = location;
      const newState = {
        'changeLabelModal': modal,
        'openModal': modal,
        'predictionRow': this.state.predictionRow,
      };

      if (modal) {
        newState.predictionRow = {
          ...searchData,
          pipeline,
          method_name: location.method_name,
          id: location.entity_id,
          tag_id: searchData.predicted_tag_id,
          entity_type: getEntityTypeByPipeline(pipeline),
        };
      }

      this.setState(newState);
    }
  }

  render() {
    const { startDate, endDate } = this.props;

    return (
      <Section
        size="medium"
        className="+no-margin +overflow-visible"
        loaded
        isDraggable={this.props.isDraggable}
      >
        <div className="labelTimelineTop">
          <div className="dateRange">
            <div className="dateRange__presentation">
              <div className="dateRange__presentation__column">
                <span>From: <span className="dateRangeDate">{moment(startDate).format('MM - DD - YYYY')}</span></span>
                <span>Until: <span className="dateRangeDate">{moment(endDate).format('MM - DD - YYYY')}</span></span>
              </div>
            </div>
          </div>
          <span className="icon-drag" />
          <div>
            <Button
              className="button--success +small"
              disabled={this.props.setLabelDisabled}
              onClick={() => this.handleSetLabel(true)}
            >
                Set Label
            </Button>
            <Button
              className="button--dark +small"
              onClick={this.handleVirusScan}
            >
                Virus Total
            </Button>
            <Button
              className="button--dark +small"
              onClick={this.handleInvestigate}
            >
                Investigate
            </Button>
          </div>
        </div>

        <div>
          { this.props.labelsHistory.length <= 0 &&
          <NoData
            intlId="global.nodata"
            intlDefault="There is no data to display"
            className="nodata--timeline"
            withIcon
          />
          }
          <TimelineChart
            data={this.props.labelsHistory}
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        {
          this.state.openModal && (
            <Modal>
              { this.state.changeLabelModal &&
              <ChangeLabel
                predictionRow={this.state.predictionRow}
                onCancel={() => this.handleSetLabel(false)}
                onSave={this.setLabelActionHandler}
                title={findEntityName(this.state.predictionRow.pipeline, this.state.predictionRow) !== ''
                  ? <FormattedHTMLMessage
                    id="evp.setLabel"
                    values={{ 'entityName': findEntityName(this.state.predictionRow.pipeline, this.state.predictionRow) }}
                  />
                  : <FormattedMessage id="evp.setLabel" />}
              />
              }
            </Modal>
          )
        }
      </Section>
    );
  }
}

LabelsHistoryTimeline.displayName = 'LabelsHistoryTimeline';

LabelsHistoryTimeline.propTypes = {
  // 'isLabelsHistoryLoaded': PropTypes.bool,
  'startDate': PropTypes.object,
  'endDate': PropTypes.object,
  'labelsHistory': PropTypes.array,
  'searchData': PropTypes.object,
  'location': PropTypes.object,
  'customerName': PropTypes.string,
  'setLabelHandler': PropTypes.func,
  'getSearchData': PropTypes.func,
  'getHistoricalData': PropTypes.func,
  'getEntityLabelHistory': PropTypes.func,
  'setLabelDisabled': PropTypes.bool,
  'changeSetLabelDisplay': PropTypes.func,
  'isDraggable': PropTypes.bool,
};

LabelsHistoryTimeline.defaultProps = {
  // 'isLabelsHistoryLoaded': false,
  'startDate': moment(),
  'endDate': moment(),
  'labelsHistory': [],
  'searchData': {},
  'location': {},
  'customerName': '',
  'setLabelHandler': () => {},
  'getSearchData': () => {},
  'getHistoricalData': () => {},
  'getEntityLabelHistory': () => {},
  'setLabelDisabled': false,
  'changeSetLabelDisplay': () => {},
  'isDraggable': true,
};

const enhance = compose(
  withHistoricalData,
  withSearchData,
  withLabelsHistoryData,
  withLocationData,
  withLabelsActions,
);
export default enhance(LabelsHistoryTimeline);
