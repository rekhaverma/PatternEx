import React from 'react';
import PropTypes from 'prop-types';

import Label from './label.component';

const LabelList = props => (
  <div className={props.className}>
    { props.labels.map(el => (
      <Label
        key={el}
        text={el}
        hasCancel
        onCancel={() => props.onCancel(el)}
      />
    )) }
  </div>
);
LabelList.displayName = 'LabelList';
LabelList.propTypes = {
  'className': PropTypes.string,
  'labels': PropTypes.array.isRequired,
};
LabelList.defaultProps = {
  'className': 'comboBox__labelList',
};

export default LabelList;
