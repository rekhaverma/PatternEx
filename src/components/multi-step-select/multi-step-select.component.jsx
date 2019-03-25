import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import OptionsBox from './components/options-box.component';

import './multi-step-select.style.scss';

class MultiStepSelect extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      activeOption: '',
      activeSubOption: '',
      firstBoxIsOpen: false,
      secondBoxIsOpen: false,
    };

    this.updateOptionsChosen = this.updateOptionsChosen.bind(this);
    this.openSelectBox = this.openSelectBox.bind(this);
  }

  componentDidMount() {
    const { activeOptions } = this.props;
    this.setState({
      activeOption: activeOptions.option,
      activeSubOption: activeOptions.subOption,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { activeOptions } = nextProps;
    this.setState({
      activeOption: activeOptions.option,
      activeSubOption: activeOptions.subOption,
    });
  }

  getSubOptions(option) {
    const { options } = this.props;
    const selectedOption = options.find(opt => opt.content === option);

    let subOptions = [];

    if (selectedOption && Object.keys(selectedOption).includes('options') && selectedOption.options.length > 0) {
      subOptions = selectedOption.options.reduce((acc, opt) => [
        ...acc, {
          'id': opt.label,
          'content': opt.label,
          'isEnabled': opt.isEnabled,
        }], []);
    }

    return subOptions;
  }

  openSelectBox() {
    this.setState({
      'firstBoxIsOpen': !this.state.firstBoxIsOpen,
    }, () => {
      if (!this.state.firstBoxIsOpen && this.state.secondBoxIsOpen) {
        this.setState({
          'secondBoxIsOpen': false,
        });
      }
    });
  }

  updateOptionsChosen(key, e, options) {
    const currentId = e.target.getAttribute('data-id') !== null
      ? e.target.getAttribute('data-id')
      : e.target.parentNode.getAttribute('data-id');

    const selectedOption = options.find(opt => opt.content === currentId);

    this.setState({
      [key]: currentId,
    }, () => {
      if (Object.keys(selectedOption).includes('options') && selectedOption.options.length > 0) {
        this.setState({
          secondBoxIsOpen: true,
        });
      } else {
        this.setState({
          firstBoxIsOpen: false,
          secondBoxIsOpen: false,
        }, () => {
          this.props.setOptions({
            option: this.state.activeOption,
            subOption: this.state.activeSubOption,
          });
        });
      }
    });
  }

  render() {
    const { options, placeholder, className, hasError, errorMessage } = this.props;
    const { activeOption, activeSubOption, firstBoxIsOpen, secondBoxIsOpen } = this.state;

    const subOptions = activeOption !== '' ? this.getSubOptions(activeOption) : [];

    const showOptionsName = () => {
      const optionsLabel = [];
      if (activeOption) {
        optionsLabel.push(activeOption);
      }
      if (activeSubOption) {
        optionsLabel.push(activeSubOption);
      }

      return optionsLabel.length ? optionsLabel.join('/') : placeholder;
    };

    return (
      <div className="multi-step-select">
        <div className={firstBoxIsOpen ? 'multi-step-select__box +open' : 'multi-step-select__box'} onClick={this.openSelectBox}>
          <span>{showOptionsName()}</span>
        </div>
        {
          options.length > 0 && firstBoxIsOpen && (
            <OptionsBox
              className={`${className}__optionList`}
              activeOption={activeOption}
              scrollbar
              options={options}
              updateOptionsChoosen={e => this.updateOptionsChosen('activeOption', e, options)}
            />
          )
        }
        {
          secondBoxIsOpen && subOptions.length > 0 && (
            <OptionsBox
              className={`${className}__subOptionList`}
              activeOption={activeSubOption}
              scrollbar
              options={subOptions}
              updateOptionsChoosen={e => this.updateOptionsChosen('activeSubOption', e, subOptions)}
            />
          )
        }
        <div className={`${className}__error-message ${(hasError ? `${className}__error-message--active` : '')}`}>
          <FormattedMessage id={errorMessage} />
        </div>
      </div>
    );
  }
}

MultiStepSelect.displayName = 'MultiStepSelect';
MultiStepSelect.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.array.isRequired,
  activeOptions: PropTypes.shape({
    option: PropTypes.string.isRequired,
    subOption: PropTypes.string.isRequired,
  }).isRequired,
  setOptions: PropTypes.func.isRequired,
  className: PropTypes.string,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
};
MultiStepSelect.defaultProps = {
  placeholder: '',
  className: 'multi-step-select',
  errorMessage: '',
  hasError: false,
};

export default MultiStepSelect;
