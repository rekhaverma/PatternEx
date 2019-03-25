import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';

import { Option } from '../option/option.component';

export const OptionList = (props) => {
  const { className, onOptionClick, options } = props;
  let minHeight = options.length * 26;
  const maxHeight = 200;
  if (minHeight > maxHeight) {
    minHeight = maxHeight;
  }
  return (
    <div className={`${className}__option-list`}>
      <Scrollbars
        autoHeight
        hideTracksWhenNotNeeded
        autoHeightMin={minHeight}
        autoHeightMax={maxHeight}
        renderThumbVertical={subProps => <div {...subProps} style={{ 'backgroundColor': '#ccc', 'borderRadius': '3px' }} className="thumb-vertical" />}
      >
        {options.map(({ id, label, isSelected, disabled }) => (
          <Option
            className={className}
            key={id}
            id={id}
            label={label}
            isDisabled={disabled}
            onOptionClick={onOptionClick}
            isSelected={isSelected || false}
          />
        ))}
      </Scrollbars>
    </div>
  );
};

OptionList.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    isSelected: PropTypes.bool,
    disabled: PropTypes.bool,
  })).isRequired,
  onOptionClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

OptionList.defaultProps = {
  className: 'options-toggle',
};
