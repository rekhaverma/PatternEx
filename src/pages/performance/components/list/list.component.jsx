import React from 'react';
import PropTypes from 'prop-types';

import ListItem from './components/list-item';
import './list.style.scss';

const headerRow = config => (
  <li className="list__item list__item--header">
    {
      config.map((item, i) => (
        <p key={`headerLabel${i}`} className={item.size}>{item.label}</p>
      ))
    }
  </li>
);

const List = (props) => {
  const config = [
    {
      'id': 'name',
      'label': 'Type of entity',
      'size': 'large',
    },
    {
      'id': 'accuracy',
      'label': `Precision (as of ${props.mostRecentDate})`,
      'size': 'medium',
    },
    {
      'id': 'labels',
      'label': 'Number of labels',
      'size': 'large',
    },
  ];

  return (
    <ul className="list">
      {
        headerRow(config)
      }
      {
        Object.keys(props.rowsData).map((item, i) => (
          <ListItem
            key={`listItem${i}`}
            data={props.rowsData[item]}
            config={config}
            rowLabel={item}
          />
        ))
      }
    </ul>
  );
};

List.propTypes = {
  'rowsData': PropTypes.object.isRequired,
  'mostRecentDate': PropTypes.string.isRequired,
};

export default List;
