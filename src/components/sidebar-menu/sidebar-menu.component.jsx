import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import { noAncestry } from 'lib';

import logo from 'public/images/logo.png';

import { MenuList } from './components';

import './sidebar-menu.style.scss';

import Item from './components/item.component';

class SidebarMenu extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'active': '',
      'openItem': '',
      'boxIsOpen': false,
    };

    this.root = null;
    this.setActive = this.setActive.bind(this);
    this.setOpenItem = this.setOpenItem.bind(this);
    this.autoclose = this.autoclose.bind(this);
    this.closeBox = this.closeBox.bind(this);
    this.openBox = this.openBox.bind(this);
  }

  componentDidMount() {
    const { active, items } = this.props;
    this.setState({
      'active': active || items[0].id,
    });
    // localStorage.removeItem('route');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active !== this.state.active) {
      this.setState({
        'active': nextProps.active,
      });
    }
  }

  componentWillUnmount() {
    this.detachEvent();
  }

  setActive(item) {
    this.setState({
      'active': item,
    }, () => {
      // @todo Refactor this to use react-router
      switch (item) {
        case 'analyticsDashboardLink':
          window.open('/analytics/#', '_zeppelin');
          return;

        case 'apidocSwagger':
          window.location.href = `${window.location.origin}/v0.2/api-docs`;
          return;

        case 'dashboard':
          window.location.href = `${window.location.origin}/dashboard`;
          return;

        case 'correlation':
          window.location.href = `${window.location.origin}/correlation`;
          return;

        case 'suspiciousLink':
          window.location.href = `${window.location.origin}/behavior/suspicious`;
          return;

        case 'maliciousLink':
          window.location.href = `${window.location.origin}/behavior/malicious`;
          return;

        default:
          localStorage.setItem('route', item);
          window.location.href = window.location.origin;
      }
    });
  }

  setOpenItem(item) {
    this.setState({
      'openItem': item === this.state.openItem ? '' : item,
    });
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
    const {
      hasLogo,
      items,
      isOld,
      className,
    } = this.props;
    const { active, openItem, boxIsOpen } = this.state;

    if (isOld) {
      return (
        <div>
          <div className={!boxIsOpen ? 'menu_icon' : 'menu_icon active'} onClick={this.openBox}>
            <span />
          </div>
          <div className={boxIsOpen ? 'sidebarMenu1 +active' : 'sidebarMenu1'}>
            { boxIsOpen && <div className="sidebarMenu1__overlay" /> }
            <div
              className={boxIsOpen ? 'sidebarMenu1__content +active' : 'sidebarMenu1__content'}
              ref={ref => this.root = ref}
            >
              {
                hasLogo && (
                  <img className="sidebarMenu1__logo" src={logo} alt="PatternEx" />
                )
              }
              <MenuList
                active={active}
                openItem={openItem}
                list={items}
                privileges={this.props.privileges}
                onClick={this.setActive}
                onOpen={this.setOpenItem}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <section className={className}>
        {
          items.map((el) => {
            const query = Object.assign({}, this.props.query);

            switch (el.id) {
              case 'malicious':
              case 'suspicious':
                // case 'autocorrelateLink':
                // case 'models':
                query.start_time = moment().subtract(7, 'days').format('MM-DD-YYYY');
                query.end_time = moment().format('MM-DD-YYYY');
                break;
              default:
                break;
            }

            return (
              <Item
                {...el}
                activeDropdown={openItem === el.id}
                key={el.id}
                query={query}
                onClick={this.setActive}
                onDropdownClick={this.setOpenItem}
              />
            );
          })
        }
        <div className={`${className}__slider-icon`}>
          <span className="icon-group-3" />
        </div>
      </section>
    );
  }
}
SidebarMenu.displayName = 'SidebarMenu';
SidebarMenu.propTypes = {
  'active': PropTypes.string,
  'className': PropTypes.string,
  'isOld': PropTypes.bool,
  'items': PropTypes.array,
  'hasLogo': PropTypes.bool,
  'query': PropTypes.object,
  'privileges': PropTypes.object.isRequired,
};
SidebarMenu.defaultProps = {
  'active': '',
  'className': 'sidebarMenu',
  'hasLogo': true,
  'items': [],
  'isOld': false,
  'query': {},
};

export default SidebarMenu;
