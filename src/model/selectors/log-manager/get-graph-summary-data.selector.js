import moment from 'moment';
import { createSelector } from 'reselect';

const summaryData = state => state.logManager.toJS().rawData.summaryData;

export const getGraphSummaryData = createSelector(
  summaryData,
  (data) => {
    if (!data) {
      return [];
    }

    const graphData = [];

    data.forEach((item) => {
      const point = {
        date: moment.utc(item.day_ts),
        storage: +item.total_storage,
        entities: 0,
      };

      item.summary_per_source.forEach((source) => {
        Object.keys(source.map_num_entities).forEach((entity) => {
          point.entities += +source.map_num_entities[entity];
        });
      });

      graphData.push(point);
    });

    return graphData;
  },
);
