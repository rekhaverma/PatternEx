import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isSameDate } from 'lib';

import { setSelectedCluster, setClusterFilter, resetClusterFilters } from 'model/actions';

import {
  getTime,
  selectCluster,
  getSelectedCluster,
  isClustersListFiltered,
} from 'model/selectors';

import { FormattedHTMLMessage } from 'react-intl';
import NoData from 'components/no-data';
// import { ClusterMeta } from 'components/clusters-toolbar';
import AutocorrelationClusters from 'containers/autocorrelation-clusters';
import HeatMapContainer from '../heat-map';
import HeatMapLegend from '../../components/heatmap-legend';


// import ChordGraph from '../chord-graph';

class ClusterView extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'selectedEntity': '',
    };

    this.setSelectedEntity = this.setSelectedEntity.bind(this);
    this.handleClusterChange = this.handleClusterChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { time } = this.props;
    const nextTime = nextProps.time;

    if (!isSameDate(time.startTime, nextTime.startTime)
      || !isSameDate(time.endTime, nextTime.endTime)) {
      this.setState({
        'selectedEntity': '',
      });
    }
  }

  setSelectedEntity(entity) {
    const { selectedEntity } = this.state;

    const isAlreadySelected = entity === null
      || selectedEntity.toString().toLowerCase() === entity.toString().toLowerCase();

    this.setState({
      'selectedEntity': isAlreadySelected ? '' : entity,
    });
  }

  handleClusterChange(row) {
    this.setState({
      'selectedEntity': '',
    });
    this.props.setSelectedCluster(row.cluster_id);
  }

  render() {
    const { clusters, currentCluster } = this.props;
    const behaviorTypes = ['label', 'malicious', 'suspicious', 'blocked'];
    // const test = objectToArray(currentCluster.cluster_entities).map(el => ({
    //   ...el,
    //   'threat_tactic': '',
    // }));

    // const relationsCount = (Object.keys(currentCluster).includes('cluster_relations'))
    //   ? currentCluster.cluster_relations.length
    //   : 0;

    // const entitiesCount = (Object.keys(currentCluster).includes('cluster_entities'))
    //   ? Object.keys(currentCluster.cluster_entities).length
    //   : 0;

    if (clusters.length === 0) {
      return (<NoData intlId="global.nodata" intlDefault="There is no data to display" />);
    }

    return (
      <section className="dashboard__content +withGradient">
        <div className="dashboard__column">
          <span className="dashboard__title">
            <FormattedHTMLMessage id="heatmap.cluster.title" />
          </span>
          <HeatMapContainer
            data={clusters}
            row={behaviorTypes}
            rowType="autocorrelation"
            setFilter={active => this.props.setClusterFilter('active', active)}
            filters={this.props.filters}
          />
          <div className="dashboard__footer">
            <div className="dashboard__title">
              <FormattedHTMLMessage id="autocorrelations.footerText" />
            </div>
            <HeatMapLegend />
          </div>
        </div>
        <div className="dashboard__column">
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
          </div>
          <AutocorrelationClusters
            activeCluster={currentCluster.cluster_id || ''}
            onClusterClick={this.handleClusterChange}
            link={this.props.linkToAutocorrelation}
            router={this.props.router}
          />
          {/* <Link
            className="dashboard__toListing"
            to={`${this.props.linkToAutocorrelation}&cluster_id=${currentCluster.cluster_id}`}
          >
            <span className="icon-chevron-right" />
            <FormattedHTMLMessage id="autocorrelations.toAutocorrelationsCluster" />
          </Link> */}
        </div>
      </section>
    );
  }
}
ClusterView.propTypes = {
  'clusters': PropTypes.array.isRequired,
  'currentCluster': PropTypes.object.isRequired,
  'time': PropTypes.shape({
    'startTime': PropTypes.object.isRequired,
    'endTime': PropTypes.object.isRequired,
    'timezone': PropTypes.string,
  }).isRequired,
  'linkToAutocorrelation': PropTypes.string.isRequired,
  'setSelectedCluster': PropTypes.func.isRequired,
  'setClusterFilter': PropTypes.func.isRequired,
  'filters': PropTypes.object.isRequired,
  'isFiltered': PropTypes.bool.isRequired,
  'resetFilters': PropTypes.func.isRequired,
  'router': PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  'clusters': selectCluster(state),
  'currentCluster': getSelectedCluster(state),
  'time': getTime(state),
  'filters': state.raw.toJS().relations.filters,
  'isFiltered': isClustersListFiltered(state),
});

const mapDispatchToProps = dispatch => ({
  'setSelectedCluster': (...args) => dispatch(setSelectedCluster(...args)),
  'setClusterFilter': (...args) => dispatch(setClusterFilter(...args)),
  'resetFilters': (...args) => dispatch(resetClusterFilters(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterView);
