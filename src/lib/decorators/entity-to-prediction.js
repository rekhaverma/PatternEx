import moment from 'moment';

export default (entity, isSolved, tags) => {
  const output = {
    'entity_name': entity.entity_name,
    'entity_type': entity.entity_type,
    'tags': entity.is_central_entity
      ? [entity.entity_type, 'main']
      : [entity.entity_type],
  };

  if (isSolved) {
    return output;
  }
  const tag = tags.getTagById(entity.tag_id);

  return {
    ...output,
    'timestamp': moment(entity.behavior_ts).format('MM/DD/YY HH:mma'),
    'predictions': entity.tag_id !== null ? [tag.name] : [],
    'behavior': entity.behavior.toLowerCase(),
    'pipeline': entity.pipeline,
    'first_ts': entity.first_ts,
    'last_ts': entity.last_ts,
  };
};
