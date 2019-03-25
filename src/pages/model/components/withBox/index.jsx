import React from 'react';
import ReactDOM from 'react-dom';

import { noAncestry } from 'lib';

const WithBox = Component => class WithBoxHOC extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'boxIsOpen': false,
    };

    // refs
    this.root = null;

    this.openBox = this.openBox.bind(this);
    this.closeBox = this.closeBox.bind(this);
    this.autoclose = this.autoclose.bind(this);
  }

  openBox() {
    this.setState({ 'boxIsOpen': true }, this.attachEvent);
  }

  closeBox() {
    this.setState({ 'boxIsOpen': false }, this.detachEvent);
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
    return (
      <Component
        {...this.props}
        ref={ref => this.root = ref}
        boxIsOpen={this.state.boxIsOpen}
        openBox={this.openBox}
        closeBox={this.closeBox}
      />
    );
  }
};

export default WithBox;
