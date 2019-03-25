import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectCluster, sortClusterBy, getSelectedCluster } from 'model/selectors';
import { updateClusterSortBy } from 'model/actions';

import SelectBox from 'components/select-box';

import ClusterTable from '../../components/cluster-table';
import { Search } from '../../../dashboard/components/search';

const options = [
  { 'id': 'severity', 'content': 'Severity' },
  { 'id': 'newest', 'content': 'Newest' },
  { 'id': 'oldest', 'content': 'Oldest' },
];

class Clusters extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'inputValue': '',
    };

    this.tableRef = null;
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const { currentCluster, location, showClusterList } = this.props;

    if (location.query
      && Object.keys(location.query).includes('cluster_id')
      && location.query.cluster_id !== '') {
      if (currentCluster.cluster_id !== location.query.cluster_id && showClusterList === 'initially') {
        this.props.onClusterClick({ 'cluster_id': location.query.cluster_id });
      }
    }
  }

  handleChange(e) {
    this.setState({
      'inputValue': e.target.value,
    });
  }

  render() {
    const { list, onClusterClick } = this.props;
    const { inputValue } = this.state;
    const data = inputValue !== ''
      ? list.filter(el => (
        el.central_entity.toLowerCase().includes(inputValue.toLowerCase())
      ))
      : list;

    let clientHeight = 500;

    if (this.tableRef) {
      clientHeight = this.tableRef.getBoundingClientRect().height;
    }

    return (
      <div
        ref={ref => this.tableRef = ref}
        className="clusterToolbar"
        style={{ height: '100%' }}
      >
        <div className="clusterToolbar__header">
          <div className="clusterToolbar__header__el">
            <SelectBox
              singleSelect
              activeOption={this.props.sortClusterBy}
              options={options}
              onClick={this.props.updateClusterSortBy}
            />
          </div>
          <div className="clusterToolbar__header__el">
            <Search
              placeholder="Search for central entity"
              value={inputValue}
              onChange={this.handleChange}
              style={{ 'width': '100%' }}
            />
          </div>
        </div>
        <ClusterTable
          data={data}
          clientHeight={clientHeight}
          options={{
            'onRowClick': onClusterClick,
          }}
          activeCluster={this.props.activeCluster}
        />
      </div>
    );
  }
}
Clusters.propTypes = {
  'currentCluster': PropTypes.object.isRequired,
  'list': PropTypes.array.isRequired,
  'location': PropTypes.object.isRequired,
  'sortClusterBy': PropTypes.string.isRequired,
  'onClusterClick': PropTypes.func.isRequired,
  'updateClusterSortBy': PropTypes.func.isRequired,
  'activeCluster': PropTypes.string.isRequired,
  'showClusterList': PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  'list': selectCluster(state),
  'sortClusterBy': sortClusterBy(state),
  'currentCluster': getSelectedCluster(state),
});

const mapDispatchToProps = dispatch => ({
  'updateClusterSortBy': (...args) => dispatch(updateClusterSortBy(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Clusters);
