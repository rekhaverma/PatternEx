import React from 'react';
import PropTypes from 'prop-types';

import MultiSelectBox from './multi-select-box.component';
import SingleSelectBox from './single-select-box.component';

const SelectBox = props => (props.singleSelect
  ? <SingleSelectBox {...props} />
  : <MultiSelectBox {...props} />
);

SelectBox.propTypes = {
  'singleSelect': PropTypes.bool,
};
SelectBox.defaultProps = {
  'singleSelect': false,
};

export default SelectBox;
