import React from 'react';
import PropTypes from 'prop-types';

import { Scrollbars } from 'react-custom-scrollbars';

import WithBox from '../withBox';

const ArrayList = props => (
  <div className={`${props.className}__list`}>
    <Scrollbars
      autoHeight
      autoHeightMax={200}
    >
      {
        props.options.map(el => (
          <div
            className={`${props.className}__item`}
            key={el.id}
            onClick={() => props.onItemClick(el)}
          >
            <span>{el.label}</span>
          </div>
        ))
      }
    </Scrollbars>
  </div>
);
ArrayList.propTypes = {
  'className': PropTypes.string.isRequired,
  'options': PropTypes.array.isRequired,
};

ArrayList.defaultProps = {
  onItemClick: () => null,
};

const ObjectList = props => (
  <Scrollbars
    autoHeight
    autoHeightMax={200}
  >
    <div className={`${props.className}__list`}>
      {
        Object.keys(props.options).map(key => (
          <div
            className={`${props.className}__item`}
            key={key}
            onClick={() => props.onItemClick({ [key]: props.options[key] })}
          >
            <span>{props.options[key]}</span>
          </div>
        ))
      }
    </div>
  </Scrollbars>
);
ObjectList.propTypes = {
  'className': PropTypes.string.isRequired,
  'options': PropTypes.object.isRequired,
};

ObjectList.defaultProps = {
  onItemClick: () => null,
};

const Select = props => (
  <div className={props.className}>
    {
      props.showLabel && (
        <span className={`${props.className}__floatingLabel`}>
          {props.placeholder}
        </span>
      )
    }
    <div
      className={`${props.className}__label`}
      onClick={props.openBox}
    >
      {props.active !== '' ? props.active : props.placeholder }
    </div>
    {
      props.boxIsOpen && (
        Array.isArray(props.options) ? (
          ArrayList(props)
        ) : (
          ObjectList(props)
        )
      )
    }
  </div>
);
Select.propTypes = {
  'className': PropTypes.string,
  'active': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  'showLabel': PropTypes.bool,
  'placeholder': PropTypes.string,
  'options': PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  'boxIsOpen': PropTypes.bool.isRequired,
  'openBox': PropTypes.func.isRequired,
};
Select.defaultProps = {
  'className': 'select',
  'active': '',
  'showLabel': false,
  'placeholder': 'Open to select',
  'options': [],
};

export default WithBox(Select);
