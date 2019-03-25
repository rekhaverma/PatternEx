import React from 'react';
import PropTypes from 'prop-types';

const ViewSwitcher = ({ active, views }) => {
  if (Object.keys(views).includes(active)) {
    return React.cloneElement(views[active]);
  }
  return null;
};
ViewSwitcher.propTypes = {
  'active': PropTypes.string.isRequired,
  'views': PropTypes.object.isRequired,
};

export default ViewSwitcher;
