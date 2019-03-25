import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { findIndex } from 'lodash';

import { EvpOpenMethods } from 'model/classes/evp-open-methods';
import { ipGeoLocations, relatedEntitiesTable, relatedEntitiesToSpider } from 'model/selectors';
import Tabs from 'components/tabs';
import NoData from 'components/no-data';
import { GEOLOCATION_TABLE } from 'config';

import D3SpiderGraph from 'components/d3-spider-graph';
import AdvancedTable from 'components/advanced-table';
import Modal from 'components/modal';
import ModalList from '../../components/modalList';

import WorldMap from '../../components/world-map';
import Section from '../../components/section';

import { relatedEntitiesTableFormatData } from '../../config';

import './geolocation.style.scss';

const outputIsPopulated = (data) => {
  if (Object.keys(data).includes('nodes') && Object.keys(data).includes('links')
    && data.nodes.length > 0 && data.links.length > 0) {
    return true;
  }
  return false;
};

const AUTOCORRELATED_ENTITIES = 'AUTOCORRELATED_ENTITIES';
const IP_GEOLOCATIONS = 'IP_GEOLOCATIONS';
const tabs = [
  {
    'id': AUTOCORRELATED_ENTITIES,
    'title': 'Autocorrelated Entities',
  },
  // {
  //   'id': RECOMMENDATION,
  //   'title': 'Recommendation',
  // },
  {
    'id': IP_GEOLOCATIONS,
    'title': 'IP GeoLocations Map',
  },
];

class Geolocation extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      'subView': '',
      'config': {
        'svgHeight': 230,
        'iconsWidth': 18,
        'iconsHeight': 14,
      },
      'selectedEntity': '',
    };

    this.contentRef = null;
    this.modalRef = null;
    this.changeSubView = this.changeSubView.bind(this);
    this.setSelectedEntity = this.setSelectedEntity.bind(this);
    this.expandSection = this.expandSection.bind(this);
  }

  componentDidMount() {
    const { defaultSubView } = this.props;
    this.setState({
      'subView': defaultSubView || AUTOCORRELATED_ENTITIES,
    });
  }

  setSelectedEntity(row) {
    const entity = row.entity_name;
    const { selectedEntity } = this.state;
    const { isOldEVPActive, handleExplodedView, location } = this.props;

    const isAlreadySelected = entity === null
      || selectedEntity.toString().toLowerCase() === entity.toString().toLowerCase();

    const behaviorType = row.behavior || location.behaviorType;

    this.setState({
      'selectedEntity': isAlreadySelected ? '' : entity,
    });

    const params = row.raw || row;
    EvpOpenMethods.onRowClickHandler(params, behaviorType, isOldEVPActive, handleExplodedView);
  }

  expandSection(open = true) {
    if (!open) {
      return this.props.onModalOpen('');
    }

    const modalStyle = {
      width: 1000,
      height: 600,
      svgHeight: 540,
    };
    const { subView } = this.state;
    const { isOldEVPActive, relatedEntitiesDataTable } = this.props;

    const activeTabNameIndex = tabs.findIndex(tab => tab.id === subView);
    const tableData = relatedEntitiesDataTable.map(el => ({
      ...el,
      'handlers': {
        ...el.handlers,
        'onInspect': (e, row) => EvpOpenMethods.onInspectHandler(row, row.behavior, isOldEVPActive),
        'getNewTabUrl': row => EvpOpenMethods.getNewTabUrlHandler(row, row.behavior, isOldEVPActive),
      },
    }));

    const rowHighlightIndex = findIndex(
      tableData,
      item => item.entity_name === this.state.selectedEntity,
    );
    return this.props.onModalOpen((
      <Modal style={modalStyle} ref={ref => this.modalRef = ref}>
        <ModalList
          onClose={() => this.expandSection(false)}
          title={tabs[activeTabNameIndex] ? tabs[activeTabNameIndex].title : ''}
        >
          {
            subView === AUTOCORRELATED_ENTITIES && (
              outputIsPopulated(this.props.spiderGraphData) ? (
                <div className="related_entities">
                  <div
                    className="spiderGraph__component"
                  >
                    <D3SpiderGraph
                      data={this.props.spiderGraphData}
                      clientWidth={modalStyle.width / 2}
                      clientHeight={modalStyle.svgHeight}
                      config={this.state.config}
                      selectedEntity={this.state.selectedEntity}
                      setSelectedEntity={this.setSelectedEntity}
                    />
                  </div>
                  <AdvancedTable
                    data={tableData}
                    tableConfig={relatedEntitiesTableFormatData}
                    onRowClick={row => this.setSelectedEntity(row)}
                    rowHighlightIndex={rowHighlightIndex}
                    pageSize="10"
                    maxPageSize="10"
                    locationPage={GEOLOCATION_TABLE}
                  />
                </div>
              ) : (
                <NoData
                  intlId="global.nodata"
                  intlDefault="No Data"
                  className="nodata"
                  withIcon
                />
              )
            )}
          {
            subView === IP_GEOLOCATIONS &&
            <WorldMap
              parent={{ x: 22, y: 67 }} // @todo: set values dynamic
              parentName="modal"
              data={this.props.worldMapData}
              clientWidth={modalStyle.width}
              clientHeight={modalStyle.svgHeight}
              config={{
                ...this.state.config,
                'svgHeight': modalStyle.svgHeight,
              }}
            />
          }
        </ModalList>
      </Modal>
    ));
  }

  changeSubView(nextView) {
    this.setState({
      'subView': nextView,
    });
  }

  render() {
    const { isOldEVPActive, relatedEntitiesDataTable } = this.props;
    const { subView } = this.state;

    const tableData = relatedEntitiesDataTable.map(el => ({
      ...el,
      'handlers': {
        ...el.handlers,
        'onInspect': (e, row) => EvpOpenMethods.onInspectHandler(row, row.behavior, isOldEVPActive),
        'getNewTabUrl': row => EvpOpenMethods.getNewTabUrlHandler(row, row.behavior, isOldEVPActive),
      },
    }));

    const rowHighlightIndex = findIndex(
      tableData,
      item => item.entity_name === this.state.selectedEntity,
    );

    return (
      <Section
        size="medium"
        className="overflow-visible +no-margin +full-height +analitycs-section"
        loaded
      >
        <div className="geolocation__header">
          <Tabs
            active={subView}
            className="tabsV2"
            items={tabs}
            onClick={this.changeSubView}
            slim
          />
          <span className="icon-drag" />
          <span
            className="section__expand icon-expand-square"
            onClick={this.expandSection}
          />
        </div>
        <div className="geolocation__content" ref={ref => this.contentRef = ref}>
          {
            subView === AUTOCORRELATED_ENTITIES &&
            (
              outputIsPopulated(this.props.spiderGraphData) ? (
                <div className="related_entities">
                  <div className="spiderGraph__component">
                    <D3SpiderGraph
                      data={this.props.spiderGraphData}
                      clientWidth={this.contentRef ? this.contentRef.clientWidth / 2 : 0}
                      clientHeight={this.contentRef ? this.contentRef.clientHeight - 10 : 0}
                      config={this.state.config}
                      selectedEntity={this.state.selectedEntity}
                      setSelectedEntity={this.setSelectedEntity}
                    />
                  </div>
                  <AdvancedTable
                    data={tableData}
                    tableConfig={relatedEntitiesTableFormatData}
                    onRowClick={row => this.setSelectedEntity(row)}
                    rowHighlightIndex={rowHighlightIndex}
                    maxPageSize="5"
                    locationPage={GEOLOCATION_TABLE}
                  />
                </div>
              ) : (
                <NoData
                  intlId="global.nodata"
                  intlDefault="There is no data to display"
                  className="nodata"
                  withIcon
                />
              )
            )
          }
          {
            subView === IP_GEOLOCATIONS &&
            <WorldMap
              parentName="section"
              parent={{ x: 10, y: 75 }} // @todo: set values dynamic
              data={this.props.worldMapData}
              clientWidth={this.contentRef ? this.contentRef.clientWidth / 2 : 0}
              clientHeight={this.contentRef ? this.contentRef.clientHeight - 10 : 0}
              config={this.state.config}
              showIconFullSize
            />
          }
        </div>
      </Section>
    );
  }
}

Geolocation.displayName = 'Geolocation';
Geolocation.propTypes = {
  'defaultSubView': PropTypes.oneOf([
    AUTOCORRELATED_ENTITIES, IP_GEOLOCATIONS,
  ]),
  'spiderGraphData': PropTypes.object,
  'relatedEntitiesDataTable': PropTypes.array,
  'worldMapData': PropTypes.object,
  'handleExplodedView': PropTypes.func,
  'onModalOpen': PropTypes.func,
  'isOldEVPActive': PropTypes.bool,
  'location': PropTypes.object,
};

Geolocation.defaultProps = {
  'defaultSubView': AUTOCORRELATED_ENTITIES,
  'spiderGraphData': {},
  'relatedEntitiesDataTable': [],
  'worldMapData': {},
  'handleExplodedView': () => null,
  'onModalOpen': () => null,
  'isOldEVPActive': false,
  'location': {},
};

const mapStateToProps = state => ({
  'spiderGraphData': relatedEntitiesToSpider(state),
  'relatedEntitiesDataTable': relatedEntitiesTable(state),
  'worldMapData': ipGeoLocations(state),
  'isOldEVPActive': !state.app.ui.toJS().newEVPVisibility,
  'location': state.routing.locationBeforeTransitions.query,
});

const mapDispatchToProps = dispatch => ({
  'handleExplodedView': (...args) => dispatch(routerActions.push(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Geolocation);
