import React from 'react';
import PropTypes from 'prop-types';

const LegendItem = props => (
  <span className={props.className} onClick={props.onClick}>
    <span className={`${props.className}__bullet`} style={{ 'backgroundColor': props.color }} />
    {props.children}
  </span>
);

LegendItem.propTypes = {
  'children': PropTypes.any.isRequired,
  'className': PropTypes.string.isRequired,
  'color': PropTypes.string.isRequired,
  'onClick': PropTypes.func.isRequired,
};

const Legend = props => (
  <div className={props.className}>
    {
      props.data.map((el, index) => (
        <LegendItem
          key={`legend-${index}`}
          className={`${props.className}__item`}
          color={el.color}
          onClick={() => props.onClick(index)}
        >
          {el.label}
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
  'className': 'timeline-legend',
};

export default Legend;
