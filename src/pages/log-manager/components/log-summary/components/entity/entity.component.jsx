import React from 'react';
import PropTypes from 'prop-types';
import { namePretty } from 'lib';
import D3ProgressBar from 'components/d3-progress-chart';

export const Entity = props => (
  <div className={`${props.className}__entity`}>
    <h3>{namePretty(props.title)}</h3>
    <D3ProgressBar
      amount={props.value}
      maxim={props.maxValue}
      svgDimensions={{ width: 100, height: 100 }}
    />
  </div>
);

Entity.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  className: PropTypes.string,
};

Entity.defaultProps = {
  className: 'log-manager',
};
