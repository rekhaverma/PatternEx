import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { timeConstants } from 'config';

import './notification.style.scss';

const iconClass = {
  'success': 'icon-success',
  'info': 'icon-info',
  'error': 'icon-error',
};

class Notification extends Component {
  constructor(...args) {
    super(...args);

    this.timeout = null;
  }

  componentDidMount() {
    this.timeout = window.setTimeout(() => {
      this.props.remove(this.props.id);
    }, timeConstants.CLOSE_TIME);
  }

  componentWillUnmount() {
    window.clearTimeout(this[`timeout${this.props.id}`]);
  }

  render() {
    const {
      type,
      content,
      baseClass,
      remove,
      id,
    } = this.props;

    return (
      <div className={`${baseClass} ${baseClass}--${type}`}>
        <span className={`notification__icon ${iconClass[type]}`} />
        <div>
          {
            content.split('\n').map((line, key) => <FormattedMessage key={key} id="notification.text" values={{ line }} />)
          }
        </div>
        <span
          className="notification__close icon-remove"
          onClick={() => { remove(id); }}
        />
      </div>
    );
  }
}

Notification.propTypes = {
  'id': PropTypes.string,
  'type': PropTypes.string,
  'content': PropTypes.string,
  'baseClass': PropTypes.string,
  'remove': PropTypes.func,
};

Notification.defaultProps = {
  'id': '',
  'type': 'info',
  'content': 'Updated',
  'date': '',
  'remove': () => {},
  'setTimeout': () => {},
  'baseClass': 'notification',
};

export default Notification;
