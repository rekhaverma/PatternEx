import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { pick } from 'lodash';
import { createURL } from 'lib';

const LinkItem = props => (
  <div>
    { props.hasPrivileges &&
      <Link
        className={props.className}
        activeClassName={`${props.className} +active`}
        style={props.style}
        to={createURL(props.location, pick(props.query, props.params))}
      >
        { props.icon && <span className={`${props.className}__icon ${props.icon}`} /> }
        {
          props.label && (
            <p className={`${props.className}__label`}>{props.label}</p>
          )
        }
      </Link>
    }
  </div>
);
LinkItem.propTypes = {
  'className': PropTypes.string.isRequired,
  'icon': PropTypes.string,
  'label': PropTypes.string,
  'location': PropTypes.string.isRequired,
  'style': PropTypes.object,
  'query': PropTypes.object,
  'params': PropTypes.array,
  'hasPrivileges': PropTypes.bool,
};
LinkItem.defaultProps = {
  'icon': '',
  'label': '',
  'style': {},
  'query': {},
  'params': [],
  'hasPrivileges': false,
};

export default LinkItem;
