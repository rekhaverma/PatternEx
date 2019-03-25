import { pipelineTypes, dataMode } from 'config';
import moment from 'moment';
import toMomentTime from './moment-time';

/**
 *    Built the parameters of page, either their values
 * or default values.
 *
 * @param {Object}  props       Current props
 * @param {Object}  defaults    Default values of params
 * @return {Object}
 */

const DEFAULT = {
  'mode': dataMode[0].id,
  'model_type': pipelineTypes[0].id,
  'timestamp': moment.utc().startOf('d').format('X'),
};

const convertType = function (value) {
  if (typeof value === 'string' && value === 'undefined') {
    return undefined;
  }
  return value;
};
export default (props, isResultSummary) => {
  const { location } = props;
  // timestamp is startTime (UTC) , get endTime from startTime using mode
  const momentStartTime = toMomentTime(location.query.timestamp || DEFAULT.timestamp);
  const mode = location.query.mode;

  // days for batch, set to 60 days ,
  // Used to get enable dates of months and also last 7 days summary to draw graphs
  let summaryUnit = 'days';
  let summaryValue = 60;

  if (mode === 'realtime') {
    summaryUnit = 'hours';
    summaryValue = 24;
  }

  const momentStartTimeClone = moment(momentStartTime);
  const momentEndTime = mode === 'batch' ? moment(momentStartTime).endOf('month') : moment(momentStartTime).add(2, 'hours');
  const momentEndTimeClone = moment(momentEndTime);

  if (isResultSummary) {
    return {
      'mode': location.query.mode || DEFAULT.mode,
      'pipeline': convertType(location.query.pipeline),
      'model_type': location.query.model_type || DEFAULT.model_type,
      'start_time': momentEndTimeClone.subtract(summaryValue, summaryUnit).format('X'),
      'end_time': momentEndTime.format('X'),
    };
  }

  if (mode === 'realtime') {
    return {
      'mode': location.query.mode || DEFAULT.mode,
      'pipeline': convertType(location.query.pipeline),
      'model_type': location.query.model_type || DEFAULT.model_type,
      'start_time': momentStartTime.format('X'),
      'end_time': momentStartTimeClone.add(2, 'hours').format('X'),
    };
  }
  return {
    'mode': location.query.mode || DEFAULT.mode,
    'pipeline': convertType(location.query.pipeline),
    'model_type': location.query.model_type || DEFAULT.model_type,
    'start_time': momentStartTime.startOf('d').format('X'),
    'end_time': momentStartTimeClone.endOf('d').format('X'),
  };
};
