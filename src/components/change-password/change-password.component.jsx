import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { ptrxRESTlocal } from 'lib/rest';

import Popup from 'components/popup';
import { Input } from 'components/forms';

const required = (msg = 'Input is required') => ({
  'id': 'req',
  'fn': e => e.target.value !== '',
  'error': msg,
});

const sameAs = (value, msg = 'Confirm password should be same as new password') => ({
  'id': 'sameAs',
  'fn': e => e.target.value === value,
  'error': msg,
});

const checkForErrors = (errors) => {
  const keys = Object.keys(errors);
  let valid = true;
  let index = 0;

  while (index < keys.length && valid === true) {
    if (errors[keys[index]].length > 0) {
      valid = false;
    }
    index += 1;
  }

  return valid;
};

class ChangePassword extends PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'currentPassword': '',
      'nextPassword': '',
      'confirmPassword': '',
      'errors': {
        'currentPassword': [],
        'nextPassword': [],
        'confirmPassword': [],
      },
    };

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(key, value) {
    if (Object.keys(this.state).includes(key)) {
      this.setState({
        [key]: value,
      });
    }
  }

  onBlur(key, e, validators) {
    const errors = validators
      .map(({ id, fn, error }) => (fn(e) ? null : { id, error }))
      .filter(item => item !== null);

    this.setState({
      'errors': {
        ...this.state.errors,
        [key]: errors,
      },
    });
  }

  onSubmit() {
    const state = this.state;

    if (state.confirmPassword !== ''
    && state.nextPassword !== ''
    && state.confirmPassword !== ''
    && checkForErrors(state.errors)) {
      ptrxRESTlocal.post('changepwd', {
        'currentPassword': state.currentPassword,
        'newPassword': state.nextPassword,
        'confirmPassword': state.confirmPassword,
      })
        .then((response) => {
          if (response.status === 200) {
            window.location.href = window.location.origin;
          }
        })
        .catch();
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <Popup
        {...this.props}
        title="Change Password"
        style={{ 'width': 450 }}
      >
        <div>
          <div className="validationGroup">
            <div className="formGroup +no-bottom">
              <span className="formGroup__label">Current Password</span>
              <Input
                className={errors.currentPassword.length === 0 ? 'input' : 'input +error'}
                type="password"
                name="currentPassword"
                value={this.state.currentPassword}
                onChange={e => this.onChange('currentPassword', e.target.value)}
                onBlur={e => this.onBlur('currentPassword', e, [required('Please enter current password')])}
              />
            </div>
            <div className="validationGroup__errors">
              { errors.currentPassword.map(el => <span key={el.id}>{el.error}</span>) }
            </div>
          </div>
          <div className="validationGroup">
            <div className="formGroup +no-bottom">
              <span className="formGroup__label">New Password</span>
              <Input
                className={errors.nextPassword.length === 0 ? 'input' : 'input +error'}
                type="password"
                name="nextPassword"
                value={this.state.nextPassword}
                onChange={e => this.onChange('nextPassword', e.target.value)}
                onBlur={e => this.onBlur('nextPassword', e, [required('Please enter next password')])}
              />
            </div>
            <div className="validationGroup__errors">
              { errors.nextPassword.map(el => <span key={el.id}>{el.error}</span>) }
            </div>
          </div>
          <div className="validationGroup">
            <div className="formGroup +no-bottom">
              <span className="formGroup__label">Confirm Password</span>
              <Input
                className={errors.confirmPassword.length === 0 ? 'input' : 'input +error'}
                type="password"
                name="confirmPassword"
                value={this.state.confirmPassword}
                onChange={e => this.onChange('confirmPassword', e.target.value)}
                onBlur={e => this.onBlur('confirmPassword', e, [required('Please enter new password again'), sameAs(this.state.nextPassword)])}
              />
            </div>
            <div className="validationGroup__errors">
              { errors.confirmPassword.map(el => <span key={el.id}>{el.error}</span>) }
            </div>
          </div>
          <div style={{ 'display': 'flex', 'justifyContent': 'center' }}>
            <button className="button--dark" onClick={this.props.onClose}>Close</button>
            <button className="button" onClick={this.onSubmit}>Submit</button>
          </div>
        </div>
      </Popup>
    );
  }
}
ChangePassword.displayName = 'ChangePassword';
ChangePassword.propTypes = {
  'onClose': PropTypes.func,
};
ChangePassword.defaultProps = {
  'onClose': () => null,
};

export default ChangePassword;
