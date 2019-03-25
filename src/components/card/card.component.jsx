import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import { COUNT, TIMESTAMP, MORE } from './constants';

import CardFooter from './components/card-footer.component';
import CardHeader from './components/card-header.component';

import './card.style.scss';

const Card = props => (
  <div className={props.fullWidth ? 'card +fullWidth' : 'card'}>
    <div className="card__container">
      <CardHeader {...omit(props, ['footer'])} />
      <div className="card__content">
        {props.children}
      </div>
      { props.footer && <CardFooter content={props.footer} /> }
    </div>
  </div>
);
Card.displayName = 'Card';
Card.propTypes = {
  'children': PropTypes.any.isRequired,
  'count': PropTypes.oneOf([COUNT, TIMESTAMP, MORE]),
  'countValue': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  'footer': PropTypes.element,
  'fullWidth': PropTypes.bool,
  'hasHelp': PropTypes.bool,
  'title': PropTypes.string,
  'onHelpClick': PropTypes.func,
  'onMoreClick': PropTypes.func,
};
Card.defaultProps = {
  'count': COUNT,
  'countValue': 0,
  'footer': null,
  'fullWidth': false,
  'hasHelp': false,
  'title': 'Untitled',
  'onHelpClick': () => null,
  'onMoreClick': () => null,
};

export default Card;

