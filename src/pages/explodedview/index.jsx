import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { Link } from 'react-router';
import moment from 'moment';

import { Responsive, WidthProvider } from 'react-grid-layout';

import { FormattedMessage } from 'react-intl';
import { isEqual, isEmpty } from 'lodash';

import { dateFormats } from 'config';
import { createURL, getSourceLog, clearSessionStorage, locationBackUrl } from 'lib';
import { fetchColumnFormat } from 'model/actions';
import { getVulnerabilityReportCardData } from 'model/selectors';
import {
  getEntityLabelHistory,
  getClusterRelations,
  getSearchData,
  getRelatedEntitiesData,
  getEntityInfo,
  getNXDomains,
  getVulnerabilityReportData,
  getDHCPData,
  getDetailsData,
} from 'model/actions/exploded-view';

import CardsSelectBox from './components/cards-select-box';
import DetailsCard from './containers/details-card';
import LabelsHistoryCard from './containers/labels-history-card';
import LabelsHistoryTimeline from './containers/labels-history-timeline';
import AnalyticsLogs from './containers/analytics-logs';
import Top3FeaturesCard from './containers/top-3-features';
import Geolocation from './containers/geolocation';
import DomainInfoCard from './containers/domain-info-card';
import ExternalEnrichmentCard from './containers/external-enrichment-card';
import NXDomainsCard from './containers/nx-domain-card';
import RelatedUsers from './containers/related-users-card';
import RelatedSourceIP from './containers/related-source-ip-card';
import FeaturePlot from './containers/feature-plot-card';
import DHCPCard from './containers/dhcp-card';
import ContributionPredictionScore from './containers/contribution-card';
import Section from './components/section';
import BackTo from '../behavior/components/back-to/';
import List, { VULNERABILITY_REPORT } from './components/list';

import './explodedview.style.scss';

import {
  generateConfig,
  getCardConfig,
  getCardsByPipeline,
  getConfigFromLocalStorage,
  saveConfigToLocalStorage,
} from './cards-config';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export class ExplodedView extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      'startDate': {},
      'endDate': {},
      'config': [],
      'setLabelDisabled': false,
      'windowWidth': 0,
      'cols': { lg: 3, md: 2, sm: 1 },
      'rowHeight': 330,
      'currentBreakpoint': 'lg',
      'dragHasStarted': false,
      'modalContent': '',
      'backURL': '',
    };

    this.containerRef = null;
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.changeSetLabelDisplay = this.changeSetLabelDisplay.bind(this);
    this.getNXHandler = this.getNXHandler.bind(this);
    this.goBackHandler = this.goBackHandler.bind(this);
    this.generateLayout = this.generateLayout.bind(this);
    this.generateCards = this.generateCards.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.updateCardsOptions = this.updateCardsOptions.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.dragToggleEvent = this.dragToggleEvent.bind(this);
    this.renderGridBoxes = this.renderGridBoxes.bind(this);
    this.updateModalContentHandler = this.updateModalContentHandler.bind(this);
  }

  componentWillMount() {
    clearSessionStorage();
  }

  componentDidMount() {
    const { location } = this.props;
    const queryParams = location.query;

    if (Object.keys(this.props.searchData).length === 0) {
      this.props.getSearchData(queryParams);
    }

    this.props.getClusterRelations(queryParams);
    this.props.getEntityLabelHistory(queryParams);
    this.props.getRelatedEntitiesData(queryParams);
    this.props.fetchColumnFormat(queryParams.pipeline);
    this.props.getEntityInfo(queryParams);
    this.props.getTenableReportData(queryParams.entity_name);
    this.props.getDHCPData(queryParams);
    this.props.getDetailsData(queryParams);

    const localStorageConfig = getConfigFromLocalStorage(queryParams.pipeline);

    locationBackUrl.setBackUrl('/historical-behaviour-map');
    locationBackUrl.setBackUrl('/vulnerability-report');

    this.setState({
      'startDate': moment.utc(queryParams.end_time, dateFormats.mmddyyDash).startOf('day').subtract(30, 'days'),
      'endDate': moment.utc(queryParams.end_time, dateFormats.mmddyyDash).endOf('day'),
      'backURL': locationBackUrl.getBackUrl(),
      'config': !isEmpty(localStorageConfig) ? localStorageConfig : getCardsByPipeline(queryParams.pipeline),
    });

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.location, nextProps.location)) {
      const queryParams = nextProps.location.query;

      this.props.getSearchData(queryParams);
      this.props.getClusterRelations(queryParams);
      this.props.getEntityLabelHistory(queryParams);
      this.props.getRelatedEntitiesData(queryParams);
      this.props.fetchColumnFormat(queryParams.pipeline);
      this.props.getEntityInfo(queryParams);
      this.props.getTenableReportData(queryParams.entity_name);
      this.props.getDHCPData(queryParams);
      this.props.getDetailsData(queryParams);
    }

    if (!isEmpty(nextProps.searchData)) {
      this.getNXHandler(nextProps.searchData);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  onLayoutChange(newLayout) {
    const { config } = this.state;
    const newConfig = generateConfig(newLayout, config, this.props.location.query.pipeline);
    this.setState({
      config: newConfig,
    }, () => saveConfigToLocalStorage(this.props.location.query.pipeline, newConfig));
  }

  /*
    Responsive Grid Layout
    The available breakpoints are { lg: 1500, md: 1000, sm: 600 }
    When window width is updated by resize, the corresponding breakpoint is set
  */
  onBreakpointChange(breakpoint) {
    this.setState({
      'currentBreakpoint': breakpoint,
    });
  }

  getNXHandler(searchData) {
    if (this.props.location.query.pipeline !== 'sip') {
      return;
    }

    const { location, customerName } = this.props;
    const { query } = location;
    const tagId = searchData.predicted_tag ? searchData.predicted_tag.id : null;
    const params = {
      behavior: query.behavior_type,
      customer: customerName,
      date: query.end_time,
      pipeline: query.pipeline,
      source: getSourceLog(query.pipeline, searchData),
    };

    if (tagId) {
      params.tag = tagId;
    }
    if (query.entity_id && query.entity_id !== '') {
      params.entity_id = query.entity_id;
    }

    this.props.getNXDomains(params);
  }

  dragToggleEvent(started = true) {
    this.setState({
      'dragHasStarted': started,
    });
  }

  /*
  Called when the window is resized
*/
  updateWindowDimensions() {
    const windowWidth = window.innerWidth - 140;
    this.setState({ windowWidth });
  }

  updateModalContentHandler(modalContent) {
    this.setState({ modalContent });
  }

  goBackHandler() {
    this.props.updateLocation(this.state.backURL);
  }

  /**
   * It creates the grid items props
   * Calculates for each card its x and y coordinates
   * @returns {{x, y, w, minW, h, i}[]}
   */
  generateLayout() {
    const { config, cols } = this.state;

    let currentAvailablePosition = 0;
    let yValue = 0;
    return config.filter(item => item.visible).map((row) => {
      const card = getCardConfig(row.id, currentAvailablePosition, yValue);
      currentAvailablePosition += card.w;

      if (currentAvailablePosition >= cols[this.state.currentBreakpoint]) {
        yValue += card.h;
        currentAvailablePosition = 0;
      }

      return card;
    });
  }

  changeSetLabelDisplay(value) {
    this.setState({
      'setLabelDisabled': value,
    });
  }

  /*
  Filters cards by visibility
  Returns cards as grid items
*/
  generateCards() {
    const { config } = this.state;
    const { searchData, location } = this.props;
    const queryParams = location.query;
    const { mmddyyDash } = dateFormats;

    return config.filter(card => card.visible).map((card) => {
      switch (card.id) {
        case 'detailsCard':
          return (
            <div key={card.id}>
              <DetailsCard />
            </div>
          );
        case 'labelsHistoryTimeline':
          return (
            <div key={card.id}>
              <LabelsHistoryTimeline
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                setLabelDisabled={this.state.setLabelDisabled}
                changeSetLabelDisplay={this.changeSetLabelDisplay}
              />
            </div>
          );
        case 'labelsHistoryCard':
          return (
            <div key={card.id}>
              <LabelsHistoryCard
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                setLabelDisabled={this.state.setLabelDisabled}
                changeSetLabelDisplay={this.changeSetLabelDisplay}
              />
            </div>
          );
        case 'geolocation':
          return (
            <div key={card.id}>
              <Geolocation onModalOpen={this.updateModalContentHandler} />
            </div>
          );
        case 'top3FeaturesCard':
          return (
            <div key={card.id}>
              <Top3FeaturesCard />
            </div>
          );
        case 'domainInfoCard':
          return (
            <div key={card.id}>
              <DomainInfoCard />
            </div>
          );
        case 'externalEnrichmentCard':
          return (
            <div key={card.id}>
              <ExternalEnrichmentCard />
            </div>
          );
        case 'nxDomain':
          return (
            <div key={card.id}>
              <NXDomainsCard onModalOpen={this.updateModalContentHandler} />
            </div>
          );
        case 'relatedUsers':
          return (
            <div key={card.id}>
              <RelatedUsers />
            </div>
          );
        case 'relatedSourceIPs':
          return (
            <div key={card.id}>
              <RelatedSourceIP />
            </div>
          );
        case 'vulnerabilityReport':
          const linkToVulnerabilityReportPage = createURL(
            '/vulnerability-report',
            {
              ...queryParams,
              'start_time': moment(queryParams.start_time, mmddyyDash).format(mmddyyDash),
              'end_time': moment(queryParams.end_time, mmddyyDash).format(mmddyyDash),
            },
          );
          return (
            <div key={card.id}>
              <Section size="small" title="Vulnerability Report" loaded>
                <List
                  type={VULNERABILITY_REPORT}
                  data={this.props.tenableReportData}
                  customClass={{
                    base: 'details-card',
                  }}
                />
                <div className="explodedView__toListing">
                  <Link to={linkToVulnerabilityReportPage}>
                    <span className="icon-chevron-right" />
                    <FormattedMessage id="evp.toVulnerabilityReportPage" />
                  </Link>
                </div>
              </Section>
            </div>
          );
        case 'featurePlot':
          return (
            <div key={card.id}>
              <FeaturePlot
                searchData={searchData}
                modelName={queryParams.model_name || searchData.model_name}
              />
            </div>
          );
        case 'contributionPredictionScore':
          return (
            <div key={card.id}>
              <ContributionPredictionScore />
            </div>
          );
        case 'DHCPCard':
          return (
            <div key={card.id}>
              <DHCPCard />
            </div>
          );
        default:
          return null;
      }
    });
  }

  /**
   * Updates the config when user wants to hide or show a card
   * @param e
   */
  updateCardsOptions(e) {
    const currentId = e.target.getAttribute('data-id') !== null
      ? e.target.getAttribute('data-id')
      : e.target.parentNode.getAttribute('data-id');

    let { config } = this.state;

    config = config.map((card) => {
      const item = card;

      if (item.id === currentId.toString()) {
        item.visible = !item.visible;
      }

      return item;
    });

    this.setState({
      config,
    });
  }

  /*
  Create and return the grid backgroud divs, which can be seen when
  user is dragging a card
*/
  renderGridBoxes() {
    const gridHeight = this.containerRef ? this.containerRef.clientHeight : 0;

    if (gridHeight > 0) {
      const gridDivs = [];
      const colsNr = this.state.cols[this.state.currentBreakpoint];
      const gridRows = Math.floor(gridHeight / this.state.rowHeight) * colsNr;

      let index = 0;
      while (index < gridRows) {
        gridDivs.push(<div
          key={index}
          className={this.state.dragHasStarted ? `gridItemActive gridItemActive--${colsNr}` : ''}
        />);
        index += 1;
      }

      return gridDivs;
    }
    return null;
  }

  renderReactGrid() {
    const { rowHeight, cols, windowWidth } = this.state;
    const layout = {};
    layout[this.state.currentBreakpoint] = this.generateLayout();

    return (
      <div className="explodedView__grid">
        <div className="explodedView__grid--background" ref={ref => this.containerRef = ref}>
          {this.renderGridBoxes()}
        </div>
        <ResponsiveReactGridLayout
          className="layout"
          rowHeight={rowHeight}
          verticalCompact
          breakpoints={{ lg: 1500, md: 1000, sm: 600 }}
          cols={cols}
          width={windowWidth}
          layouts={layout}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          draggableHandle=".icon-drag"
          containerPadding={[0, 0]}
          onDragStart={() => this.dragToggleEvent()}
          onDragStop={() => this.dragToggleEvent(false)}
        >
          {this.generateCards()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }

  render() {
    const { config } = this.state;
    const { searchData } = this.props;

    if (Object.keys(searchData).length > 0) {
      searchData.behavior_type = this.props.location.query.behavior_type;
    }

    /*
    format all cards for the cards-select-box options list
  */
    const allCards = getCardsByPipeline(this.props.location.query.pipeline);
    const formatAllCards = allCards.reduce((acc, curr) => [...acc, {
      'id': curr.id,
      'content': curr.label,
    }], []);

    const formatVisibleCards = config.length > 0 ?
      config.reduce((acc, card) => {
        if (card.visible) {
          return [...acc, card.id];
        }
        return acc;
      }, [])
      : [];

    return (
      <div className="explodedView">
        <div className="explodedView__header">
          <span className="explodedView__backBTNSection">
            {this.state.backURL &&
            <BackTo className="backButton" onClick={this.goBackHandler} text="Go back" />
            }
          </span>
          <span className="explodedView__title">
            <FormattedMessage id="evp.title" />
          </span>
          <CardsSelectBox
            options={formatAllCards}
            activeOptions={formatVisibleCards}
            updateCardsOptions={this.updateCardsOptions}
          />
        </div>
        {this.renderReactGrid()}
        <div className="explodedView__static-row">
          <AnalyticsLogs />
        </div>
        <div className="modal">
          {this.state.modalContent}
        </div>
      </div>
    );
  }
}

ExplodedView.displayName = 'ExplodedView';

ExplodedView.propTypes = {
  'getRelatedEntitiesData': PropTypes.func,
  'getClusterRelations': PropTypes.func,
  'getEntityLabelHistory': PropTypes.func,
  'searchData': PropTypes.any,
  'location': PropTypes.shape({
    'query': PropTypes.shape({
      'pipeline': PropTypes.string,
      'method_name': PropTypes.string,
      'entity_id': PropTypes.string,
      'behavior_type': PropTypes.string,
    }),
  }).isRequired,
  'fetchColumnFormat': PropTypes.func,
  'customerName': PropTypes.string,
  'getSearchData': PropTypes.func,
  'getEntityInfo': PropTypes.func.isRequired,
  'getTenableReportData': PropTypes.func.isRequired,
  'tenableReportData': PropTypes.object,
  'getNXDomains': PropTypes.func.isRequired,
  'updateLocation': PropTypes.func.isRequired,
  'getDHCPData': PropTypes.func.isRequired,
  'getDetailsData': PropTypes.func,
};

ExplodedView.defaultProps = {
  'getRelatedEntitiesData': () => {},
  'searchData': {},
  'getClusterRelations': () => {},
  'getEntityLabelHistory': () => {},
  'fetchColumnFormat': () => null,
  'customerName': '',
  'getSearchData': () => null,
  'getEntityInfo': () => {},
  'getNXDomains': () => {},
  'tenableReportData': {},
  'getDetailsData': () => null,
};

export const mapStateToProps = (state, ownProps) => ({
  'searchData': ownProps.location.query.origin === 'pipeline'
  && Object.keys(state.raw.toJS().explodedView.pipelineEntityData).length > 0 ?
    state.raw.toJS().explodedView.pipelineEntityData[0] :
    state.raw.toJS().explodedView.searchData[0],
  'tenableReportData': getVulnerabilityReportCardData(state),
  'customerName': state.raw.toJS().systemInfo.customer_name,
});

const mapDispatchToProps = dispatch => ({
  'getSearchData': params => dispatch(getSearchData(params)),
  'getClusterRelations': params => dispatch(getClusterRelations(params)),
  'getEntityLabelHistory': params => dispatch(getEntityLabelHistory(params)),
  'getRelatedEntitiesData': params => dispatch(getRelatedEntitiesData(params)),
  'fetchColumnFormat': params => dispatch(fetchColumnFormat(params)),
  'getEntityInfo': (...params) => dispatch(getEntityInfo(...params)),
  'getNXDomains': (...params) => dispatch(getNXDomains(...params)),
  'getTenableReportData': (...params) => dispatch(getVulnerabilityReportData(...params)),
  'updateLocation': location => dispatch(routerActions.push(location)),
  'getDHCPData': (...params) => dispatch(getDHCPData(...params)),
  'getDetailsData': params => dispatch(getDetailsData(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExplodedView);
