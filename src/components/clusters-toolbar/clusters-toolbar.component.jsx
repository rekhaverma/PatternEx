import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Search } from 'pages/dashboard/components/search';
import SelectBox from 'components/select-box';
import { saveDasboardLink } from 'model/actions';
import ClusterTable from './components/cluster-table';

import './clusters-toolbar.style.scss';

export class ClustersToolbar extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'inputValue': '',
    };

    this.containerRef = null;

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      'inputValue': e.target.value,
    });
  }

  render() {
    const { list, options, onClusterClick, router } = this.props;
    const { inputValue } = this.state;
    let data = inputValue !== ''
      ? list.filter(el => (
        el.central_entity.toLowerCase().includes(inputValue.toLowerCase())
      ))
      : list;

    data = data.map(el => ({
      ...el,
      'handlers': {
        ...el.handlers,
        'onRowClick': (e, row) => {
          // e.stopPropagation();
          this.props.saveDasboardLink(router.location);
          router.push(`${this.props.link}&cluster_id=${row.cluster_id}`);
        },
      },
    }));

    let clientHeight = 500;

    if (this.containerRef !== null) {
      clientHeight = this.containerRef.getBoundingClientRect().height;
    }

    return (
      <div className="clusterToolbar" ref={ref => this.containerRef = ref}>
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
              placeholder="Cluster with central entity"
              value={inputValue}
              onChange={this.handleChange}
              style={{ 'width': '100%' }}
            />
          </div>
        </div>
        <ClusterTable
          data={data}
          activeCluster={this.props.activeCluster}
          clientHeight={clientHeight}
          options={{
            'onRowClick': onClusterClick,
          }}
        />
      </div>
    );
  }
}
ClustersToolbar.propTypes = {
  'list': PropTypes.array.isRequired,
  'options': PropTypes.array.isRequired,
  'sortClusterBy': PropTypes.string.isRequired,
  'onClusterClick': PropTypes.func.isRequired,
  'updateClusterSortBy': PropTypes.func.isRequired,
  'activeCluster': PropTypes.string.isRequired,
  'router': PropTypes.object.isRequired,
  'link': PropTypes.string.isRequired,
  'saveDasboardLink': PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  'saveDasboardLink': (...args) => dispatch(saveDasboardLink(...args)),
});

export default connect(null, mapDispatchToProps)(ClustersToolbar);
