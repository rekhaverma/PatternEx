import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Input } from 'components/forms';
import withBox from '../withBox';
import OptionList from './components/option-list.component';


import './select-box.style.scss';

class SingleSelectBox extends PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'activeOption': '',
      'searchText': '',
    };

    this.onSelect = this.onSelect.bind(this);
    this.updateSearchText = this.updateSearchText.bind(this);
  }

  componentDidMount() {
    if (this.props.activeOption) {
      this.setState({
        'activeOption': this.props.activeOption,
      }, () => {
        this.props.onClick(this.state.activeOption, true);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeOption !== '') {
      if (nextProps.activeOption !== this.state.activeOption) {
        this.setState({
          'activeOption': nextProps.activeOption,
        });
      }
    } else if (nextProps.options.length > 0) {
      this.setState({
        'activeOption': nextProps.options[0].id,
      }, () => {
        this.props.onClick(this.state.activeOption);
      });
    }
  }

  onSelect(e) {
    const currentId = e.target.getAttribute('data-id') !== null
      ? e.target.getAttribute('data-id')
      : e.target.parentNode.getAttribute('data-id');
    this.setState({
      'activeOption': currentId,
    }, () => {
      this.props.closeBox();
      this.props.onClick(currentId);
    });
  }

  updateSearchText(text) {
    this.setState({
      'activeOption': '',
      'searchText': text,
    });
  }

  render() {
    const {
      boxIsOpen,
      className,
      closeBox,
      customClassName,
      options,
      openBox,
      placeholder,
      scrollbar,
      style,
      showLabel,
      allowSearch,
    } = this.props;
    const { activeOption, searchText } = this.state;
    const currentOptionIndex = options.findIndex(el => el.id === activeOption);
    let filteredOptions = options;

    if (allowSearch) {
      filteredOptions = options.filter(option => option.content &&
        option.content.indexOf(searchText) > -1);
    }

    return (
      <div className={`${className} ${customClassName}`}>
        <div className={boxIsOpen ? `${className}__box +open` : `${className}__box`} onClick={boxIsOpen ? closeBox : openBox}>
          {
            showLabel && (
              <span className={currentOptionIndex >= 0 ? `${className}__floatingLabel` : `${className}__hide`}>
                {placeholder}
              </span>
            )
          }
          {
            allowSearch ? (
              <Input
                className="inputSearch"
                placeholder="Select feature"
                value={currentOptionIndex >= 0 ? options[currentOptionIndex].content : searchText}
                onChange={event => this.updateSearchText(event.target.value)}
              />
            ) : (
              <span>
                {currentOptionIndex >= 0 ? options[currentOptionIndex].content : placeholder }
              </span>
            )
          }
        </div>
        {
          boxIsOpen && (
            <OptionList
              activeOption={activeOption}
              options={filteredOptions}
              singleSelect={this.props.singleSelect}
              onClick={this.onSelect}
              scrollbar={scrollbar}
              style={style}
            />
          )
        }
      </div>
    );
  }
}
SingleSelectBox.displayName = 'SingleSelectBox';
SingleSelectBox.propTypes = {
  'activeOption': PropTypes.string,
  'boxIsOpen': PropTypes.bool.isRequired,
  'className': PropTypes.string,
  'customClassName': PropTypes.string,
  'options': PropTypes.arrayOf(PropTypes.shape({
    'id': PropTypes.string.isRequired,
    'content': PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
  })),
  'singleSelect': PropTypes.bool,
  'onClick': PropTypes.func,
  'openBox': PropTypes.func.isRequired,
  'closeBox': PropTypes.func.isRequired,
  'placeholder': PropTypes.string,
  'scrollbar': PropTypes.bool,
  'style': PropTypes.object,
  'showLabel': PropTypes.bool,
  'allowSearch': PropTypes.bool,
};
SingleSelectBox.defaultProps = {
  'activeOption': '',
  'className': 'selectBox',
  'customClassName': '',
  'options': [],
  'singleSelect': false,
  'onClick': () => null,
  'placeholder': 'Placeholder',
  'scrollbar': false,
  'style': {},
  'showLabel': false,
  'allowSearch': false,
};

export default withBox(SingleSelectBox);
