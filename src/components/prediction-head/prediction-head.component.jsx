/* eslint react/no-array-index-key: 0 */
import React from 'react';
import PropTypes from 'prop-types';

const PredictionHead = props => (
  <div>
    <div className="prediction__head">
      { props.titles.map((el, index) => <span key={index}>{el}</span>)}
    </div>
  </div>
);
PredictionHead.displayName = 'PredictionHead';
PredictionHead.propTypes = {
  'titles': PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PredictionHead;
