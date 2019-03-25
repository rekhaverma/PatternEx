import React from 'react';
import ReactDOM from 'react-dom';

import { noAncestry } from 'lib';

const WithBox = Component => class WithBoxHOC extends React.Component {
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

  componentWillUnmount() {
    this.detachEvent();
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
      <div ref={ref => this.root = ref}>
        <Component
          {...this.props}
          boxIsOpen={this.state.boxIsOpen}
          openBox={this.openBox}
          closeBox={this.closeBox}
        />
      </div>
    );
  }
};

export default WithBox;
