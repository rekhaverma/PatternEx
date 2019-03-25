import React from 'react';
import PropTypes from 'prop-types';
import { mapIcons } from 'lib';

import { FormattedHTMLMessage } from 'react-intl';

const ListItemContent = (data, config, id) => {
  let content = (
    <p
      key={`headerLabel${id}`}
      className={`${config.id} ${config.size}`}
    >
      <span>{data}</span>
    </p>
  );

  if (typeof data === 'object') {
    content = (
      <p
        key={`headerLabel${id}`}
        className={`${config.id} ${config.size}`}
      >
        <FormattedHTMLMessage
          id="performance.label.count"
          values={{ 'count': data.total }}
        />
        <span> | </span>
        <FormattedHTMLMessage
          id="performance.label.types"
          values={{ 'count': data.types }}
        />
      </p>
    );
  }

  if (typeof data === 'number') {
    content = (
      <p
        key={`headerLabel${id}`}
        className={`${config.id} ${config.size}`}
      >
        <span>{`${data.toFixed(2)}`}</span>
      </p>
    );
  }

  return content;
};

const ListItem = props => (
  <li className="list__item">
    <span className={`list__item__icon ${mapIcons(props.rowLabel)}`} />
    {
      Object.keys(props.data).map((item, i) => (
        ListItemContent(props.data[item], props.config[i], i)))
    }
  </li>
);

ListItem.displayName = 'ListItem';

ListItem.propTypes = {
  'data': PropTypes.object.isRequired,
  'config': PropTypes.array.isRequired,
  'rowLabel': PropTypes.string.isRequired,
};

ListItem.defaultProps = {
  'data': {},
  'config': [],
};

export default ListItem;
