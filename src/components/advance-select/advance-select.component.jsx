import React from 'react';
import PropTypes from 'prop-types';

import WithBox from 'components/withBox';
import SingleSelect from './components/single-select/single-select.component';

import './advance-select.style.scss';

/**
 * @todo: Implement multiselect version of this select
 * @param props
 * @returns {*}
 * @constructor
 */
export const AdvanceSelect = props => (
  props.multipleSelect ? (
    <SingleSelect
      options={props.options}
      activeOption={props.activeOption}
      onOptionUpdate={props.onOptionUpdate}
      dropDownHeader={props.dropDownHeader}
      boxIsOpen={props.boxIsOpen}
      openBox={props.openBox}
      closeBox={props.closeBox}
      className={props.className}
      allowClear={props.allowClear}
      defaultValue={props.defaultValue}
    />
  ) : (
    <SingleSelect
      options={props.options}
      activeOption={props.activeOption}
      onOptionUpdate={props.onOptionUpdate}
      dropDownHeader={props.dropDownHeader}
      boxIsOpen={props.boxIsOpen}
      openBox={props.openBox}
      closeBox={props.closeBox}
      className={props.className}
      allowClear={props.allowClear}
      defaultValue={props.defaultValue}
      errorMessage={props.errorMessage}
      hasError={props.hasError}
      allowSearch={props.allowSearch}
    />
  )
);

AdvanceSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  })).isRequired,
  activeOption: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
  onOptionUpdate: PropTypes.func.isRequired,
  boxIsOpen: PropTypes.bool.isRequired,
  openBox: PropTypes.func.isRequired,
  closeBox: PropTypes.func.isRequired,
  allowClear: PropTypes.bool,
  allowSearch: PropTypes.bool,
  defaultValue: PropTypes.string,
  multipleSelect: PropTypes.bool,
  dropDownHeader: PropTypes.string,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  className: PropTypes.string, // this property is overwrite the entire style for this component
};

AdvanceSelect.defaultProps = {
  allowClear: false,
  allowSearch: false,
  multipleSelect: false,
  dropDownHeader: null,
  className: 'advance-select',
  defaultValue: 'all',
  errorMessage: '',
  hasError: false,
};

export default WithBox(AdvanceSelect);
