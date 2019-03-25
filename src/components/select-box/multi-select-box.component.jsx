import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import { isEqual } from 'lodash';
import { arrayToObject, removeFromArray } from 'lib';

import withBox from '../withBox';
import OptionList from './components/option-list.component';

import './select-box.style.scss';

class MultiSelectBox extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      'activeOption': [],
    };

    this.onSelect = this.onSelect.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    /**
   *  If options has changed, the selected options should be removed
   */
    if (!isEqual(nextProps.options, this.props.options)) {
      this.setState({
        'activeOption': [],
      });
    }
    /**
   *  If array activeOption has changed (ex: options selected has been reset to initial),
   *  active option should change to initial state, the empty array
   */
    if (!isEqual(nextProps.activeOption, this.state.activeOption)) {
      if (Array.isArray(nextProps.activeOption)) {
        this.setState({
          'activeOption': nextProps.activeOption,
        });
      }
    }
  }

  /**
   *    Get the data-id attr from the target or it's parent and update
   * the state accordingly (if the element is present in state,
   * remove it otherwise add it) and also close the box if the
   * <MultiSelectBox /> is single option and pass the currentId, state and
   * event to the parent component handler.
   *
   * @param {Object} e    Event object
   */
  onSelect(e) {
    const { activeOption } = this.state;
    const currentId = e.target.getAttribute('data-id') !== null
      ? e.target.getAttribute('data-id')
      : e.target.parentNode.getAttribute('data-id');

    const indexOfCurrentId = activeOption.indexOf(currentId);
    this.setState({
      'activeOption': indexOfCurrentId >= 0
        ? removeFromArray(activeOption, currentId)
        : [...activeOption, currentId],
    }, () => {
      this.props.onClick(currentId, this.state.activeOption, e);
    });
  }

  render() {
    const {
      boxIsOpen,
      className,
      customClassName,
      hasScrollbar,
      options,
      openBox,
      placeholder,
      singleSelect,
      style,
      autocomplete,
    } = this.props;
    const { activeOption } = this.state;

    const selectedOption = singleSelect
      ? activeOption[0] || ''
      : activeOption.map(key => arrayToObject(options, 'id')[key].content).toString();

    return (
      <div className={`${className} ${customClassName}`} style={style}>
        {activeOption.length === 0 ? (
          <div className={boxIsOpen ? `${className}__box +open` : `${className}__box`} onClick={openBox} style={style}>
            <span>
              {activeOption.length > 0 ? selectedOption : placeholder}
            </span>
          </div>
        ) : (
          <div className={`${className}__container`}>
            <div className={boxIsOpen ? `${className}__box +open` : `${className}__box`} onClick={openBox} style={style}>
              <span>
                {activeOption.length > 0 ? selectedOption : placeholder}
              </span>
            </div>
            {!boxIsOpen && activeOption.length && (
              <div className={`${className}__hover`}>
                <Scrollbars
                  autoHeight
                  hideTracksWhenNotNeeded
                  autoHeightMax={200}
                  renderTrackVertical={subProps => <div {...subProps} className="track-vertical" />}
                  renderThumbVertical={subProps => <div {...subProps} className="thumb-vertical" />}
                >
                  <div className={`${className}__hover-container`}>
                    {
                      activeOption.map(key => arrayToObject(options, 'id')[key].content).map((item, key) => (
                        <span key={key}>{item}</span>
                      ))
                    }
                  </div>
                </Scrollbars>
              </div>
            )}
          </div>
        )}
        {
          options.length > 0 && boxIsOpen && (
            <OptionList
              autocomplete={autocomplete}
              activeOption={activeOption}
              scrollbar={hasScrollbar}
              options={options}
              singleSelect={this.props.singleSelect}
              onClick={this.onSelect}
            />
          )
        }
      </div>
    );
  }
}
MultiSelectBox.displayName = 'MultiSelectBox';
MultiSelectBox.propTypes = {
  'activeOption': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  'boxIsOpen': PropTypes.bool.isRequired,
  'className': PropTypes.string,
  'customClassName': PropTypes.string,
  'hasScrollbar': PropTypes.bool,
  'options': PropTypes.arrayOf(PropTypes.shape({
    'id': PropTypes.string.isRequired,
    'label': PropTypes.string,
    'content': PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
  })),
  'singleSelect': PropTypes.bool,
  'style': PropTypes.object,
  'onClick': PropTypes.func,
  'openBox': PropTypes.func.isRequired,
  'placeholder': PropTypes.string,
  'autocomplete': PropTypes.bool,
};
MultiSelectBox.defaultProps = {
  'activeOption': '',
  'className': 'selectBox',
  'customClassName': '',
  'hasScrollbar': false,
  'options': [],
  'singleSelect': false,
  'style': {},
  'onClick': () => null,
  'placeholder': 'Placeholder',
  'autocomplete': false,
};

export default withBox(MultiSelectBox);
