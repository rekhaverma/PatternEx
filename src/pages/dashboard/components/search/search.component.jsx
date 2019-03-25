import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import { Input } from 'components/forms';
import './search.style.scss';

const Search = props => (
  <div className={`search ${props.customClassName}`} style={props.style}>
    <Input
      className="search__input"
      {...omit(props, ['customClassName', 'style'])}
    />
    <span className="icon-search search__icon-search" />
  </div>
);
Search.displayName = 'Search';
Search.propTypes = {
  'customClassName': PropTypes.string,
  'style': PropTypes.object,
};
Search.defaultProps = {
  'customClassName': '',
  'style': {},
};

export default Search;
