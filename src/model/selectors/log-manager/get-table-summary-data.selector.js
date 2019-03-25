import { createSelector } from 'reselect';
import { convertBytesTo, getPercent, numberPretty } from 'lib';

const summaryData = state => state.logManager.toJS().rawData.summaryData;

/**
 * @todo: check with @Viv, @ankit and @himanshu if the logic is correct
 */
export const getTableSummaryData = createSelector(
  summaryData,
  (data) => {
    if (!data || !data.length) {
      return [];
    }
    const tableData = [];
    const totals = {
      events: 0,
      storage: 0,
    };

    data.forEach((item) => {
      totals.storage += +item.total_storage;

      item.summary_per_source.forEach((source) => {
        totals.events += source.num_lines;

        tableData.push({
          logSummarySource: source.source,
          logSummaryNoEvents: source.num_lines,
          logSummaryStorage: source.file_size,
          logSummaryFirstIngestion: source.first_ts,
          logSummaryLastUpdate: source.last_ts,
          logSummaryEntities: source.map_num_entities,
        });
      });
    });

    return tableData.map(row => ({
      ...row,
      logSummaryNoEvents: numberPretty(row.logSummaryNoEvents),
      logSummaryNoEventsPercent: getPercent(totals.events, row.logSummaryNoEvents),
      logSummaryStorage: convertBytesTo(row.logSummaryStorage),
      logSummaryStoragePercent: getPercent(totals.storage, row.logSummaryStorage),
    }));
  },
);
