import { createSelector } from 'reselect';
import { pipelineToName } from 'lib/decorators';
import moment from 'moment';
import { mapTagToColor } from 'lib';
import { clone } from 'lodash';
import { dateFormats } from 'config';

const reports = state => state.data.reports.toJS().reports;
const cleanPipeline = (pipeline = '') => pipeline.split('_')[0];
const reportsToBeFiltered = report => report.rawReports;
const inputValue = input => input.inputValue.toLowerCase();

/**
* Function to format the reports mainly adding the pipelinev2
* to each item in the array
*
* @param {array}, reports
* @return {array} updated reports
*/
export const formatReports = createSelector(
  reports,
  report =>
    report.reduce((acc, item) => acc.concat([{
      ...item,
      'pipeline_original': item.pipeline,
      'pipeline': pipelineToName(cleanPipeline(item.pipeline)),
      'update_time_original': item.update_time,
      'update_time': moment.utc(item.update_time).unix(),
    }]), []).filter(item => item.enable),
);

/**
* Filtering the reports with the searched text
* @param {array}, reports
* @return {array} updated report/s
*/
export const filterReport = createSelector(
  reportsToBeFiltered,
  inputValue,
  (report, input) => report.filter(el => (
    el.name.toLowerCase().includes(input)
  )),
);

const dataSet = state => state.dataSet;
const field = state => state.field;
const dateFormat = state => state.dateFormat;
const order = state => (state.order && state.order.toLowerCase() === 'desc' ? -1 : 1);

/**
* Sorting the array on the basis of date
*/
const sortByDate = createSelector(
  dataSet,
  field,
  dateFormat,
  order,
  (data, property, dateformat, orderParam) => data
    .sort((a, b) =>
      orderParam
      * (moment(a[property], dateformat).unix() - moment(b[property], dateformat).unix())),
);

const columnData = state => state.columns.items || [];
const completeField = state => state.complete;

/*
* Creating column Dictionary based on the column Data
* @param {array, boolean}
* @return {object}
*/
const createColumnDictionary = createSelector(
  columnData,
  completeField,
  (column, complete) => {
    const columnDictionary = {};
    column.forEach((item) => {
      if (item.name) {
        if (complete) {
          columnDictionary[item.name] = item;
        } else {
          columnDictionary[item.name] = item.displayName;
        }
      }
    });
    return columnDictionary;
  },
);

const columnDictionaryData = state => state.columnDictionary;
const fieldData = state => state.field;
const returnFieldData = state => state.returnField;

/*
* Returning display name based on the column id
* @param {object, string, string} columnDictionary, field, returnField
* @return {string}
*/
const checkColumnDictionaryForField = createSelector(
  columnDictionaryData,
  fieldData,
  returnFieldData,
  (columnDictionary, fieldValue, returnField) => {
    /* -- Returns description if no return fieldValue is specified -- */
    const returnValue = returnField || 'description';
    if (columnDictionary && fieldValue) {
      switch (returnValue) {
        case 'displayName':
          return (columnDictionary[fieldValue] && columnDictionary[fieldValue][returnValue]) || fieldValue.replace(/_/g, ' ');
        case 'description':
        /* -- Empty string is returned in case of absence of returnField data -- */
          return (columnDictionary[fieldValue] && columnDictionary[fieldValue][returnValue]) || '';
        default:
          return fieldValue || '';
      }
    }
    return fieldValue || '';
  },
);

const reportResultsItems = state => state.items;

/*
* Formatting report results adding, formatted day_ts
* @param {array} rpeort results
* @return {array}
*/
const formatReportResults = createSelector(
  reportResultsItems,
  reportResults => reportResults.reduce((acc, item) => {
    if (item.day_ts) {
      return acc.concat([{
        ...item,
        'day_ts_original': item.day_ts,
        'ts': moment.utc(item.day_ts).format('X'),
      }]);
    }
    return acc.concat([{
      ...item,
      'minute_ts_original': item.minute_ts,
      'ts': moment.utc(item.minute_ts).format('X'),
    }]);
  }, []),
);

const allRules = state => state.allRules;
const selectedRulesData = state => state.selectedRules;

/*
* Filtering rules that are used to generate the specific report
* @param {array, array} all rules, selected rules id
* @return {array}
*/
export const filterRulesToShow = createSelector(
  allRules,
  selectedRulesData,
  (rules, selectedRules = []) => rules.filter(rule => selectedRules.includes(rule.id)),
);

const reportSummaryItems = state => state.data.reports.toJS().reportSummaryQuarterlyData.items;

/*
* Geting the available dates to enable on the picker
* @param {array} report Summary
* @return {array}
*/
export const getAvailableDates = createSelector(
  reportSummaryItems,
  (items = []) => items
    .filter(item => item.total_count > 0)
    .map(data => moment.utc(data.ts).format('YYYYMMDD')),
);

const cols = state => state.cols;
const allColumns = state => state.allColumns;

/*
* Generates the Report detail's table columns
* @param {array, array}, displayColumns, All columns
* @return {array}
*/
const getReportDetailTableColumns = createSelector(
  cols,
  allColumns,
  (displayCols, columnFormat) => {
    let key = true;
    return displayCols.map((column) => {
      const columnHeader = checkColumnDictionaryForField({
        'columnDictionary': columnFormat,
        'field': column,
        'returnField': 'displayName',
      });

      const tableCols = {
        'label': columnHeader,
        'field': column,
        'isKey': key,
        'columnTitle': true,
      };

      if (key) {
        key = false;
      }

      switch (column) {
        case 'day_ts':
        case 'minute_ts':
          tableCols.label = 'Timestamp';
          tableCols.dataFormat = (cell, row) => moment.utc(row.ts, 'X').format(dateFormats.longFormatWithTimeZoneAMPM);
          break;
        case 'predicted_tag_id':
          tableCols.dataFormat = (cell, row) => row.predicted_tag.name || '';
          break;
        default:
          break;
      }

      return tableCols;
    });
  },
);

const columnFormatData = state =>
  createColumnDictionary({
    columns: state.raw.toJS().columnFormat,
    complete: true,
  });
const reportResultsData = state => state.data.reports.toJS().reportResults;

/*
* Generating columns for listing and setting items and columns
* in state.
*/
export const handleListingData = createSelector(
  columnFormatData,
  reportResultsData,
  (columnFormat, reportResults) => {
    if (Object.keys(columnFormat).length && Object.keys(reportResults).length) {
      const items = formatReportResults({ 'items': reportResults.items });
      const displayCols = reportResults.display_cols || [];
      const columns = getReportDetailTableColumns({ 'cols': displayCols, 'allColumns': columnFormat });
      return {
        'columns': columns,
        'items': items || [],
      };
    }
    return {
      'columns': [],
      'items': [],
    };
  },
);

const content = (label, value, color) => ({
  'label': label,
  'count': value,
  'color': color,
});

const allTags = state => state.allTags;
const timeRange = state => state.timeRange;
const reportSummaryData = state => state.reportSummaryData;
const modeType = state => state.mode;

/*
* Generates the Piechart, bar chart and stacked bar chart Data
* @param {array, object, object}, tags, time, reportSummary
* @return {object}
*/
export const getFormattedChartData = createSelector(
  allTags,
  timeRange,
  reportSummaryData,
  modeType,
  (tags, time, reportSummary, mode) => {
    let { startTime, endTime } = time;
    startTime = moment.utc(startTime);
    endTime = moment.utc(endTime);
    let totalThreatsCount = 0;
    let maliciousTags = {};
    const defaultTagMap = {};
    const colorMapping = {};
    let predictedTagMap = {};
    let stackedBarChartData = [];
    let barChartData = [];
    const pieChartData = [];
    let tagList = [];
    const colorArr = [];
    const barChartBarColor = '#214742';
    const items = reportSummary.items;
    maliciousTags = Object.keys(tags).filter(tag => tags[tag] && tags[tag].type === 'M');
    maliciousTags.forEach((key) => {
      const tagName = tags[key].name || 'Unknown';
      defaultTagMap[tagName] = 0;
      colorMapping[tagName] = mapTagToColor(tagName.trim());
    });
    const legendMap = clone(defaultTagMap);
    items.forEach((item, index) => {
      const tsMoment = mode === 'batch' ? moment.utc(item.ts, dateFormats.longFormatWithOffset).startOf('day') : moment(item.ts, dateFormats.longFormatWithOffset);
      stackedBarChartData[index] = clone(defaultTagMap);
      const timeStamp = mode === 'batch' ? tsMoment.format(dateFormats.mmddyySlash) : tsMoment.format('HH:mm');
      stackedBarChartData[index].name = timeStamp;
      const data = {
        name: timeStamp,
        value: item.total_count,
        color: barChartBarColor,
      };
      if (item.total_count > 0) {
        barChartData.push(data);
      }
      predictedTagMap = item.map_predicted_tag_id;
      totalThreatsCount = item.total_count;

      if (predictedTagMap) {
        Object.keys(predictedTagMap).forEach((tagId) => {
          if (maliciousTags.indexOf(tagId) >= 0) {
            const tagName = (tags[tagId] && tags[tagId].name)
              ? tags[tagId].name
              : 'Unknown';
            stackedBarChartData[index][tagName] = predictedTagMap[tagId];
            legendMap[tagName] = 1;
            pieChartData.push(content(tagName, predictedTagMap[tagId], colorMapping[tagName]));
          }
        });
      }
    });
    tagList = Object.keys(defaultTagMap);
    if (stackedBarChartData && stackedBarChartData.length) {
      stackedBarChartData = sortByDate({
        'dataSet': stackedBarChartData,
        'field': 'name',
        'dateFormat': dateFormats.mmddyySlash,
      });

      // Remove tags with no values
      Object.keys(legendMap).forEach((key) => {
        if (legendMap[key] === 0) {
          stackedBarChartData.forEach((data, index) => {
            delete stackedBarChartData[index][key];
          });
          tagList = tagList.filter(data => data !== key);
        }
      });

      Object.keys(stackedBarChartData[0]).forEach((key) => {
        if (['name'].indexOf(key) < 0) {
          colorArr.push(colorMapping[key]);
        }
      });

      stackedBarChartData = stackedBarChartData.filter(data => Object.keys(data).length > 1);
    }

    if (barChartData && barChartData.length) {
      barChartData = sortByDate({
        'dataSet': barChartData,
        'field': 'name',
        'dateFormat': dateFormats.mmddyySlash,
      });
    }

    return {
      'pieChartData': pieChartData,
      'barChartData': barChartData,
      'stackedBarChartData': stackedBarChartData,
      'totalThreatsCount': totalThreatsCount,
      'tagList': tagList,
      'colorArr': colorArr,
      'startTime': startTime,
      'endTime': endTime,
    };
  },
);

export {
  cleanPipeline,
  sortByDate,
  createColumnDictionary,
  checkColumnDictionaryForField,
  formatReportResults,
  getReportDetailTableColumns,
};
