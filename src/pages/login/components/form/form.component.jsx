import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { MatField } from 'components/forms';

class Form extends React.PureComponent {
  static validateValueRequire(value) {
    return value.toString().length === 0;
  }

  constructor(...args) {
    super(...args);

    this.state = {
      username: '',
      password: '',
      formErrors: {
        username: false,
        password: false,
      },
    };

    this.onSubmitFormHandler = this.onSubmitFormHandler.bind(this);
  }

  onSubmitFormHandler(event) {
    event.preventDefault();

    if (this.setFormErrors()) {
      return;
    }

    this.props.onSubmitForm({
      username: this.state.username,
      password: this.state.password,
    });
  }

  onChangeInputHandler(name, value) {
    const errors = { ...this.state.formErrors };
    errors[name] = Form.validateValueRequire(value);

    this.setState({
      [name]: value,
      formErrors: errors,
    });
  }

  onErrorFoundHandler(name, value) {
    const errors = { ...this.state.formErrors };
    errors[name] = value;

    this.setState({
      formErrors: errors,
    });
  }

  setFormErrors() {
    if (Form.validateValueRequire(this.state.username) ||
      Form.validateValueRequire(this.state.password)) {
      this.setState({
        formErrors: {
          username: Form.validateValueRequire(this.state.username),
          password: Form.validateValueRequire(this.state.password),
        },
      });

      return true;
    }

    return false;
  }

  render() {
    return (
      <form className="login__form" onSubmit={this.onSubmitFormHandler} noValidate>
        <div className="login__field login-field">
          <div className="login-field__icon">
            <label htmlFor="login-username">
              <span className="icon-user-login" />
            </label>
          </div>
          <div className="login-field__input">
            <MatField
              label="login.form.username.label"
              name="username"
              onErrorFound={value => this.onErrorFoundHandler('username', value)}
              onChange={value => this.onChangeInputHandler('username', value)}
              hasError={this.state.formErrors.username}
              errorMessage="login.form.username.error"
              type="text"
              prefix="login"
              value={this.state.username}
            />
          </div>
        </div>
        <div className="login__field login-field">
          <div className="login-field__icon">
            <label htmlFor="login-password">
              <span className="icon-lock" />
            </label>
          </div>
          <div className="login-field__input">
            <MatField
              label="login.form.password.label"
              name="password"
              onErrorFound={value => this.onErrorFoundHandler('password', value)}
              onChange={value => this.onChangeInputHandler('password', value)}
              hasError={this.state.formErrors.password}
              errorMessage="login.form.password.error"
              type="password"
              prefix="login"
              value={this.state.password}
            />
          </div>
        </div>
        <div className="login__field login__submit">
          <button
            className="button--success +medium"
            type="submit"
            disabled={this.state.formErrors.username || this.state.formErrors.password}
          >
            <FormattedMessage id="login.form.submit" />
          </button>
        </div>
      </form>
    );
  }
}

Form.propTypes = {
  onSubmitForm: PropTypes.func.isRequired,
};

Form.defaultProps = {
  onSubmitForm: () => {
  },
};

export default Form;
