import React from 'react';
import PropTypes from 'prop-types';

import LegendItem from './legend-item.component';

import '../d3-timeline-legend.style.scss';

const Legend = props => (
  <div className={props.className}>
    {
      props.data.map((el, index) => (
        <LegendItem
          key={`legend-${index}`}
          className={`${props.className}__item`}
          color={el.color}
        >
          { el.label }
        </LegendItem>
      ))
    }
  </div>
);
Legend.propTypes = {
  'className': PropTypes.string,
  'data': PropTypes.arrayOf(PropTypes.shape({
    'color': PropTypes.string,
    'label': PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.element.isRequired,
    ]),
  })).isRequired,
};
Legend.defaultProps = {
  'className': 'legend',
};

export default Legend;
