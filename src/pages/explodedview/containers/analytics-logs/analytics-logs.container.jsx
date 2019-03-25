import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { compose } from 'redux';

import Tabs from 'components/tabs';
import SelectBox from 'components/select-box';
import AdvancedTable from 'components/advanced-table';
import { ANALYTICS_LOGS_TABLE, ANALYTICS_LOGS_SECOND_TABLE } from 'config';

import { getSourceLog } from 'lib';
import entityNameFromPipeline from 'lib/decorators/entity-name-from-pipeline';
import { getLogsEDR } from 'model/actions/exploded-view';

import Section from '../../components/section';
import List from '../../components/list';
import { withLocationData, withFullSearchData, withColumnFormatData, withLogsData, withHistoricalData } from '../../hoc';
import { getBehaviour30daysTableData, getFWLogsTable, getEDRLogsTable } from './config';

import {
  pipelineTabs,
  entityFeature,
  tabsIdToName,
  ANALYTICS,
  analyticsOptions,
  historical30daysTableFormatData,
  LogsTabs,
  logsDataTableFormatData,
} from '../../config';

import './analytics-logs.style.scss';

const LOGS = 'LOGS';

const formatTabsData = data => data.reduce((acc, value) => [...acc, {
  'id': value,
  'title': tabsIdToName(value) !== '' ? tabsIdToName(value) : value,
}], []);

const getTabs2 = pipeline => pipelineTabs(pipeline);

const getTabs3 = (pipeline, subView2) => {
  let tabs3 = [];
  const activeTabData = pipelineTabs(pipeline).filter(tab => tab.id === subView2);
  if (activeTabData.length > 0 && activeTabData[0].children) {
    const tabsIds = activeTabData[0].children;
    tabs3 = tabsIds.length !== 0 ? formatTabsData(tabsIds) : [];
  }
  return tabs3;
};

export class AnalyticsLogs extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      'analyticsOption': analyticsOptions[1].id,
      'subView1': '',
      'analyticsSubView2': '',
      'analyticsSubView3': '',
      'logsSubView2': '',
    };

    this.changeSubView = this.changeSubView.bind(this);
    this.changeStateValue = this.changeStateValue.bind(this);
    this.fetchFWLogs = this.fetchFWLogs.bind(this);
    this.fetchDNSLogs = this.fetchDNSLogs.bind(this);
    this.fetchEDRLogs = this.fetchEDRLogs.bind(this);
  }

  componentDidMount() {
    const { defaultSubView } = this.props;
    const { pipeline } = this.props.location;
    const { analyticsSubView2 } = this.state;

    const tabs2 = getTabs2(pipeline);
    const tabs3 = tabs2.length > 0
      ? getTabs3(pipeline, tabs2[0].id)
      : getTabs3(pipeline, analyticsSubView2);

    this.setState({
      'subView1': defaultSubView,
      'analyticsSubView2': tabs2.length > 0 ? tabs2[0].id : '',
      'analyticsSubView3': tabs3.length > 0 ? tabs3[0].id : '',
      'logsSubView2': LogsTabs.length > 0 ? LogsTabs[0].id : '',
    });

    this.props.getHistoricalData(this.props.location);
  }
  componentWillReceiveProps(nextProps) {
    const { location, searchData } = this.props;
    if (!isEqual(nextProps.searchData, searchData)) {
      this.fetchFWLogs(nextProps);
      this.fetchDNSLogs(nextProps);
      this.fetchEDRLogs(nextProps);
    }

    if (!isEqual(location, nextProps.location)) {
      this.props.getHistoricalData(nextProps.location);
    }
  }

  shouldComponentUpdate(nextState, nextProps) {
    const { subView1, analyticsSubView2, analyticsSubView3, logsSubView2 } = this.state;

    return !isEqual(this.props.searchData, nextProps.searchData)
      || !isEqual(this.props.historicalData, nextProps.historicalData)
      || subView1 !== nextState.subView1
      || analyticsSubView2 !== nextState.subView2
      || analyticsSubView3 !== nextState.subView3
      || logsSubView2 !== nextState.logsSubView2;
  }

  fetchFWLogs(nextProps = {}) {
    const { location } = this.props;

    const FWlogsParams = {
      entity_name: location.entity_name,
      pipeline: location.pipeline,
      date: location.end_time,
      customer_name: this.props.customerName,
      source: getSourceLog(location.pipeline, nextProps.searchData),
    };
    this.props.getLogsFWProxy(FWlogsParams);
  }

  fetchDNSLogs(nextProps = {}) {
    const { location } = this.props;

    if ((location.pipeline === 'domain' || location.pipeline === 'sipdomain') && nextProps.searchData.length) {
      const DNSlogsParams = {
        startDate: moment(nextProps.searchData[0].ts).format('YYYY-MM-DD'),
        domain: entityNameFromPipeline(location).domain,
      };
      this.props.getLogsDNS(DNSlogsParams);
    }
  }

  fetchEDRLogs(nextProps = {}) {
    const { location } = this.props;

    if (location.pipeline === 'sip') {
      const EDRlogsParams = {
        entity_name: location.entity_name,
        entity_type: 'ip',
        start_date: moment(nextProps.searchData[0].ts).format('YYYY-MM-DD'),
        end_date: moment(nextProps.searchData[0].ts).format('YYYY-MM-DD'),
      };
      this.props.getLogsEDR(EDRlogsParams);
    }
  }

  changeSubView(key, nextView) {
    this.setState({
      [key]: nextView,
    }, () => {
      if (key === 'analyticsSubView2') {
        const tabs3 = getTabs3(this.props.location.pipeline, nextView);
        this.setState({
          'analyticsSubView3': tabs3.length > 0 ? tabs3[0].id : '',
        });
      }
    });
  }

  changeStateValue(option) {
    const { analyticsOption } = this.state;

    const changeStateOption = option !== analyticsOption;

    if (changeStateOption) {
      this.setState({
        'analyticsOption': option,
      });
    }
  }


  render() {
    const { subView1, analyticsSubView2, analyticsSubView3, logsSubView2 } = this.state;
    const {
      className,
      searchData,
      historicalData,
      columnFormat,
      isColumnFormatDataLoaded,
      isSearchDataLoaded,
      isHistoricalDataLoaded,
      logsData,
    } = this.props;
    const {
      pipeline,
      modelType,
    } = this.props.location;

    const tabs1 = [
      {
        'id': ANALYTICS,
        'title': 'Analytics',
      },
      {
        'id': LOGS,
        'title': 'Logs',
      },
      // {
      //   'id': EVENTSBOX,
      //   'title': 'Events Box',
      // },
    ];

    const tabs2 = getTabs2(pipeline);
    const tabs3 = getTabs3(pipeline, analyticsSubView2);
    const dataLoaded = isSearchDataLoaded && isColumnFormatDataLoaded && isHistoricalDataLoaded;
    const isDataLoaded = dataLoaded || false;
    let customClassName = 'historical';
    if (this.state.analyticsOption !== analyticsOptions[0].id) {
      customClassName = 'behavior';
    }
    const renderAnalytics = (
      <div>
        <SelectBox
          singleSelect
          activeOption={this.state.analyticsOption}
          options={analyticsOptions}
          onClick={this.changeStateValue}
          customClassName={customClassName}
        />
        {
          this.state.analyticsOption === analyticsOptions[0].id ? (
            <AdvancedTable
              data={getBehaviour30daysTableData(historicalData, pipeline)}
              tableConfig={historical30daysTableFormatData(pipeline, modelType)}
              classname="dark-background"
              locationPage={ANALYTICS_LOGS_TABLE}
            />
          ) : (
            <div>
              {
                tabs2.length > 0 && (
                  <Tabs
                    active={analyticsSubView2}
                    className="tabsV2"
                    items={tabs2}
                    style={{ 'margin': 10 }}
                    onClick={nextTab => this.changeSubView('analyticsSubView2', nextTab)}
                    slim
                  />
                )
              }
              <Section size="large" className="no-height +analytics-tab" loaded={isDataLoaded}>
                {
                  Object.keys(entityFeature[pipeline]).length > 0 && tabs3.length > 0 &&
                  <Tabs
                    active={analyticsSubView3}
                    className="tabsV2"
                    items={tabs3}
                    style={{ 'margin': 10 }}
                    onClick={nextTab => this.changeSubView('analyticsSubView3', nextTab)}
                    slim
                  />
                }
                <List
                  type={ANALYTICS}
                  data={searchData[0]}
                  columnFormat={columnFormat}
                  tabData={entityFeature[pipeline][analyticsSubView3]}
                  pipeline={pipeline}
                  customClass={{
                    base: 'standard-card',
                    modifiers: ['+outlayed', '+underline', '+analytics'],
                  }}
                />
              </Section>
            </div>
            )
        }
      </div>
    );

    const renderLogs = () => {
      let logs = logsData[this.state.logsSubView2];
      if (this.state.logsSubView2 === 'FW/Proxy') {
        logs = getFWLogsTable(logs);
      }
      if (this.state.logsSubView2 === 'EDR') {
        logs = getEDRLogsTable(logs);
      }
      return (
        <div>
          <Tabs
            active={logsSubView2}
            className="tabsV2"
            items={LogsTabs}
            style={{ 'margin': 10 }}
            onClick={nextTab => this.changeSubView('logsSubView2', nextTab)}
            slim
          />
          <AdvancedTable
            data={logs}
            tableConfig={logsDataTableFormatData[this.state.logsSubView2]}
            classname="dark-background"
            locationPage={ANALYTICS_LOGS_SECOND_TABLE}
          />
        </div>
      );
    };

    return (
      <Section
        size="large"
        className="overflow-visible +no-background +no-height +analitycs-section"
        loaded
      >
        <div className={className}>
          <div className={`${className}__header`}>
            <Tabs
              active={subView1}
              className="tabsV2"
              items={tabs1}
              style={{ 'margin': 10 }}
              onClick={nextTab => this.changeSubView('subView1', nextTab)}
            />
          </div>
          {subView1 === tabs1[0].id && renderAnalytics}
          {subView1 === tabs1[1].id && renderLogs()}
        </div>
      </Section>
    );
  }
}


AnalyticsLogs.displayName = 'AnalyticsLogs';
AnalyticsLogs.propTypes = {
  'location': PropTypes.object.isRequired,
  'defaultSubView': PropTypes.oneOf([
    ANALYTICS, LOGS,
  ]),
  'pipeline': PropTypes.string,
  'searchData': PropTypes.array,
  'columnFormat': PropTypes.any,
  'customerName': PropTypes.string,
  'className': PropTypes.string,
  'modelType': PropTypes.string,
  'isSearchDataLoaded': PropTypes.bool,
  'isColumnFormatDataLoaded': PropTypes.bool,
  'getLogsFWProxy': PropTypes.func,
  'getLogsDNS': PropTypes.func,
  'logsData': PropTypes.object,
  'getHistoricalData': PropTypes.func,
  'historicalData': PropTypes.array,
  'isHistoricalDataLoaded': PropTypes.bool,
  'getLogsEDR': PropTypes.func.isRequired,
};

AnalyticsLogs.defaultProps = {
  'defaultSubView': ANALYTICS,
  'pipeline': '',
  'searchData': [],
  'columnFormat': [],
  'className': 'analytics-logs',
  'modelType': '',
  'customerName': '',
  'isSearchDataLoaded': false,
  'isColumnFormatDataLoaded': false,
  'getLogsFWProxy': () => null,
  'getLogsDNS': () => null,
  'logsData': {},
  'getHistoricalData': () => {},
  'historicalData': {},
  'isHistoricalDataLoaded': false,
};

const mapDispatchToProps = dispatch => ({
  'getLogsEDR': (...params) => dispatch(getLogsEDR(...params)),
});

export const mapStateToProps = state => ({
  'customerName': state.raw.toJS().systemInfo.customer_name,
});

const enhance = compose(
  withHistoricalData,
  withLogsData,
  withColumnFormatData,
  withLocationData,
  withFullSearchData,
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(AnalyticsLogs);
