/* eslint react/no-unused-prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';

import './prediction-tabs.style.scss';

const PredictionTabs = (props) => {
  const renderTab = (el) => {
    const className = el.id === props.activeTab
      ? `${props.className}__el--active`
      : `${props.className}__el`;

    const handleClick = () => props.onClick(el.id);

    return (
      <div
        className={className}
        key={el.id}
        onClick={handleClick}
      >
        <span>{el.count}</span>
        <p>{el.title}</p>
      </div>
    );
  };
  return (
    <div className={props.className}>
      {props.tabs.map(renderTab)}
    </div>
  );
};
PredictionTabs.displayName = 'PredictionTabs';
PredictionTabs.propTypes = {
  'activeTab': PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  'className': PropTypes.string,
  'tabs': PropTypes.arrayOf(PropTypes.shape({
    'count': PropTypes.number,
    'id': PropTypes.string.isRequired,
    'title': PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]).isRequired,
  })),
  'onClick': PropTypes.func.isRequired,
};
PredictionTabs.defaultProps = {
  'activeTab': 0,
  'className': 'predictionTabs',
  'tabs': [],
};

export default PredictionTabs;
