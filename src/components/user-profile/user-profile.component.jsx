import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';

import { noAncestry } from 'lib';
import { restartZeppelin } from 'model/actions';

import ProfileGroup from './components/profile-group.component';

import './user-profile.style.scss';

const items = {
  'protected': [
    {
      'id': 'usersDashboardLink',
      'label': 'Users',
      'icon': 'icon-group',
    },
    {
      'id': 'rolesDashboardLink',
      'label': 'Roles',
      'icon': 'icon-cogs',
    },
    {
      'id': 'resourcesDashboardLink',
      'label': 'Resources',
      'icon': 'icon-server',
      'url': '/resources',
    },
  ],
  'settings': [
    {
      'id': 'settings',
      'label': 'Settings',
      'icon': '',
    },
  ],
  'user': [
    {
      'id': 'changePwd',
      'label': 'Change Password',
      'icon': '',
    },
    {
      'id': 'logOut',
      'label': 'Log Out',
      'icon': '',
    },
  ],
};

const models = {
  'protected': [
    // {
    //   'id': 'modelsDashboardLink',
    //   'label': 'Models',
    //   'icon': 'icon-code',
    // },
    {
      'id': 'rulesDashboardLink',
      'label': 'Rules',
      'icon': 'icon-list-ul',
      'url': '/rules',
    },
    {
      'id': 'tagsDashboardLink',
      'label': 'Tactics',
      'icon': 'icon-tags',
    },
    {
      'id': 'sysDumpLink',
      'label': 'System Dump',
      'icon': 'icon-download',
    },
    {
      'id': 'restartZeppelin',
      'label': 'Restart Zeppelin',
      'icon': 'icon-restart',
    },
    {
      'id': 'logSource',
      'label': 'Log Source',
      'icon': 'icon-download',
    },
  ],
};

export class UserProfile extends PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'boxIsOpen': false,
    };

    this.root = null;
    this.autoclose = this.autoclose.bind(this);
    this.closeBox = this.closeBox.bind(this);
    this.openBox = this.openBox.bind(this);
    this.selectOption = this.selectOption.bind(this);
  }

  componentWillUnmount() {
    this.detachEvent();
  }

  selectOption(option) {
    const redirects = [
      'usersDashboardLink',
      'rolesDashboardLink',
      'tagsDashboardLink',
    ];

    if (option === 'modelsDashboardLink') {
      window.location.href = `${window.location.origin}/models`;
    }

    if (option === 'logOut') {
      this.props.updateLocation('/logout');
    }

    if (option === 'changePwd') {
      this.props.setPopup('changePwd');
    }

    if (option === 'sysDumpLink') {
      window.open(`${window.location.origin}/sysdump`, '_blank');
    }

    if (option === 'settings') {
      this.props.setPopup('settings');
    }

    if (option === 'logSource') {
      this.props.setPopup('logSource');
    }

    if (option === 'restartZeppelin') {
      this.props.restartZeppelin();
    }

    if (redirects.includes(option)) {
      localStorage.setItem('route', option);
      window.location.href = window.location.origin;
    }
  }

  openBox() {
    this.setState({
      'boxIsOpen': true,
    }, () => {
      this.attachEvent();
    });
  }

  closeBox() {
    this.setState({
      'boxIsOpen': false,
    }, () => {
      this.detachEvent();
    });
  }

  autoclose(ev) {
    if (noAncestry(ev.target, ReactDOM.findDOMNode(this.root))) {
      this.closeBox();
    }
  }

  attachEvent() {
    document.addEventListener('click', this.autoclose);
  }

  detachEvent() {
    document.removeEventListener('click', this.autoclose);
  }

  render() {
    const data = this.props.type === 'user' ? items : models;
    return (
      <div className={this.props.className}>
        <div className="userProfile__iconGroup" onClick={this.openBox}>
          <span className={this.props.icon} />
          <span className="icon-chevron-down" />
        </div>
        <div
          className="profileBox"
          ref={ref => this.root = ref}
          style={{ 'display': this.state.boxIsOpen ? 'block' : 'none' }}
        >
          {
            Object.keys(data).map(key => (
              <ProfileGroup
                key={key}
                items={data[key]}
                privileges={this.props.privileges}
                type={key}
                onClick={this.selectOption}
                onClose={this.closeBox}
              />
            ))
          }
        </div>
      </div>
    );
  }
}
UserProfile.displayName = ' UserProfile';
UserProfile.propTypes = {
  'icon': PropTypes.string,
  'privileges': PropTypes.object.isRequired,
  'type': PropTypes.oneOf([
    'user',
    'configuration',
  ]),
  'setPopup': PropTypes.func,
  'className': PropTypes.string,
  'restartZeppelin': PropTypes.func.isRequired,
  'updateLocation': PropTypes.func.isRequired,
};
UserProfile.defaultProps = {
  'icon': 'icon-profile',
  'type': 'user',
  'setPopup': () => null,
  'className': 'userProfile',
};

const mapDispatchToProps = dispatch => ({
  'restartZeppelin': () => dispatch(restartZeppelin()),
  'updateLocation': location => dispatch(routerActions.push(location)),
});

export default connect(null, mapDispatchToProps)(UserProfile);
