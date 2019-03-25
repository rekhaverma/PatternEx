import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';

import { defaultRoute } from 'config';
import { userLogin } from 'model/actions/session';
import Loader from 'components/loader/loader-v2.component';

import logo from 'public/images/logo.png';
import bgImage from 'public/images/login-bg.png';

import Form from './components/form/form.component';
import './login.style.scss';

export class Login extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.onSubmitFormHandler = this.onSubmitFormHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      this.props.updateLocation(defaultRoute);
    }
  }

  onSubmitFormHandler(data) {
    this.props.userLogin(data);
  }

  render() {
    const bgStyle = {
      backgroundImage: `url(${bgImage})`,
    };

    return (
      <div className="login" style={bgStyle} >
        { this.props.isLoading && <Loader />}
        <div className="login__container">
          <div className="login__logo">
            <img src={logo} alt="patternex logo" />
          </div>
          <div className="login__form-container">
            <div className="login__title">
              <FormattedMessage id="login.title" />
            </div>
            <Form onSubmitForm={this.onSubmitFormHandler} />
          </div>
        </div>
        <div className="login__footer">
          <FormattedMessage id="footer.email" />
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  updateLocation: PropTypes.func.isRequired,
  userLogin: PropTypes.func.isRequired,
};

Login.defaultProps = {
  isAuthenticated: false,
  isLoading: false,
  userLogin: () => {},
};

export const mapStateToProps = state => ({
  isAuthenticated: state.session.toJS().isAuthenticated,
  isLoading: state.session.toJS().isLoading,
});

export const mapDispatchToProps = dispatch => ({
  userLogin: data => dispatch(userLogin(data)),
  updateLocation: location => dispatch(routerActions.push(location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
