import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { selectCluster, sortClusterBy } from 'model/selectors';
import { updateClusterSortBy } from 'model/actions';
import ClustersToolbar from 'components/clusters-toolbar';

const options = [
  { 'id': 'severity', 'content': 'Severity' },
  { 'id': 'newest', 'content': 'Newest' },
  { 'id': 'oldest', 'content': 'Oldest' },
];

/**
 *  Function to filter the clusters based on the selected filters
 * (timeline filter/ heatmap filter) on dashboard
 * @param {object} state
 * @param {array} items
 */
const filterList = (state, items) => {
  const filters = state.raw.getIn(['relations', 'filters']).toJS();
  const highlighted = state.app.maliciousActivity.toJS().highlighted;
  let filteredData = items;
  if (Object.keys(filters.active).length > 0) {
    filteredData = items
      .filter(el => el.seed_type === Object.keys(filters.active)[0])
      .filter(el => el.tag_id === Object.values(filters.active)[0]);
  }

  if (highlighted !== '') {
    filteredData = filteredData
      .filter((el) => {
        const utcDate = moment.utc(el.ts).format('MM - DD - YYYY');
        return highlighted.format('MM - DD - YYYY') === utcDate;
      });
  }

  return filteredData;
};

export const AutocorrelationClusters = props => (
  <ClustersToolbar {...props} options={options} />
);
AutocorrelationClusters.propTypes = {
  'list': PropTypes.array.isRequired,
  'sortClusterBy': PropTypes.string.isRequired,
  'onClusterClick': PropTypes.func.isRequired,
  'updateClusterSortBy': PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  'list': filterList(state, selectCluster(state)),
  'sortClusterBy': sortClusterBy(state),
});

const mapDispatchToProps = dispatch => ({
  'updateClusterSortBy': (...args) => dispatch(updateClusterSortBy(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AutocorrelationClusters);
