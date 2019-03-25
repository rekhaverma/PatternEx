import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Tooltip from 'components/tooltip';

import OptionList from '../options-list/options-list.component';

class SingleSelect extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      stateOptions: [],
      selectedOption: '',
    };

    this.onOptionClick = this.onOptionClick.bind(this);
    this.onToggleDropDown = this.onToggleDropDown.bind(this);
    this.onOptionClear = this.onOptionClear.bind(this);
  }

  componentDidMount() {
    const { options, activeOption } = this.props;
    this.generateNextOptions(options, activeOption);
  }

  componentWillReceiveProps({ options, activeOption }) {
    this.generateNextOptions(options, activeOption);
  }

  onOptionClick(value) {
    this.props.onOptionUpdate(value);
    this.props.closeBox();
  }

  onOptionClear() {
    this.props.onOptionUpdate(this.props.defaultValue);
  }

  onToggleDropDown() {
    if (this.props.boxIsOpen) {
      return this.props.closeBox();
    }

    return this.props.openBox();
  }

  shouldBeDisplayedClearButton() {
    if (!this.props.allowClear) {
      return false;
    }

    return this.props.activeOption !== this.props.defaultValue;
  }

  generateNextOptions(options, activeOption) {
    let selectedOption = '';

    const nextOptions = options.map((item) => {
      if (item.id === activeOption) {
        selectedOption = item;
      }

      return {
        ...item,
        isSelected: item.id === activeOption,
      };
    });

    this.setState({
      selectedOption,
      stateOptions: nextOptions,
    });
  }

  render() {
    const { stateOptions, selectedOption } = this.state;
    const {
      className,
      dropDownHeader,
      boxIsOpen,
      errorMessage,
      hasError,
      allowSearch,
    } = this.props;
    const shouldBeDisplayedClearButton = this.shouldBeDisplayedClearButton();

    let selectClassName = `${className} ${className}--single-select`;
    if (boxIsOpen) {
      selectClassName += ` ${className}--open`;
    }

    if (shouldBeDisplayedClearButton) {
      selectClassName += ` ${className}--clear-displayed`;
    }

    return (
      <div className={selectClassName}>
        <div
          className={`${className}__selected-value`}
          onClick={this.onToggleDropDown}
        >
          <span>{selectedOption.value}</span>
          {shouldBeDisplayedClearButton && (
            <div className={`${className}__clear-button`}>
              <Tooltip
                position="top"
                trigger={(
                  <span
                    className="icon-Trash-icon"
                    onClick={this.onOptionClear}
                  />
                )}
              >
                <FormattedMessage id="dashboard.reset" />
              </Tooltip>
            </div>
          )}
        </div>
        {boxIsOpen && (
          <OptionList
            options={stateOptions}
            className={className}
            onOptionClick={this.onOptionClick}
            dropDownHeader={dropDownHeader}
            allowSearch={allowSearch}
          />
        )}
        {errorMessage && (
          <div className={`${className}__error-message ${(hasError ? `${className}__error-message--active` : '')}`}>
            <FormattedMessage id={errorMessage} />
          </div>
        )}
      </div>
    );
  }
}

SingleSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    disabled: PropTypes.bool,
  })).isRequired,
  activeOption: PropTypes.string.isRequired,
  onOptionUpdate: PropTypes.func.isRequired,
  boxIsOpen: PropTypes.bool.isRequired,
  openBox: PropTypes.func.isRequired,
  closeBox: PropTypes.func.isRequired,
  allowClear: PropTypes.bool,
  allowSearch: PropTypes.bool,
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  dropDownHeader: PropTypes.string,
  errorMessage: PropTypes.string,
  hasError: PropTypes.bool,
};

SingleSelect.defaultProps = {
  allowClear: false,
  allowSearch: false,
  className: 'advance-select',
  dropDownHeader: null,
  defaultValue: 'all',
  errorMessage: '',
  hasError: false,
};

export default SingleSelect;
