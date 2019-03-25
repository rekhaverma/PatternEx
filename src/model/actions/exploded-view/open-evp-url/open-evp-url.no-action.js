import moment from 'moment';
import { dateFormats } from 'config';
import { createURL } from 'lib';
import { findEntityName, getEntityTypeByPipeline } from 'lib/decorators/';

export const getEvpUrlHandler = (row, behaviorType = '') => {
  const params = {
    start_time: moment.utc(row.start_time).format(dateFormats.mmddyyDash),
    end_time: moment.utc(row.end_time).format(dateFormats.mmddyyDash),
    entity_name: row.entity_name,
    pipeline: row.pipeline,
    mode: row.modeType,
    model_name: row.model_name,
  };

  if (row.start && row.end_time) {
    params.start_time = moment.utc(row.start_time).startOf('day').format(dateFormats.mmddyyDash);
    params.end_time = moment.utc(row.end_time).endOf('day').format(dateFormats.mmddyyDash);
  } else if (row.timestamp) {
    params.start_time = moment.utc(+row.timestamp * 1000).startOf('day').format(dateFormats.mmddyyDash);
    params.end_time = moment.utc(+row.timestamp * 1000).endOf('day').format(dateFormats.mmddyyDash);
  } else if (row.ts) {
    params.start_time = moment.utc(row.ts).startOf('day').format(dateFormats.mmddyyDash);
    params.end_time = moment.utc(row.ts).endOf('day').format(dateFormats.mmddyyDash);
  }

  if (row.start_time_moment && row.end_time_moment) {
    params.start_time = row.start_time_moment.format(dateFormats.mmddyyDash);
    params.end_time = row.end_time_moment.format(dateFormats.mmddyyDash);
  }

  if (row.id) {
    params.entity_id = row.id;
  }

  if (behaviorType) {
    params.behaviorType = behaviorType;

    if (behaviorType === 'suspicious') {
      params.method_name = row.method_name;
    }

    if (behaviorType === 'pipeline') {
      params.entity_name = findEntityName(params.pipeline, row) || params.entity_name;
      params.entity_type = getEntityTypeByPipeline(params.pipeline);
      params.mode = row.mode;
      params.model_name = row.selectedModel;
      params.model_type = row.model_type;
      params.origin = 'pipeline';

      if (row.pipeline === 'sipdip' || row.pipeline === 'sipdomain' || row.pipeline === 'request') {
        params.entity_name = params.entity_name.replace(' ', '+');
      }
    }
  }

  return createURL('/exploded-view', params);
};
