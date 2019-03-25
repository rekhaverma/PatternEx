import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import classNameCreator from 'lib/dom';

import { TabElement, TabCountElement } from './components';

import './tabs.style.scss';

class Tab extends PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'active': '',
    };

    this.onSelectTab = this.onSelectTab.bind(this);
  }

  componentDidMount() {
    this.setState({
      'active': this.props.active !== '' ? this.props.active : this.props.items[0].id,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active !== '') {
      this.setState({
        'active': nextProps.active,
      });
    } else {
      this.setState({
        'active': nextProps.items[0].id,
      });
    }
  }

  onSelectTab(activeTab) {
    this.setState({
      'active': activeTab,
    }, this.props.onClick(activeTab));
  }

  constructClassName() {
    let final = classNameCreator(this.props, [], this.props.className);

    if (this.props.slim) {
      final += '--slim';
    }

    return `${final} ${this.props.customClassName}`;
  }

  render() {
    const { items, className, style } = this.props;
    const { active } = this.state;
    return (
      <div
        className={this.constructClassName()}
        style={style}
      >
        {
          items.map(item => (Object.keys(item).includes('count') ? (
            <TabCountElement
              active={active === item.id}
              key={item.id}
              className={this.props.fullWidth === true
                ? `${className}__element +fullWidth`
                : `${className}__element`}
              title={item.title}
              count={item.count}
              id={item.id}
              onClick={(this.onSelectTab)}
            />
          ) : (
            <TabElement
              active={active === item.id}
              key={item.id}
              className={this.props.fullWidth === true
                ? `${className}__element +fullWidth`
                : `${className}__element`}
              title={item.title}
              id={item.id}
              onClick={(this.onSelectTab)}
            />
          )))
        }
      </div>
    );
  }
}
Tab.displayName = 'Tab';
Tab.propTypes = {
  'active': PropTypes.string,
  'className': PropTypes.string,
  'customClassName': PropTypes.string,
  'fullWidth': PropTypes.bool,
  'items': PropTypes.array,
  'style': PropTypes.object,
  'slim': PropTypes.bool,
  'onClick': PropTypes.func,
};
Tab.defaultProps = {
  'active': '',
  'className': 'tabs',
  'customClassName': '',
  'fullWidth': false,
  'items': [],
  'style': {},
  'slim': false,
  'onClick': () => null,
};

export default Tab;
