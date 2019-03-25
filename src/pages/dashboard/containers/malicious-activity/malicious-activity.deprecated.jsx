import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { routerActions } from 'react-router-redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Loader from 'components/loader/loader-v2.component';
import { resetFilters, setFilter } from 'model/actions/malicious-activity.actions';
import { EvpOpenMethods } from 'model/classes/evp-open-methods';

import {
  filterListData,
  isListFiltered,
  maliciousActivityData,
  filterData,
  filtersFromState,
  enabledPipelines,
} from 'model/selectors';

import AdvancedTable from 'components/advanced-table';
import { DASHBOARD_MALICIOUS_TABLE } from 'config';
import MultiSearch from 'components/multi-search';

import HeatMapContainer from '../heat-map';
import HeatMapLegend from '../../components/heatmap-legend';

import { maliciousColumns } from './constants';

/**
 * @deprecated
 */
class MaliciousActivity extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      tags: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  getFilteredData() {
    const { isOldEVPActive, handleExplodedView, data } = this.props;
    let filteredData = data;
    if (this.state.tags.length) {
      filteredData = filteredData.filter((item) => {
        let match = 0;
        this.state.tags.forEach((tag) => {
          if (item.entity_name.toLowerCase().includes(tag.toLowerCase())
            || item.threat.toLowerCase().includes(tag.toLowerCase())) {
            match += 1;
          }
        });

        return match === this.state.tags.length;
      });
    }

    return filteredData.map(el => ({
      ...el,
      'handlers': {
        ...el.handlers,
        'onRowClick': (e, row) => EvpOpenMethods.onRowClickHandler(row, 'malicious', isOldEVPActive, handleExplodedView),
        'onInspect': (e, row) => EvpOpenMethods.onInspectHandler(row, 'malicious', isOldEVPActive),
        'getNewTabUrl': row => EvpOpenMethods.getNewTabUrlHandler(row, 'malicious', isOldEVPActive),
        'onConfirm': (e) => {
          e.stopPropagation();
          const params = {
            ...el,
            start_time: el.end_time,
          };
          this.props.setLabelForPrediction(params, true);
        },
        'onDeny': (e) => {
          e.stopPropagation();
          this.props.setLabelForPrediction(el, false);
        },
        'deleteLabel': (e) => {
          e.stopPropagation();
          if (el.user_tag && el.user_tag_id) { this.props.deleteLabel(el.user_tag.label_id); }
        },
      },
    }));
  }

  handleChange(tags) {
    this.setState({ tags });
  }

  render() {
    const { isDataLoaded, heatMapData, pipelines, nextUrl, filters } = this.props;
    if (!isDataLoaded) {
      return (
        <section className="dashboard__content +withGradient">
          <Loader small />
        </section>
      );
    }

    const filteredData = this.getFilteredData();
    const heatMapContainer = (
      <div className="dashboard__column">
        <span className="dashboard__title">
          <FormattedMessage id="heatmap.title" />
        </span>
        <HeatMapContainer
          data={heatMapData}
          row={pipelines}
          rowType="pipeline"
          setFilter={active => this.props.setFilter('active', active)}
          filters={filters}
        />
        <div className="dashboard__footer">
          <div className="dashboard__toListing">
            <Link to={nextUrl}>
              <span className="icon-chevron-right" />
              <FormattedMessage id="malicious.toMaliciousListing" />
            </Link>
          </div>
          <HeatMapLegend />
        </div>
      </div>
    );

    if (isDataLoaded && filteredData.length === 0) {
      return (
        <section className="dashboard__content +withGradient">
          { heatMapContainer }
          <div className="dashboard__column +noData">
            <h1>There is no data to display</h1>
          </div>
        </section>
      );
    }

    return (
      <section className="dashboard__content +withGradient">
        { heatMapContainer }
        <div className="dashboard__column">
          <AdvancedTable
            classname="table"
            data={filteredData}
            tableConfig={maliciousColumns}
            pageSize="10"
            locationPage={DASHBOARD_MALICIOUS_TABLE}
          >
            <div className="dashboard__topColumn" style={{ 'display': 'flex' }}>
              {
              this.props.isFiltered && (
                <div className="reset" onClick={this.props.resetFilters}>
                  <div className="reset__close">
                    <span className="icon-close" />
                  </div>
                  <span className="reset__filters">Reset Filters</span>
                </div>
              )
            }
              <MultiSearch
                tags={this.state.tags}
                onChange={this.handleChange}
                placeholder="Search for entity or threat tactic"
              />
            </div>
          </AdvancedTable>
        </div>
      </section>
    );
  }
}
MaliciousActivity.propTypes = {
  'heatMapData': PropTypes.array.isRequired,
  'pipelines': PropTypes.array.isRequired,
  'setFilter': PropTypes.func.isRequired,
  'filters': PropTypes.object.isRequired,
  'isFiltered': PropTypes.bool.isRequired,
  'resetFilters': PropTypes.func.isRequired,
  'handleExplodedView': PropTypes.func.isRequired,
  'setLabelForPrediction': PropTypes.func.isRequired,
  'data': PropTypes.array,
  'nextUrl': PropTypes.string,
  'isDataLoaded': PropTypes.bool,
  'isOldEVPActive': PropTypes.bool,
  'deleteLabel': PropTypes.func,
};
MaliciousActivity.defaultProps = {
  'data': [],
  'noData': false,
  'nextUrl': '',
  'isDataLoaded': false,
  'isOldEVPActive': false,
  'deleteLabel': () => {},
};

const mapStateToProps = state => ({
  'data': filterListData(state),
  'heatMapData': filterData(state),
  'noData': maliciousActivityData(state) && maliciousActivityData(state).length === 0,
  'isFiltered': isListFiltered(state),
  'isDataLoaded': state.raw.getIn(['loadStatus', 'maliciousBehavior']),
  'pipelines': enabledPipelines(state),
  'filters': filtersFromState(state),
  'isOldEVPActive': !state.app.ui.toJS().newEVPVisibility,
});

const mapDispatchToProps = dispatch => ({
  'resetFilters': (...args) => dispatch(resetFilters(...args)),
  'handleExplodedView': (...args) => dispatch(routerActions.push(...args)),
  'setFilter': (...args) => dispatch(setFilter(...args)),
});


export default connect(mapStateToProps, mapDispatchToProps)(MaliciousActivity);
