import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import momentPropTypes from 'react-moment-proptypes';

import { objectToArray } from 'lib/decorators';

import {
  fetchClusterRelations,
  setSelectedCluster,
} from 'model/actions';

import {
  selectCluster,
  getSelectedCluster,
} from 'model/selectors';

import { FormattedHTMLMessage } from 'react-intl';
import { Button } from 'components/forms';
import NoData from 'components/no-data';
import { ClusterMeta } from 'components/clusters-toolbar';

import GraphToggler from '../../components/graph-toggler';
import { Search } from '../../../dashboard/components/search';

import ToolbarContainer from '../toolbar';
import ZeppelinToSpider from '../zeppelin-to-spider';
import ChordGraph from '../chord-graph';
import Predictions from '../predictions';
import SelectedPredictionContainer from '../selected-prediction';

const GRAPH_VIEWS = ['spider', 'chord'];
const DEFAULT_VIEW = 'spider';

const buildTogglerList = () => GRAPH_VIEWS.map(el => ({
  'id': el,
  'disabled': false,
}));

class ClusterView extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'autocorrelated': false,
      'graphView': DEFAULT_VIEW,
      'inputValue': '',
      'selectedEntity': '',
    };

    this.handleClusterChange = this.handleClusterChange.bind(this);
    this.handleGraphViewChange = this.handleGraphViewChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleAutocorrelate = this.toggleAutocorrelate.bind(this);
    this.setSelectedEntity = this.setSelectedEntity.bind(this);
  }

  componentDidMount() {
    const { startDate, endDate } = this.props;

    if (startDate.isValid() && endDate.isValid()) {
      this.props.fetchClusterRelations(startDate, endDate);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { startDate, endDate } = this.props;

    if (!nextProps.startDate.isSame(startDate)
      || !nextProps.endDate.isSame(endDate)) {
      this.setState({
        'autocorrelated': false,
        'graphView': DEFAULT_VIEW,
        'inputValue': '',
        'selectedEntity': '',
      });
      nextProps.fetchClusterRelations(nextProps.startDate, nextProps.endDate);
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

  handleGraphViewChange(e) {
    const view = e.target.getAttribute('data-name') !== null
      ? e.target.getAttribute('data-name')
      : e.target.parentNode.getAttribute('data-name');
    if (view !== null) {
      this.setState({
        'graphView': view,
      });
    }
  }

  handleClusterChange(row) {
    this.setState({
      'autocorrelated': false,
      'graphView': DEFAULT_VIEW,
      'inputValue': '',
      'selectedEntity': '',
    });
    this.props.setSelectedCluster(row.cluster_id);
  }

  toggleAutocorrelate() {
    this.setState({
      'autocorrelated': true,
    });
  }

  handleChange(e) {
    this.setState({
      'inputValue': e.target.value,
    });
  }

  render() {
    const { clusters, currentCluster } = this.props;

    const relationsCount = (Object.keys(currentCluster).includes('cluster_relations'))
      ? currentCluster.cluster_relations.length
      : 0;

    const entitiesCount = (Object.keys(currentCluster).includes('cluster_entities'))
      ? Object.keys(currentCluster.cluster_entities).length
      : 0;

    if (clusters.length === 0) {
      return (<NoData intlId="global.nodata" intlDefault="There is no data to display" />);
    }

    const renderGraph = () => {
      const test = objectToArray(currentCluster.cluster_entities).map(el => ({
        ...el,
        'threat_tactic': '',
      }));
      switch (this.state.graphView) {
        case 'chord':
          return (<ChordGraph
            entities={test}
            relations={currentCluster.cluster_relations}
            selectedEntity={this.state.selectedEntity}
            setSelectedEntity={this.setSelectedEntity}
          />);

        default:
          return (<ZeppelinToSpider
            autocorrelated={this.state.autocorrelated}
            selectedEntity={this.state.selectedEntity}
            setSelectedEntity={this.setSelectedEntity}
          />);
      }
    };

    return (
      <div style={{
          'position': 'relative',
          'display': 'flex',
          'flexGrow': 1,
          'flexDirection': 'column',
        }}
      >
        <div className="dashboard__toolbar">
          <ToolbarContainer
            activeCluster={currentCluster.cluster_id || ''}
            location={this.props.location}
            onClusterClick={this.handleClusterChange}
          />
        </div>
        <div className="dashboard__content +withGradient autocorrelate">
          <div className="column__1__2">
            <ClusterMeta
              centralEntity={<FormattedHTMLMessage id="cluster.metas.mainEntity" values={{ 'name': currentCluster.central_entity }} />}
              metas={{
                'relations': relationsCount,
                'entities': entitiesCount,
              }}
            >
              {
                this.state.graphView === 'spider' && (
                  <Button
                    className="button--success"
                    onClick={this.toggleAutocorrelate}
                    disabled={this.state.autocorrelated}
                  >
                    Autocorrelate
                  </Button>
                )
              }
            </ClusterMeta>
            {renderGraph()}
          </div>
          <div className="column__1__2">
            <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center' }}>
              <GraphToggler
                active={this.state.graphView}
                list={buildTogglerList()}
                onClick={this.handleGraphViewChange}
              />
              <Search
                placeholder="Search for entity or threat tactic"
                value={this.state.inputValue}
                onChange={this.handleChange}
              />
            </div>
            <SelectedPredictionContainer
              selectedEntity={this.state.selectedEntity}
              setLabelForPrediction={this.props.setLabelForPrediction}
            />
            <Predictions
              autocorrelated={this.state.autocorrelated}
              searchValue={this.state.inputValue}
              onRowClick={this.setSelectedEntity}
              setLabelForPrediction={this.props.setLabelForPrediction}
              selectedEntity={this.state.selectedEntity}
            />
          </div>
        </div>
      </div>
    );
  }
}
ClusterView.propTypes = {
  'clusters': PropTypes.array.isRequired,
  'currentCluster': PropTypes.object.isRequired,
  'endDate': PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    momentPropTypes.momentObj,
  ]).isRequired,
  'location': PropTypes.object.isRequired,
  'startDate': PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    momentPropTypes.momentObj,
  ]).isRequired,
  'fetchClusterRelations': PropTypes.func.isRequired,
  'setSelectedCluster': PropTypes.func.isRequired,
  'setLabelForPrediction': PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  'clusters': selectCluster(state),
  'currentCluster': getSelectedCluster(state),
});

const mapDispatchToProps = dispatch => ({
  'fetchClusterRelations': (...args) => dispatch(fetchClusterRelations(...args)),
  'setSelectedCluster': (...args) => dispatch(setSelectedCluster(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterView);
