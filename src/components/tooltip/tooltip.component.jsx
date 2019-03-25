import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { Manager, Target, Popper, Arrow } from 'react-popper';
import Portal from 'react-travel';

import './tooltip.style';

export default class Tooltip extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      'hovered': false,
    };

    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onTriggerMouseEnter = this.onTriggerMouseEnter.bind(this);
    this.onTriggerMouseLeave = this.onTriggerMouseLeave.bind(this);
  }

  onMouseLeave() {
    this.setState({
      'hovered': false,
    });
  }

  onTriggerMouseEnter() {
    this.setState({
      'hovered': true,
    });
  }

  onTriggerMouseLeave(event) {
    if (!this.props.hideWhenHoveringTooltipContent
      && event.relatedTarget === findDOMNode(this.popperWrap)) {
      return;
    }
    this.setState({
      'hovered': false,
    });
  }

  render() {
    let tooltip = null;

    if (this.state.hovered) {
      tooltip = (
        <Portal>
          <Popper
            ref={node => (this.popperWrap = node)}
            placement={this.props.position}
            className="popper-wrap"
            onMouseLeave={this.onMouseLeave}
          >
            <div className="popper" style={this.props.style}>{this.props.children}</div>
            <Arrow className="popper__arrow" />
          </Popper>
        </Portal>
      );
    }

    return (
      <div className="tooltip">
        <Manager style={this.props.managerStyle}>
          <Target
            onMouseEnter={this.onTriggerMouseEnter}
            onMouseLeave={this.onTriggerMouseLeave}
          >
            {this.props.trigger}
          </Target>
          {tooltip}
        </Manager>
      </div>
    );
  }
}

Tooltip.propTypes = {
  'trigger': PropTypes.node.isRequired,
  'children': PropTypes.node.isRequired,
  'managerStyle': PropTypes.object,
  'position': PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  'hideWhenHoveringTooltipContent': PropTypes.bool,
  'style': PropTypes.object,
};

Tooltip.defaultProps = {
  'managerStyle': { 'display': 'flex' },
  'hideWhenHoveringTooltipContent': false,
  'position': 'top',
  'style': {},
};
