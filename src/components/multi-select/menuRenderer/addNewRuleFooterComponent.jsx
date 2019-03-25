import React from 'react';
import PropTypes from 'prop-types';

const AddNewRuleFooterComponent = props => (
  <div className={props.className} onClick={props.onFooterClick} >
    <span>
      <span className="icon-close" />
      Add new Rule
    </span>
  </div>
);

AddNewRuleFooterComponent.propTypes = {
  'onFooterClick': PropTypes.func.isRequired,
  'className': PropTypes.string,
};

AddNewRuleFooterComponent.defaultProps = {
  'className': 'menuRendererCR__footer',
};

export default AddNewRuleFooterComponent;
