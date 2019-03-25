import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { isPlainObject } from 'lodash';

import { Scrollbars } from 'react-custom-scrollbars';
import { FormattedMessage } from 'react-intl';
import LoaderBar from 'components/loader/loader-bar.component';
import Modal from 'components/modal';
import { CheckBox } from 'components/forms';
import ModalList from '../modalList';

import './section.style.scss';

const scrollBarProps = {
  'autoHeight': true,
  'autoHeightMin': 0,
  'autoHeightMax': 500,
  'renderThumbVertical': props => <div {...props} className="thumb-vertical" />,
};

const scrollBarPropsFeaturePlot = {
  'autoHeight': true,
  'autoHeightMin': 0,
  'autoHeightMax': 200,
  'renderThumbVertical': props => <div {...props} className="thumb-vertical" />,
};

class Section extends Component {
  constructor(args) {
    super(args);

    this.expandSection = this.expandSection.bind(this);
  }

  expandSection(open = true) {
    if (!open) {
      return this.props.onModalOpen('');
    }
    const { children } = this.props;
    return this.props.onModalOpen((
      <Modal style={this.props.modalStyle}>
        <ModalList
          onClose={() => this.expandSection(false)}
          title={typeof this.props.title === 'string' ? this.props.title : ''}
        >
          <Scrollbars {...scrollBarProps}>
            {isPlainObject(this.props.expandableView) ? this.props.expandableView : children}
          </Scrollbars>
        </ModalList>
      </Modal>
    ));
  }

  render() {
    const { dropDownOptions, dropDownState,
      selectedDropDown, onDropDownSelection, title } = this.props;

    let titleElement;

    if (title) {
      titleElement = title === 'Entity vs. Population' ? (
        <span
          className="section__title"
        >
          {`${this.props.title} (${selectedDropDown.length} of ${dropDownOptions.length})`}
          <span
            className="icon-information"
          >
            <span className="feature-plot-tooltip">
              <FormattedMessage
                id="evp.featureplotnote"
              />
            </span>
          </span>
        </span>)
        : <span className="section__title">{this.props.title}</span>;
    }

    return (
      <div
        className={`section section--${this.props.size} +${this.props.className}`}
      >
        <div className="section__header">
          {titleElement}
          {this.props.title && this.props.isDraggable && <span className="icon-drag" />}
          {this.props.expandable &&
            <span
              className="section__expand icon-expand-square"
              onClick={this.expandSection}
            />
          }
          {this.props.dropdown &&
            <span
              className={`section__dropdown icon-gear ${this.props.dropDownState ? 'active' : ''}`}
              onClick={this.props.onDropDownClick}
            />
          }
          {
            dropDownState &&
            <div className="section__dropdownmenu">
              <div className="searchbox">
                <span
                  className="icon-search"
                />
                <input
                  type="text"
                  placeholder="Select feature to view behavior plot"
                  onChange={event => this.props.filterFeatureList(event)}
                />
              </div>
              <Scrollbars {...scrollBarPropsFeaturePlot}>
                {dropDownOptions.map(option => (
                  <CheckBox
                    key={option.id}
                    id={option.id}
                    onChange={event => onDropDownSelection(option, event.target.checked)}
                    onMouseOver={() => null}
                    onFocus={() => null}
                    checked={selectedDropDown.indexOf(option.id) > -1}
                    label={option.content}
                    value={option.id}
                  />))
                }
              </Scrollbars>
            </div>
          }
        </div>
        <div className="section__content">
          {this.props.loaded ?
            (
              <div className="section__children">
                {this.props.children}
              </div>
            )
            :
            (
              <LoaderBar />
            )
          }
        </div>
      </div>
    );
  }
}

Section.displayName = 'Section';
Section.propTypes = {
  'children': PropTypes.any,
  'size': PropTypes.string || PropTypes.array,
  'title': PropTypes.string,
  'className': PropTypes.string,
  'loaded': PropTypes.bool.isRequired,
  'expandable': PropTypes.bool,
  'expandableView': PropTypes.element,
  'modalStyle': PropTypes.object,
  'dropdown': PropTypes.bool,
  'dropDownState': PropTypes.bool,
  'onDropDownClick': PropTypes.func,
  'dropDownOptions': PropTypes.array,
  'selectedDropDown': PropTypes.array,
  'onDropDownSelection': PropTypes.func,
  'filterFeatureList': PropTypes.func,
  'isDraggable': PropTypes.bool,
  'onModalOpen': PropTypes.func,
};

Section.defaultProps = {
  'children': {},
  'size': 'small',
  'title': null,
  'className': '',
  'expandable': false,
  'expandableView': null,
  'modalStyle': {},
  'dropdown': false,
  'dropDownState': false,
  'onDropDownClick': () => null,
  'dropDownOptions': [],
  'selectedDropDown': [],
  'onDropDownSelection': () => null,
  'filterFeatureList': () => null,
  'isDraggable': true,
  'onModalOpen': () => null,
};

export default Section;
