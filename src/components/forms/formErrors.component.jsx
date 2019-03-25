import React from 'react';
import PropTypes from 'prop-types';

export const FormErrors = ({ formErrors }) => (
  <div className="formErrors">
    {Object.keys(formErrors).map((fieldName, i) => {
      if (formErrors[fieldName].length > 0) {
        return (
          <p key={i}>*{formErrors[fieldName]}</p>
        );
      }
        return '';
    })}
  </div>
);

FormErrors.propTypes = {
  'formErrors': PropTypes.object.isRequired,
};
export default FormErrors;
