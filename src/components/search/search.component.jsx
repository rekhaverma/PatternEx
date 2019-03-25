import React from 'react';
import PropTypes from 'prop-types';

import { Input } from 'components/forms';
import Tag from './components/tag.component';

import './search.style.scss';

const Search = props => (
  <div className={props.className} style={props.style}>
    { props.tag && <Tag type={props.tag} onClick={props.resetTags} /> }
    <Input className={`${props.className}__input`} {...props.inputProps} />
    <span className={`icon-search ${props.className}__icon`} />
  </div>
);
Search.displayName = 'Search';
Search.propTypes = {
  'className': PropTypes.string,
  'inputProps': PropTypes.object,
  'style': PropTypes.object,
  'tag': PropTypes.string,
  'resetTags': PropTypes.func,
};
Search.defaultProps = {
  'className': 'search',
  'inputProps': {},
  'style': {},
  'tag': null,
  'resetTags': () => null,
};

export default Search;
