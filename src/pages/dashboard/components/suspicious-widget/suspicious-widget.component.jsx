import React from 'react';
import PropTypes from 'prop-types';

import SuspiciousItem from './components/suspicious-item.component';

const SuspiciousWidget = ({ items, onClick }) => (
  <div className="suspicious-widget">
    {items.map(el => (
      <SuspiciousItem
        key={el.id}
        label={el.label}
        value={el.value}
        onClick={() => onClick(el.id)}
      />
    ))}
  </div>
);
SuspiciousWidget.displayName = 'SuspiciousWidget';
SuspiciousWidget.propTypes = {
  'items': PropTypes.array,
  'onClick': PropTypes.func,
};
SuspiciousWidget.defaultProps = {
  'items': [],
  'onClick': () => null,
};

export default SuspiciousWidget;
