import moment from 'moment';
import { getEntityTypeByPipeline, findEntityName } from 'lib/decorators';

export const handleOldExplodedView = (row, behaviorType = '') => {
  let endTime = moment.utc(row.end_time);
  let startTime = moment.utc(row.start_time);

  if (row.start_time_moment && row.end_time_moment) {
    startTime = row.start_time_moment;
    endTime = row.end_time_moment;
  }

  let bundle = {
    ...row,
    'start_time_moment': startTime,
    'end_time_moment': endTime,
    behaviorType,
  };
  if (behaviorType === 'pipeline') {
    bundle = {
      ...row,
      'entity_name': findEntityName(row.pipeline, row),
      'entity_type': getEntityTypeByPipeline(row.pipeline),
      'modeType': row.mode,
      'model_type': row.model_type,
      'featureAvailable': true,
      behaviorType,
    };
  }

  localStorage.setItem('rowData', JSON.stringify(bundle));
  window.location = window.location.origin;
};
