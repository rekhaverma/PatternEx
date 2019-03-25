import React from 'react';
import PropTypes from 'prop-types';

import CardIcon from './components/card-icon.component';
import CardFooter from './components/card-footer.component';

import './top-card.style.scss';

import * as types from './constants';

const TopCard = props => (
  <div className={`${props.className} ${props.disabled ? '+disabled' : `+${props.icon}`}`}>
    <CardIcon
      className={props.className}
      type={`icon-${props.icon}`}
      state={props.state}
    />
    <div className={`${props.className}__meta`}>
      <span className={`${props.className}__topText`}>{props.topText}</span>
      <span className={`${props.className}__mainText`}>{props.mainText}</span>
      {props.footer &&
        <CardFooter
          className={`${props.className}__footer`}
          type={props.footerType}
          element={props.footer}
          nextUrl={props.nextUrl}
        />
      }
    </div>
  </div>
);
TopCard.propTypes = {
  'className': PropTypes.string,
  'disabled': PropTypes.bool,
  'icon': PropTypes.string,
  'footer': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  'footerType': PropTypes.string,
  'mainText': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  'state': PropTypes.string,
  'topText': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  'nextUrl': PropTypes.string,
};
TopCard.defaultProps = {
  'className': 'topCard',
  'disabled': false,
  'footer': '',
  'footerType': '',
  'icon': types.REPORT,
  'mainText': '',
  'state': '',
  'topText': '',
  'nextUrl': '',
};

export default TopCard;
