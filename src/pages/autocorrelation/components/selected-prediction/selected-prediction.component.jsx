import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import './selected-prediction.style.scss';

const baseClassName = 'selectedPrediction';

const SelectedPrediction = props => (
  <div className={props.isHidden ? `${baseClassName} +hidden` : baseClassName}>
    <FormattedMessage id="predictions.selected.title">
      { text => <p className={`${baseClassName}__title`}>{text}</p> }
    </FormattedMessage>
    {props.children}
  </div>
);
SelectedPrediction.propTypes = {
  'children': PropTypes.object,
  'isHidden': PropTypes.bool,
};
SelectedPrediction.defaultProps = {
  'children': null,
  'isHidden': false,
};

export default SelectedPrediction;
