import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import D3Chord from 'components/d3-chord';

import {
  getEntities,
  decorateFlowsData,
  isEntityType,
  getEntityType,
} from 'lib/chord';

export default class ChordContainer extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      'config': {
        'svgWidth': 720,
        'svgHeight': 600,
        'chordRadius': 200,
        'chordStroke': 20,
      },
    };

    this.setSelectedEntity = this.setSelectedEntity.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (!isEqual(this.props.selectedEntity, nextProps.selectedEntity)
      || !isEqual(this.props.relations, nextProps.relations)
      || !isEqual(this.props.entities, nextProps.entities)) {
      return true;
    }
    return false;
  }

  setSelectedEntity(entity) {
    const { entities, selectedEntity, setSelectedEntity } = this.props;

    if (isEntityType(entity)) {
      if (getEntityType(selectedEntity, entities) === entity) {
        setSelectedEntity(null);
      }
    } else {
      setSelectedEntity(entity);
    }
  }

  render() {
    const { entities, relations, selectedEntity } = this.props;
    const { config } = this.state;

    let groupedEntities = [];
    let decoratedRelations = [];

    if (entities.length > 0 && relations.length > 0
      && entities.find(entity => entity.entity_name && entity.entity_type) !== undefined) {
      groupedEntities = getEntities(entities);
      decoratedRelations = decorateFlowsData(relations, entities);
    }

    return (
      <D3Chord
        config={config}
        entities={groupedEntities}
        relations={decoratedRelations}
        selectedEntity={selectedEntity}
        setSelectedEntity={this.setSelectedEntity}
      />
    );
  }
}

ChordContainer.displayName = 'ChordContainer';
ChordContainer.propTypes = {
  'entities': PropTypes.array,
  'relations': PropTypes.array,
  'selectedEntity': PropTypes.string,
  'setSelectedEntity': PropTypes.func,
};
ChordContainer.defaultProps = {
  'entities': [],
  'relations': [],
  'selectedEntity': '',
  'setSelectedEntity': () => null,
};
