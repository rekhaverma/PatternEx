import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { noAncestry } from 'lib';
import { uniq } from 'lodash';

import { Input } from 'components/forms';
import LabelList from './components/label-list-component';
import OptionsList from './components/options-list.component';

import './combo-box.style.scss';

class ComboBox extends PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'boxIsOpen': false,
      'inputValue': '',
      'filteredOptions': [],
    };

    // refs
    this.root = null;

    // methods
    this.onInputChange = this.onInputChange.bind(this);
    this.removeLabel = this.removeLabel.bind(this);
    this.addLabel = this.addLabel.bind(this);
    this.openBox = this.openBox.bind(this);
    this.closeBox = this.closeBox.bind(this);
    this.autoclose = this.autoclose.bind(this);
  }

  /**
   * Set the default state of activeOption and filteredOptions
   */
  componentDidMount() {
    const { options } = this.props;
    this.setState({
      // Initially, filteredOptions will be the same as options (because
      // we do not have a value in input)
      'filteredOptions': options,
    });
  }

  onInputChange(e) {
    let { filteredOptions } = this.state;
    if (e.target.value !== '') {
      filteredOptions = filteredOptions.filter(el => (
        el.toLowerCase().includes(e.target.value.toLowerCase())
      ));
    } else {
      filteredOptions = this.props.options;
    }

    this.setState({
      'inputValue': e.target.value,
      'filteredOptions': filteredOptions,
    });
  }

  removeLabel(label) {
    const { activeOption, setOption } = this.props;
    setOption(activeOption.filter(el => el !== label));
  }

  addLabel(label) {
    const { activeOption, setOption } = this.props;
    const toBeUniq = activeOption.concat([label.toLowerCase()]);
    setOption(uniq(toBeUniq));
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
    const {
      className,
      placeholder,
      style,
      activeOption,
      options,
    } = this.props;
    const { inputValue, boxIsOpen } = this.state;

    return (
      <div
        className={className}
        ref={ref => this.root = ref}
        style={style}
      >
        <div
          className={boxIsOpen ? `${className}__box +open` : `${className}__box`}
          onClick={this.openBox}
        >
          {
            activeOption.length > 0 && (
              <LabelList
                labels={options}
                onCancel={this.removeLabel}
              />
            )
          }
          <Input
            className={`${className}__input`}
            placeholder={placeholder}
            value={inputValue}
            onChange={this.onInputChange}
          />
        </div>
        {
          boxIsOpen && (
            <OptionsList
              options={this.state.filteredOptions}
              onClick={this.addLabel}
            />
          )
        }
      </div>
    );
  }
}

ComboBox.displayName = 'ComboBox';
ComboBox.propTypes = {
  'activeOption': PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
  ]),
  'className': PropTypes.string,
  'options': PropTypes.array,
  'placeholder': PropTypes.string,
  'style': PropTypes.object,
  'setOption': PropTypes.func,
};
ComboBox.defaultProps = {
  'activeOption': [],
  'className': 'comboBox',
  'options': [],
  'placeholder': 'Search option',
  'style': { 'maxWidth': 300 },
  'setOption': () => null,
};

export default ComboBox;
