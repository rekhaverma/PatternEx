import moment from 'moment';
import { createSelector } from 'reselect';

const summaryData = state => state.logManager.toJS().rawData.summaryData;

export const getHeaderSummaryData = createSelector(
  summaryData,
  (data) => {
    if (!data) {
      return {
        logSources: 'N/A',
        noEvents: 'N/A',
        noEntities: 'N/A',
        storage: 'N/A',
        firstIngestion: 'N/A',
        lastUpdate: 'N/A',
      };
    }
    const headerData = {
      logSources: 0,
      noEvents: 0,
      noEntities: 0,
      storage: 0,
      firstIngestion: false,
      lastUpdate: false,
    };

    data.forEach((item) => {
      headerData.storage += +item.total_storage;
      headerData.logSources += item.summary_per_source.length;

      item.summary_per_source.forEach((source) => {
        headerData.noEvents += +source.num_lines;
        const firstTs = moment.utc(source.first_ts);
        const lastTs = moment.utc(source.last_ts);
        if (headerData.firstIngestion) {
          if (firstTs.isBefore(headerData.firstIngestion)) {
            headerData.firstIngestion = firstTs;
          }
        } else {
          headerData.firstIngestion = firstTs;
        }

        if (headerData.lastUpdate) {
          if (lastTs.isAfter(headerData.lastUpdate)) {
            headerData.lastUpdate = lastTs;
          }
        } else {
          headerData.lastUpdate = lastTs;
        }

        Object.keys(source.map_num_entities).forEach((entity) => {
          headerData.noEntities += +source.map_num_entities[entity];
        });
      });
    });
    if (headerData.firstIngestion) {
      headerData.firstIngestion = headerData.firstIngestion.format('ddd, D MMM YYYY HH:mm:ss ZZ');
    }
    if (headerData.lastUpdate) {
      headerData.lastUpdate = headerData.lastUpdate.format('ddd, D MMM YYYY HH:mm:ss ZZ');
    }

    return headerData;
  },
);
