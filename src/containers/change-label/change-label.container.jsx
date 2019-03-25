import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import findEntityName from 'lib/decorators/find-entity-name';
import Tags from 'model/classes/tags.class';
import ChangeModal from 'components/change-label-modal';

import tagsSelector from './change-label.selectors';

export class ChangeLabel extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      'selectedLabel': '',
      'weight': '1',
      'description': '',
    };

    this.updateStateValue = this.updateStateValue.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    const { tags, predictionRow } = this.props;
    if (predictionRow) {
      const tagsInstance = new Tags(tags);
      const tag = tagsInstance.getTagById(predictionRow.tag_id);
      if (tag.label !== '') {
        this.setState({
          'selectedLabel': tag.label,
        });
      }
    }
  }

  updateStateValue(key, value) {
    this.setState({
      [key]: value,
    });
  }

  handleSave() {
    const { tags } = this.props;
    const { selectedLabel } = this.state;
    let tag = Object.keys(tags).reduce((acc, key) => {
      const el = tags[key];
      if (el.label.toLowerCase() === selectedLabel.toLowerCase()) {
        return acc.concat([el]);
      }
      return acc;
    }, []);


    if (tag.length > 0) {
      tag = tag.length > 0 ? tag[0].id : '';
    }
    // todo: load entity name helper and replace srcip with result from helper

    this.props.onSave({
      ...this.props.predictionRow,
      'tag_id': tag,
      'weight': this.state.weight !== '' ? parseInt(this.state.weight, 10) : 1,
      'description': this.state.description,
      'entity_name': (this.props.predictionRow && this.props.predictionRow.entity_name) || findEntityName(this.props.predictionRow.pipeline, this.props.predictionRow),
    });
    this.props.onCancel();
  }

  render() {
    return (
      <ChangeModal
        description={this.state.description}
        selectedLabel={this.state.selectedLabel}
        tags={this.props.tags}
        title={this.props.title}
        weight={this.state.weight}
        onItemClick={obj => this.updateStateValue('selectedLabel', obj.label)}
        onWeightChange={e => this.updateStateValue('weight', e.target.value)}
        onDescriptionChange={e => this.updateStateValue('description', e.target.value)}
        onSave={this.handleSave}
        onCancel={this.props.onCancel}
      />
    );
  }
}
ChangeLabel.propTypes = {
  'predictionRow': PropTypes.object.isRequired,
  'tags': PropTypes.array.isRequired,
  'onCancel': PropTypes.func.isRequired,
  'onSave': PropTypes.func.isRequired,
  'title': PropTypes.object,
};
ChangeLabel.defaultProps = {
  'title': {},
};

export const mapStateToProps = state => ({
  'tags': tagsSelector(state),
});

export default connect(mapStateToProps, null)(ChangeLabel);
