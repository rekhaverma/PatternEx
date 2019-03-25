import React from 'react';
import PropTypes from 'prop-types';

import Toolbar from '../../components/toolbar';

import Clusters from '../clusters';


const ToolbarContainer = props => (
  <Toolbar
    options={['link-symbol']}
    containers={{
      'link-symbol': <Clusters activeCluster={props.activeCluster} location={props.location} />,
    }}
    onClusterClick={props.onClusterClick}
  />
);
ToolbarContainer.propTypes = {
  'activeCluster': PropTypes.string.isRequired,
  'location': PropTypes.object.isRequired,
  'onClusterClick': PropTypes.func.isRequired,
};

export default ToolbarContainer;
