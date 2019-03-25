import React from 'react';
import PropTypes from 'prop-types';

import { FormattedHTMLMessage } from 'react-intl';

const MetaList = props => (
  <div className={`${props.className}__list`}>
    {
      // Loop thru metas object and display the count
      Object.keys(props.metas).map(key => (
        <span key={key} className={`${props.className}__item`}>
          <FormattedHTMLMessage
            defaultMessage={`<span style="color: white">{count}</span> ${key}`}
            id={`cluster.metas.${key}`}
            values={{
              'count': parseInt(props.metas[key], 10) || 0,
            }}
          />
        </span>
      ))
    }
  </div>
);
MetaList.propTypes = {
  'className': PropTypes.string.isRequired,
  'metas': PropTypes.object.isRequired,
};

export default MetaList;
