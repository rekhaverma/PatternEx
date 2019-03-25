import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import ToolbarIconsBar from './components/icons-bar.component';

import './toolbar.style.scss';

const backIcon = 'icon-chevron-up';

class Toolbar extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'active': 'link-symbol',
      'showClusterList': 'initially',
    };

    this.handleIconClick = this.handleIconClick.bind(this);
    this.handleElementClick = this.handleElementClick.bind(this);
  }

  /**
   * Get the data-name attribute from the target (or the parent - if
   * user clicked direcly on icon) and update the state. If the icon clicked
   * is the same as current active icon, update the state to '' (which means we're
   * closing the tooblar).
   *
   * @param {Event} e  Event object
   */
  handleIconClick(e) {
    const iconName = e.target.getAttribute('data-name') !== null
      ? e.target.getAttribute('data-name')
      : e.target.parentNode.getAttribute('data-name');

    if (this.state.showClusterList === 'initially') {
      this.setState({
        'showClusterList': '',
      });
    }
    if (iconName !== null) {
      this.setState({
        'active': iconName === this.state.active ? '' : iconName,
      });
    }
  }

  handleElementClick(...args) {
    this.setState(
      { 'active': '' },
      this.props.onClusterClick(...args),
    );
  }

  render() {
    return (
      <div>
        <div className={`${this.props.className}__opener`}>
          <span className={`${this.props.className}__text`} data-name="link-symbol" onClick={this.handleIconClick}>
            <FormattedMessage id="autocorrelation.toolbar" />
          </span>
          <ToolbarIconsBar
            active={this.state.active}
            backIcon={backIcon}
            className={this.props.className}
            options={this.props.options}
            onClick={this.handleIconClick}
          />
        </div>
        <div className={this.state.active !== ''
          ? `${this.props.className} +open`
          : this.props.className}
        >
          <div
            className={this.state.active !== ''
              ? `${this.props.className}__content +open`
              : `${this.props.className}__content`}
          >
            {
              this.state.active !== '' && React.cloneElement(
                this.props.containers[this.state.active],
                {
                  'clientHeight': this.state.active !== '' ? 200 : 0,
                  'onClusterClick': (...args) => this.handleElementClick(...args),
                  'showClusterList': this.state.showClusterList,
                },
              )
            }
          </div>
        </div>
      </div>
    );
  }
}
Toolbar.propTypes = {
  'className': PropTypes.string,
  'containers': PropTypes.object.isRequired,
  'options': PropTypes.array.isRequired,
  'onClusterClick': PropTypes.func.isRequired,
};
Toolbar.defaultProps = {
  'className': 'toolbar',
  'onClick': () => null,
};

export default Toolbar;
