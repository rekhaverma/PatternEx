import React from 'react';
import PropTypes from 'prop-types';

import CardCounter from './card-counter.component';

import { COUNT, TIMESTAMP, MORE } from '../constants';

const CardHeader = (props) => {
  let cardHeader = null;

  if (props.count === COUNT) {
    cardHeader = <CardCounter value={props.countValue} />;
  } else if (props.count === TIMESTAMP) {
    cardHeader = <span className="card__header__timestamp">{props.countValue}</span>;
  }

  return (
    <div className="card__header">
      <span className="card__header__title">
        {props.title}
      </span>
      { cardHeader }
      { props.hasMore && (
        <div className="card__header__more" onClick={props.onMoreClick}>
          <span className={props.hasMoreValue ? 'icon-chevron-up' : 'icon-chevron-down'} />
          <span className="card__header__more__text">More</span>
        </div>
      )}
      { props.hasHelp && <span className="icon-question" onClick={props.onHelpClick} /> }
    </div>
  );
};
CardHeader.displayName = 'CardHeader';
CardHeader.propTypes = {
  'count': PropTypes.oneOf([COUNT, TIMESTAMP, MORE]),
  'countValue': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  'hasMore': PropTypes.bool,
  'hasMoreValue': PropTypes.bool,
  'hasHelp': PropTypes.bool,
  'title': PropTypes.string,
  'onHelpClick': PropTypes.func,
  'onMoreClick': PropTypes.func,
};
CardHeader.defaultProps = {
  'count': COUNT,
  'countValue': 0,
  'hasHelp': false,
  'title': 'Untitled',
  'hasMore': false,
  'hasMoreValue': false,
  'onHelpClick': () => null,
  'onMoreClick': () => null,
};

export default CardHeader;
