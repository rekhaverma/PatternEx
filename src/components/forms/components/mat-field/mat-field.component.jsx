import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import './mat-field.style.scss';

class MatField extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      showValue: false, // used for password type
    };

    this.onChangeInputHandler = this.onChangeInputHandler.bind(this);
    this.onBlurInputHandler = this.onBlurInputHandler.bind(this);
    this.onToggleVisibilityHandler = this.onToggleVisibilityHandler.bind(this);
  }

  onChangeInputHandler(event) {
    this.errorRequireValidation(event.target.value);
    this.props.onChange(event.target.value);
  }

  onBlurInputHandler(event) {
    this.errorRequireValidation(event.target.value);
  }

  onToggleVisibilityHandler() {
    this.setState({
      showValue: !this.state.showValue,
    });
  }

  getInputClasses() {
    const classes = [];

    if (this.props.value.toString().length) {
      classes.push('mat-field--has-value');
    }

    if (this.props.hasError) {
      classes.push('mat-field--error');
    }

    return classes.join(' ');
  }

  errorRequireValidation(value) {
    this.props.onErrorFound(value.toString().length === 0);
  }

  render() {
    const svgPath = `M19.667 3.333h-.727C18.623 1.445 16.99 0 15.024 0a4.025 4.025 0 0 0-3.942 3.193A1.67 1.67 0 
    0 0 10 2.778a1.67 1.67 0 0 0-1.082.415C8.546 1.373 6.942 0 5.024 0a4.018 4.018 0 0 0-4.007 
    3.667H.333a.333.333 0 1 0 0 .666h.684A4.018 4.018 0 0 0 5.024 8c2.156 0 3.912-1.736 
    3.97-3.89.285-.429.639-.666 1.006-.666s.721.238 1.006.666C11.065 6.264 12.843 8 15.024 
    8 17.216 8 19 6.206 19 4h.667a.333.333 0 1 0 0-.667zm-14.643 4C3.173 7.333 1.667 5.838 
    1.667 4S3.173.667 5.024.667C6.88.667 8.334 2.13 8.334 4c0 1.869-1.454 3.333-3.31 3.333zm10 
    0c-1.851 0-3.357-1.495-3.357-3.333S13.173.667 15.024.667c1.856 0 3.31 1.464 3.31 3.333 0 
    1.869-1.454 3.333-3.31 3.333z`; // used to pleased lint
    return (
      <div className={`mat-field ${this.getInputClasses()}`}>
        <input
          id={`${this.props.prefix}-${this.props.name}`}
          type={this.state.showValue ? 'text' : this.props.type}
          value={this.props.value}
          name={this.props.name}
          autoComplete={`new-${this.props.name}`}
          onChange={this.onChangeInputHandler}
          onBlur={this.onBlurInputHandler}
        />
        <label htmlFor={`${this.props.prefix}-${this.props.name}`}>
          <FormattedMessage id={this.props.label} />
        </label>
        <div className="mat-field__error-message">
          <FormattedMessage id={this.props.errorMessage} />
        </div>
        {this.props.type === 'password' && (
          <div
            className={`mat-field__action ${(this.state.showValue ? 'mat-field__action--active' : '')}`}
            onClick={this.onToggleVisibilityHandler}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="8" viewBox="0 0 20 8">
              <g fill="none" fillRule="evenodd">
                <circle cx="5" cy="4" r="4" />
                <circle cx="15" cy="4" r="4" />
                <path
                  fillRule="nonzero"
                  d={svgPath}
                />
              </g>
            </svg>
          </div>
        )}
      </div>
    );
  }
}

MatField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onErrorFound: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  value: PropTypes.string,
};

MatField.defaultProps = {
  hasError: false,
  value: '',
};

export default MatField;
