import React from 'react';
import PropTypes from 'prop-types';

import './layout.style.scss';

const Layout = props => (
  <section className={props.className} style={props.style}>
    {props.children}
  </section>
);
Layout.propTypes = {
  'children': PropTypes.any.isRequired,
  'className': PropTypes.string,
  'style': PropTypes.object,
};
Layout.defaultProps = {
  'className': 'behaviorLayout',
  'style': {},
};

export default Layout;
