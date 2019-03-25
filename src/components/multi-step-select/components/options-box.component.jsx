import React from 'react';
import PropTypes from 'prop-types';

import OptionList from './option-list.component';
import withBox from '../../withBox';

const OptionsBox = (props) => {
  const {
    className,
    activeOption,
    options,
    updateOptionsChoosen,
  } = props;

  return (
    <OptionList
      className={className}
      activeOption={activeOption}
      scrollbar
      options={options}
      onClick={updateOptionsChoosen}
    />
  );
};

OptionsBox.displayName = 'OptionsBox';
OptionsBox.propTypes = {
  'className': PropTypes.string,
  'options': PropTypes.array,
  'activeOption': PropTypes.string,
  'updateOptionsChoosen': PropTypes.func,
};
OptionsBox.defaultProps = {
  'className': '',
  'firstBoxIsOpen': false,
  'secondBoxIsOpen': false,
  'options': [],
  'subOptions': [],
  'activeOption': '',
  'updateOptionsChoosen': () => null,
};

export default withBox(OptionsBox);
