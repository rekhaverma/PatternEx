import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { arrayToObject } from 'lib/decorators';
import Tags from 'model/classes/tags.class';

import { tagsFromState } from './malicious-activity.selectors';

const pipelineItems = (state) => {
  if (state.raw.toJS().explodedView.searchFired) {
    return fromJS(state.raw.toJS().explodedView.searchData);
  }
  return state.data.pipelines.get('items');
};

const pipelineCount = (state) => {
  if (state.raw.toJS().explodedView.searchFired) {
    return state.raw.toJS().explodedView.searchData.length;
  }
  return state.data.pipelines.get('totalCount');
};

const columFormatItems = state => state.raw.get('columnFormat');

export const pipelineTableData = createSelector(
  pipelineItems,
  columFormatItems,
  tagsFromState,
  (items, columnFormat, tags) => {
    const tagsInstance = new Tags(tags);
    const features = arrayToObject(columnFormat.items, 'name');
    return items.toJS().map(item => ({
      ...item,
      'hash': Math.random().toString(36).substr(2, 9),
      'predicted_prob': item.predicted_prob ? Number.parseFloat(item.predicted_prob).toFixed(2) : 0,
      'predicted_prob_sum': item.predicted_prob_sum ? Number.parseFloat(item.predicted_prob_sum).toFixed(2) : 0,
      'score': item.score ? Number.parseFloat(item.score).toFixed(2) : 0,
      'predicted_tag_name': item.predicted_tag_id
        ? tagsInstance.getTagById(item.predicted_tag_id).name
        : '',
      'feedback_tag_name': item.user_tag && item.user_tag.label_id
        ? tagsInstance.getTagById(item.user_tag.label_id).name
        : '',
      'top_features': item.top_n_features
        ? item.top_n_features.map(key => ({
          ...features[key],
          count: !isNaN(Number.parseFloat(item[key])) ?
            Number.parseFloat(item[key]).toFixed(2) : item[key],
        }))
        : [],
    }));
  },
);

export const columnFormatPipeline = createSelector(
  columFormatItems,
  columnFormat => (columnFormat.items
    ? columnFormat.items.map(el => ({
      ...el,
      'content': el.displayName,
      'label': el.displayName,
      'id': el.name,
    }))
    : []),
);

export const pipelineTableCount = createSelector(
  pipelineCount,
  count => count,
);
