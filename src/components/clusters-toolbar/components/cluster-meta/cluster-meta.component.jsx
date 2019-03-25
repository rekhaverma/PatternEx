import React from 'react';
import PropTypes from 'prop-types';

import MetaList from './components/meta-list.component';

import './cluster-meta.style.scss';

const ClusterMeta = props => (
  <div className={props.className}>
    <p className={`${props.className}__centralEntity`}>{ props.centralEntity }</p>
    {
      // If we have any metrics, display them
      Object.keys(props.metas).length > 0 && (
        <MetaList className={props.className} metas={props.metas} />
      )
    }
    {props.children}
  </div>
);
ClusterMeta.propTypes = {
  'centralEntity': PropTypes.element,
  'className': PropTypes.string,
  'children': PropTypes.any,
  'metas': PropTypes.object,
};
ClusterMeta.defaultProps = {
  'centralEntity': null,
  'className': 'clusterMeta',
  'children': null,
  'metas': {},
};

export default ClusterMeta;
