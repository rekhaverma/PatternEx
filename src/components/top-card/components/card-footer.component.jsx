import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';

const CardFooter = (props) => {
  if (props.type === 'details') {
    return (
      <Link className={props.className} to={props.nextUrl}>
        <span className="icon-chevron-right" />
        <span>{props.element}</span>
      </Link>
    );
  }

  return (
    <div className={props.className}>
      <span>{props.element}</span>
      <div className="topCard__icons">
        <span className="icon-chevron-up" />
        <span className="icon-chevron-down" />
      </div>
    </div>
  );
};
CardFooter.propTypes = {
  'className': PropTypes.string.isRequired,
  'type': PropTypes.string,
  'element': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  'nextUrl': PropTypes.string,
};
CardFooter.defaultProps = {
  'type': '',
  'nextUrl': '/dashboard',
};

export default CardFooter;
