import React from 'react';
import PropTypes from 'prop-types';
import { Entity } from '../entity/entity.component';

export const ExpandedRow = (props) => {
  const { data } = props;
  let maxValue = 0;
  data.forEach((item) => {
    if (item.value > maxValue) {
      maxValue = item.value;
    }
  });

  return (
    <div className={`${props.className}__expanded-row`}>
      {
        data.map((item, index) => (
          <Entity
            key={index}
            maxValue={maxValue}
            title={item.title}
            value={item.value}
            className={props.className}
          />
        ))
      }
    </div>
  );
};

ExpandedRow.propTypes = {
  data: PropTypes.array.isRequired,
  className: PropTypes.string,
};

ExpandedRow.defaultProps = {
  className: 'log-manager',
};
