import React from 'react';
import PropTypes from 'prop-types';

import { Scrollbars } from 'react-custom-scrollbars';
import Option from './option.component';

const OptionList = ({ options, onClick, ...props }) => {
  const renderOptions = (el, index) => (
    <Option
      key={index}
      option={el}
      onClick={() => onClick(el)}
    />
  );
  return (
    <div className={props.className}>
      <Scrollbars
        autoHeight
        autoHeightMax={200}
        renderTrackHorizontal={subProps => <div {...subProps} className="track-horizontal" />}
        renderTrackVertical={subProps => <div {...subProps} className="track-vertical" />}
        renderThumbHorizontal={subProps => <div {...subProps} className="thumb-horizontal" />}
        renderThumbVertical={subProps => <div {...subProps} className="thumb-vertical" />}
      >
        {options.map(renderOptions)}
      </Scrollbars>
    </div>
  );
};
OptionList.displayName = 'OptionList';
OptionList.propTypes = {
  'className': PropTypes.string,
  'options': PropTypes.array,
  'onClick': PropTypes.func.isRequired,
};
OptionList.defaultProps = {
  'className': 'multipleSelectBox__optionList',
  'options': [],
};

export default OptionList;
