import { createSelector } from 'reselect';
import moment from 'moment';
import pipelineToName from 'lib/decorators/pipeline-to-name';

const modelsData = state => state.data.models.toJS().models;

/**
 * Added some additional properties like isPrimary etc to model items
 * and filtered the failed and success modles
 * @return {Map}
 */
export const formatAndFilterModelData = createSelector(
  modelsData,
  (models = []) => {
    const modelDataItems = models;
    const returnData = [];

    modelDataItems.forEach((data) => {
      /* -- The original dataSet is being mutated -- */
      const modelData = Object.assign({}, data);
      if (modelData) {
        ['batch_date', 'create_date', 'dep_ts'].forEach((key) => {
          if (modelData[key]) {
            modelData[`${key}_obj`] = moment.utc(modelData[key], 'ddd, DD MMM YYYY hh:mm:ss z');
            modelData[`${key}_formatted`] = modelData[`${key}_obj`].format('X');
          }
        });

        if (modelData.deployed_as) {
          modelData.isDeployed = true;
          modelData.isPrimary = modelData.deployed_as === 'main';
        } else {
          modelData.isDeployed = false;
          modelData.isPrimary = false;
        }

        modelData.pipeline = modelData.feature_type
          && pipelineToName(modelData.feature_type.toLowerCase());

        if (modelData.model_alias
          && modelData.name
          && modelData.model_alias[modelData.name] !== null) {
          modelData.model_alias_formatted = modelData.model_alias[modelData.name].join(', ');
        } else {
          modelData.model_alias_formatted = '';
        }

        modelData.model_type_formatted = modelData.model_type === 'Ranking' ? 'Outlier' : modelData.model_type;

        returnData.push(modelData);
      }
    });
    return returnData;
  },
);

const resultSummayData = state => state.resultSummaryData;

/**
 * Filter dates having non zero data count
 * @return {Array} dates
 */

export const getEnableDates = createSelector(
  resultSummayData,
  (resultSummary) => {
    let enableDates = [];
    if (resultSummary && resultSummary.items) {
      enableDates = resultSummary.items.filter(item => (item.count || item.total_count) > 0);
      enableDates = enableDates.map(data => moment.utc(data.ts).format('YYYYMMDD'));
    }
    return enableDates;
  },
);

