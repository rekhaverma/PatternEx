import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { noAncestry } from 'lib';
import { uniq } from 'lodash';

import OptionList from './components/option-list.component';

import './multiple-select-box.style.scss';

class MultipleSelectBox extends PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'boxIsOpen': false,
      'activeOption': [],
    };

    // refs
    this.root = null;

    // methods
    this.onSelect = this.onSelect.bind(this);
    this.openBox = this.openBox.bind(this);
    this.closeBox = this.closeBox.bind(this);
    this.autoclose = this.autoclose.bind(this);
  }

  componentDidMount() {
    if (this.props.activeOption) {
      this.setState({
        'activeOption': this.props.activeOption,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeOption.length > 0) {
      this.setState({
        'activeOption': nextProps.activeOption,
      });
    } else if (nextProps.options.length > 0) {
      this.setState({
        'activeOption': [nextProps.options.cluster_id],
      }, () => {
        this.props.setFilter(this.state.activeOption);
      });
    }
  }

  onSelect(option) {
    const { activeOption } = this.state;
    const nextActive = uniq([...activeOption, option]);
    this.setState({
      'activeOption': nextActive,
    }, () => {
      this.props.setFilter(nextActive);
    });
  }

  openBox() {
    this.setState({
      'boxIsOpen': true,
    }, this.attachEvent);
  }

  closeBox() {
    this.setState({
      'boxIsOpen': false,
    }, this.detachEvent);
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
    if (this.props.options.length === 0) {
      return (
        <div className="multipleSelectBox">
          <div className="multipleSelectBox__box">
            <span>Fetching data...</span>
          </div>
        </div>
      );
    }
    const activeOption = this.props.placeholder;
    if (this.props.options.length === 1
      && this.state) {
      return (
        <div className="multipleSelectBox">
          <div className="multipleSelectBox__box">
            <span>{activeOption}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="multipleSelectBox" ref={ref => this.root = ref}>
        <div className={this.state.boxIsOpen ? 'multipleSelectBox__box +open' : 'multipleSelectBox__box'} onClick={this.openBox}>
          <span>{activeOption}</span>
        </div>
        {
          this.state.boxIsOpen && (
            <OptionList
              activeOption={this.state.activeOption}
              options={this.props.options}
              onClick={this.onSelect}
            />
          )
        }
      </div>
    );
  }
}
MultipleSelectBox.displayName = 'MultipleSelectBox';
MultipleSelectBox.propTypes = {
  'placeholder': PropTypes.string,
  'activeOption': PropTypes.array,
  'options': PropTypes.array,
  'setFilter': PropTypes.func,
};
MultipleSelectBox.defaultProps = {
  'placeholder': '',
  'activeOption': [],
  'options': [],
  'setFilter': () => null,
};

export default MultipleSelectBox;
