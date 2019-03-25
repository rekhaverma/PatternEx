import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { clusterToDefaultSpider, clusterToExpandSpider } from 'model/selectors';

import SpiderGraph from '../spider-graph';

const outputIsPopulated = (data) => {
  if (Object.keys(data).includes('nodes') && Object.keys(data).includes('links')
  && data.nodes.length > 0 && data.links.length > 0) {
    return true;
  }
  return false;
};

const ZeppelinToSpider = ({
  autocorrelated,
  expanded,
  output,
  selectedEntity,
  setSelectedEntity,
}) => (
  outputIsPopulated(output) && <SpiderGraph
    selectedEntity={selectedEntity}
    setSelectedEntity={setSelectedEntity}
    data={autocorrelated === true ? expanded : output}
  />
);
ZeppelinToSpider.propTypes = {
  'autocorrelated': PropTypes.bool.isRequired,
  'output': PropTypes.object.isRequired,
  'expanded': PropTypes.object.isRequired,
  'selectedEntity': PropTypes.string,
  'setSelectedEntity': PropTypes.func,
};
ZeppelinToSpider.defaultProps = {
  'selectedEntity': '',
  'setSelectedEntity': () => null,
};

const mapStateToProps = state => ({
  'output': clusterToDefaultSpider(state),
  'expanded': clusterToExpandSpider(state),
});

export default connect(mapStateToProps)(ZeppelinToSpider);
