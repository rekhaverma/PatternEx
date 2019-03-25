import React from 'react';
import PropTypes from 'prop-types';

import { pipelineToName } from 'lib/decorators';
import Tooltip from 'components/tooltip';
import HeatMapCellIcon from './cell-icon.component.jsx';

const Filter = (props) => {
  const { title, onClick } = props;

  return (
    <div className="heatmapFilters__component">
      <div>{title}</div>
      <div className="heatmapFilters__filtersList">
        {
          props.filters.map((el, index) => {
            if (props.type === 'entity') {
              return (
                <Tooltip
                  trigger={(
                    <div
                      className="heatmapFilters__item"
                      key={`${el.id}-${index}`}
                      onClick={() => onClick(el.id)}
                    >
                      <HeatMapCellIcon id={el.id} />
                    </div>
                  )}
                  position="bottom"
                  key={index}
                >
                  {pipelineToName(el.id)}
                </Tooltip>
              );
            }
            return (
              <div
                className={`heatmapFilters__item--${el.id}`}
                key={`${el.id}-${index}`}
                onClick={() => onClick(el.id)}
              />
            );
          })
        }
      </div>
    </div>
  );
};
Filter.propTypes = {
  'filters': PropTypes.arrayOf(PropTypes.object),
  'type': PropTypes.oneOf([
    'entity', 'severity',
  ]).isRequired,
  'title': PropTypes.oneOfType([
    PropTypes.string, PropTypes.element,
  ]).isRequired,
  'onClick': PropTypes.func,
};
Filter.defaultProps = {
  'filters': [],
  'type': 'entity',
  'onClick': () => null,
};
export default Filter;
