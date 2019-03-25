import React from 'react';
import PropTypes from 'prop-types';

import WithBox from 'components/withBox';
import { OptionList } from './components/options-list/options-list.component';

import './options-toggle.style.scss';

const OptionsToggle = (props) => {
  const { className, boxIsOpen, closeBox, onOptionsUpdate, openBox, options, icon } = props;

  return (
    <div className={className}>
      <div
        className={`${className}__icon`}
        onClick={boxIsOpen ? closeBox : openBox}
      >
        <span className={icon} />
      </div>
      {boxIsOpen && (
        <OptionList
          className={className}
          options={options}
          onOptionClick={onOptionsUpdate}
        />
      )}
    </div>
  );
};

OptionsToggle.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    isSelected: PropTypes.bool,
    disabled: PropTypes.bool,
  })).isRequired,
  onOptionsUpdate: PropTypes.func.isRequired,
  boxIsOpen: PropTypes.bool.isRequired,
  openBox: PropTypes.func.isRequired,
  closeBox: PropTypes.func.isRequired,
  className: PropTypes.string,
  icon: PropTypes.string,
};

OptionsToggle.defaultProps = {
  className: 'options-toggle',
  icon: 'icon-cog',
};

export default WithBox(OptionsToggle);
