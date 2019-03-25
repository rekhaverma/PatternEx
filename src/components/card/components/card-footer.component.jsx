import React from 'react';
import PropTypes from 'prop-types';

const CardFooter = props => (
  <div className="card__footer">
    {props.content}
  </div>
);
CardFooter.displayName = 'CardFooter';
CardFooter.propTypes = {
  'content': PropTypes.any.isRequired,
};

export default CardFooter;
