import React from 'react';
import PropTypes from 'prop-types';

import { isEmpty, isEqual } from 'lodash';

import D3SpiderGraph from 'components/d3-spider-graph';

/**
  * Return true if all target and source links can be
  * found in nodes array
  * @param {Object} data
  */
const linksAreValid = (data) => {
  let flag = true;
  const nodes = data.nodes.reduce((acc, value) => {
    const newArr = [...acc, value.entity_name];
    return newArr;
  }, []).filter(entity => entity !== undefined && entity !== null);

  data.links.forEach((link) => {
    if (!nodes.includes(link.source.toString())) {
      if (typeof link.source === 'object' && !nodes.includes(link.source.entity_name.toString())) {
        flag = false;
      }
    }
    if (!nodes.includes(link.target.toString())) {
      if (typeof link.target === 'object' && !nodes.includes(link.target.entity_name.toString())) {
        flag = false;
      }
    }
  });

  return flag;
};

class SpiderGraph extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      'config': {
        'svgHeight': 600,
      },
    };

    this.contentRef = null;
    this.setSelectedEntity = this.setSelectedEntity.bind(this);
  }


  componentDidMount() {
    if (this.contentRef !== null) {
      this.forceUpdate();
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!isEqual(nextProps.data.nodes, this.props.data.nodes)
      || !isEqual(nextProps.data.links, this.props.data.links)
      || !isEqual(nextProps.selectedEntity, this.props.selectedEntity)) {
      return true;
    }
    return false;
  }

  setSelectedEntity(entity) {
    const { selectedEntity, setSelectedEntity } = this.props;

    const activeEntityValue = entity.toString() === selectedEntity.toString()
      ? ''
      : entity.toString();

    setSelectedEntity(activeEntityValue);
  }

  render() {
    const { config } = this.state;
    const { data, selectedEntity } = this.props;

    if (!isEmpty(data)) {
      if (data.nodes.length === 0 && data.links.length === 0) {
        return (<span>No data</span>);
      }
      if (!linksAreValid(data)) {
        return (<span>Invalid data</span>);
      }
    }

    if (config.svgWidth < 0 || config.svgHeight < 0) {
      return (<span>Invalid SVG size.</span>);
    }

    return (
      <div
        ref={ref => this.contentRef = ref}
        className="spiderGraph__component"
      >
        <D3SpiderGraph
          clientWidth={this.contentRef ? this.contentRef.clientWidth : 0}
          config={this.state.config}
          data={data}
          selectedEntity={selectedEntity}
          setSelectedEntity={this.setSelectedEntity}
        />
      </div>
    );
  }
}
SpiderGraph.displayName = 'SpiderGraph';
SpiderGraph.propTypes = {
  'data': PropTypes.object,
  'selectedEntity': PropTypes.string,
  'setSelectedEntity': PropTypes.func,
};
SpiderGraph.defaultProps = {
  'data': {},
  'selectedEntity': '',
  'setSelectedEntity': () => null,
};

export default SpiderGraph;
