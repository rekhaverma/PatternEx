import { createSelector } from 'reselect';
import * as d3 from 'd3';
import { isEmpty } from 'lodash';

const detailsData = state => state.raw.toJS().explodedView.detailsData;
const columnFormat = state => state.raw.toJS().columnFormat.items || [];

const colorScale = d3.scaleOrdinal(d3.schemeCategory20);

const findColumnDisplayName = (columns, featureName) => {
  const columnData = columns.find(col => col.name === featureName);
  if (!isEmpty(columnData)) {
    return columnData.displayName;
  }
  return featureName;
};

export const contributionData = createSelector(
  detailsData,
  columnFormat,
  (details, columns) => {
    // @todo: check if 'map_contribution_outlier_score' is the right prop to be taken
    let data = [];

    if (details.length > 0
      && Object.keys(details[0]).includes('map_contribution_outlier_score')
      && columnFormat.length > 0) {
      const contributionObject = details[0].map_contribution_outlier_score;

      if (!contributionObject) {
        return data;
      }
      const sum = Object.keys(contributionObject)
        .reduce((acc, feature) => acc + contributionObject[feature], 0);

      data = Object.keys(contributionObject).reduce((acc, feature, index) => [
        ...acc, {
          'id': feature,
          'label': findColumnDisplayName(columns, feature),
          'percent': (contributionObject[feature] * 100) / sum,
          'color': colorScale(index),
        }], []);
    }
    return data;
  },
);
