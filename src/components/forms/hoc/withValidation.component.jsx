import React, { PureComponent } from 'react';

/* eslint-disable react/prop-types */
export default (Component, validators) => (
  class WithValidationComponent extends PureComponent {
    constructor(...args) {
      super(...args);

      this.state = {
        'errors': [],
        'value': this.props.value,
      };

      this.onBlur = this.onBlur.bind(this);
      this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
      this.setState({
        'value': this.props.value,
      });
    }

    onBlur(e) {
      const errors = validators
        .map(({ id, fn, error }) => (fn(e) ? null : { id, error }))
        .filter(item => item !== null);

      this.setState({
        errors,
      }, () => {
        if (this.props.onBlur
        && typeof this.props.onBlur === 'function') {
          this.props.onBlur(this.state);
        }
      });
    }

    onChange(e) {
      this.setState({
        'value': e.target.value,
      }, () => {
        if (this.props.onChange
        && typeof this.props.onChange === 'function') {
          this.props.onChange(e);
        }
      });
    }

    render() {
      const { errors } = this.state;
      const className = errors.length > 0
        ? `${this.props.className} +error`
        : this.props.className;
      return (
        <div className="validationGroup">
          <Component
            {...this.props}
            className={className}
            value={this.state.value}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <div className="validationGroup__errors">
            { errors.map(el => <span key={el.id}>{el.error}</span>)}
          </div>
        </div>
      );
    }
  }
);
