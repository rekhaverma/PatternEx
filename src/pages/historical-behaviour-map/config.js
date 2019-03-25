import moment from 'moment';
import Tags from 'model/classes/tags.class';

import findEntityName from 'lib/decorators/find-entity-name';

/**
* Verifies is in data array there are 2 or multiple dates
* set for same day
* @param {Array} data
* @return {Boolean}
*/
export const multipleDatesOnSameDay = (data) => {
  let dateAlreadyExists = false;

  data.forEach((dateValue, index) => {
    let found = false;
    const restOfDateValues = data;
    restOfDateValues.splice(index, 1);

    restOfDateValues.forEach((day) => {
      if (moment(dateValue).isSame(moment(day), 'day')) {
        found = true;
      }
    });

    if (found) {
      dateAlreadyExists = true;
    }
  });
  return dateAlreadyExists;
};

/**
* Verifies if 2 date values have exactly the same year,
* month, day, hours and minutes values
* @param {Array} data
* @return {Boolean}
*/
export const isSameDay = (day1, day2) => {
  const a = new Date(day1);
  const b = new Date(day2);
  return a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate() &&
  a.getHours() === b.getHours() &&
  a.getMinutes() === b.getMinutes();
};

export const getFeatures = data => Object.values(data).reduce((acc, arr) => acc.concat(arr), []);

export const defaultDimensions = [
  'score',
  'predicted_prob',
  'predicted_tag',
];

export const getUniqueFeatures = (featuresArr) => {
  const pipelineFeatures = getFeatures(featuresArr);

  if (defaultDimensions.length > 0) {
    defaultDimensions.forEach((dim) => {
      if (pipelineFeatures.includes(dim)) {
        const indexOfExistingDim = pipelineFeatures.indexOf(dim);
        pipelineFeatures.splice(indexOfExistingDim, 1);
      }
    });
  }
  return pipelineFeatures;
};

export const getColumnName = (key, data) => data.find(el => (el.name === key)) || {};

export const formatFeatures = (features, columnFormatData) => features
  .reduce((acc, feature) => [...acc, {
    'id': feature,
    'content': Object.keys(getColumnName(feature, columnFormatData)).includes('displayName')
      ? getColumnName(feature, columnFormatData).displayName : feature,
  }], []);

export const getMapData = (data, features, threatSelected) => {
  if (data.length > 0) {
    return data.reduce((acc, item) => {
      const tagsInstance = new Tags([item.predicted_tag.id, item.user_tag.id]);
      const tagsFromCache = tagsInstance.constructor.getFromCache();

      const getTagName = (tag) => {
        let tagName = '';
        if (tag.id !== null && Object.keys(tagsFromCache).includes(tag.id)) {
          tagName = tagsFromCache[tag.id].name;
        } else if (tag.name !== null) {
          tagName = tag.name;
        }
        return tagName;
      };

      const featuresValues = features.reduce((accum, feature) => {
        const featuresObj = accum;
        if (feature === 'predicted_tag') {
          featuresObj[feature] = getTagName(item.predicted_tag);
        } else {
          featuresObj[feature] = !isNaN(item[feature]) ? Number(item[feature]).toFixed(2) : 0;
        }
        return featuresObj;
      }, {});
      const dateProperty = { 'date': moment(item.ts) };

      const highlightThreat = {
        'highlightEntity': item.predicted_tag.id && item.predicted_tag.id.toString() === threatSelected,
      };

      return [...acc, Object.assign(dateProperty, featuresValues, highlightThreat)];
    }, []);
  }
  return [];
};

export const getTableData = (data, pipeline) => {
  if (data.length > 0) {
    const dateValues = data.map(dataObject => moment(dataObject.ts));
    const dateExists = multipleDatesOnSameDay(dateValues);

    return data.reduce((acc, item) => {
      const tagsInstance = new Tags([item.predicted_tag.id, item.user_tag.id]);
      const tagsFromCache = tagsInstance.constructor.getFromCache();

      const getTagName = (tag) => {
        let tagName = '';
        if (tag.id !== null && Object.keys(tagsFromCache).includes(tag.id)) {
          tagName = tagsFromCache[tag.id].name;
        } else if (tag.name !== null) {
          tagName = tag.name;
        }
        return tagName;
      };

      return [...acc, {
        'id': `historicalTableRow__${data.indexOf(item)}`,
        'date': dateExists ?
          moment(item.ts).format('MM - DD - YYYY HH:mm') :
          moment(item.ts).format('MM - DD - YYYY'),
        'entity_name': findEntityName(pipeline, item),
        'entity_type': pipeline,
        'pipeline': pipeline,
        'predicted_tag': getTagName(item.predicted_tag),
        'predicted_tag_id': item.predicted_tag_id,
        'user_tag': item.user_tag.id ? getTagName(item.user_tag) : '',
        'user_tag_id': item.user_tag.label_id ? item.user_tag.label_id : null,
        'user_tag_set_label': getTagName(item.user_tag),
        'ts': item.ts,
        'description': item.user_tag.description,
        'model_name': data.model_name,
      }];
    }, []);
  }
  return [];
};

export const historicalTableFormatData = [
  {
    'className': 'table__headerColumn',
    'isKey': true,
    'field': 'id',
    'hidden': true,
    'label': 'Id',
    'resizable': false,
    'intl': 'historical.table.id',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'date',
    'hidden': false,
    'label': 'Date',
    'resizable': true,
    'intl': 'historical.table.date',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'entity_name',
    'hidden': false,
    'label': 'Entity',
    'resizable': true,
    'intl': 'historical.table.entity_name',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'predicted_tag',
    'hidden': false,
    'label': 'Predictive Threat Tactic',
    'resizable': true,
    'title': true,
    'intl': 'historical.table.predicted_tag',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'user_tag',
    'hidden': false,
    'label': 'Feedback',
    'resizable': true,
    'intl': 'historical.table.user_tag',
  },
];

export const getAvailableTactics = (items, tactics) => {
  const usedTactics = items.map(data => data.predicted_tag_id);
  return tactics.filter((item => usedTactics.indexOf(item.id) > -1));
};
