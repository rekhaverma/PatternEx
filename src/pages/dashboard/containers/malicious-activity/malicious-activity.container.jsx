import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';

import { enabledPipelines, filterData, filterListData, filtersFromState, isListFiltered } from 'model/selectors';
import { resetFilters, setFilter } from 'model/actions/malicious-activity.actions';
import { tagsI18nMapping } from 'model/classes/heat-map-dropdowns.class';
import { goBackUrl } from 'model/actions/exploded-view.actions';
import { pipelineToName } from 'lib/decorators';

import { Listing } from './components/listing/listing.component';
import HeatMapLegend from '../../components/heatmap-legend';
import { HeatMapDropdown } from './components/heat-map-dropdown/heat-map-dropdown.component';

/**
 * @todo: implement smart table
 * @param props
 * @returns {*}
 * @constructor
 */
export const MaliciousActivity = (props) => {
  const {
    data,
    setLabelForPrediction,
    isOldEVPActive,
    isDataLoaded,
    nextUrl,
    heatMapData,
    filters,
    pipelines,
  } = props;
  const tags = [];
  if (filters.active) {
    Object.keys(filters.active).map((key) => {
      tags.push({
        id: key,
        label: pipelineToName(key),
        removable: false,
      });
      const tacticName = tagsI18nMapping[filters.active[key]];
      if (tacticName && tacticName.name) {
        tags.push({
          id: filters.active[key],
          label: tacticName.name,
          removable: false,
        });
      }
      return key;
    });
  }
  return (
    <section className="dashboard__content +withGradient" style={{ flexWrap: 'wrap' }}>
      <div className="row full-width flex-wrap">
        <HeatMapDropdown
          data={heatMapData}
          filters={filters}
          row={pipelines}
          rowType="pipeline"
          resetFilters={props.resetFilters}
          setFilter={props.setFilter}
        />
        <div className="dashboard__malicious-heatmap">
          <HeatMapLegend />
        </div>
      </div>

      <div className="row full-width">
        <Listing
          searchTags={tags}
          isDataLoaded={isDataLoaded}
          data={data}
          handleExplodedView={props.handleExplodedView}
          deleteLabel={props.deleteLabel}
          setLabelForPrediction={setLabelForPrediction}
          isOldEVPActive={isOldEVPActive}
        />
      </div>
      <div className="row full-width">
        <div className="dashboard__footer">
          <div className="dashboard__toListing">
            <Link to={nextUrl}>
              <span className="icon-chevron-right" />
              <FormattedMessage id="malicious.toMaliciousListing" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

MaliciousActivity.propTypes = {
  isDataLoaded: PropTypes.bool.isRequired,
  heatMapData: PropTypes.array.isRequired,
  pipelines: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  nextUrl: PropTypes.string.isRequired,
  resetFilters: PropTypes.func.isRequired,
  handleExplodedView: PropTypes.func.isRequired,
  deleteLabel: PropTypes.func.isRequired,
  setLabelForPrediction: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  isOldEVPActive: PropTypes.bool,
};
MaliciousActivity.defaultProps = {
  isOldEVPActive: false,
};

export const mapStateToProps = state => ({
  data: filterListData(state),
  heatMapData: filterData(state),
  isFiltered: isListFiltered(state),
  isDataLoaded: state.raw.getIn(['loadStatus', 'maliciousBehavior']),
  pipelines: enabledPipelines(state),
  filters: filtersFromState(state),
  isOldEVPActive: !state.app.ui.toJS().newEVPVisibility,
});

const mapDispatchToProps = dispatch => ({
  resetFilters: (...args) => dispatch(resetFilters(...args)),
  handleExplodedView: (...args) => dispatch(routerActions.push(...args)),
  setFilter: (...args) => dispatch(setFilter(...args)),
  goBackUrl: (...args) => dispatch(goBackUrl(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MaliciousActivity);
