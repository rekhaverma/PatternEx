import Immutable from 'immutable';
import { createSelector } from 'reselect';
import { objectToArray } from 'lib/decorators';
import { zeppelinConfig } from 'config';

export const zeppelin = state => state.app.zeppelin;

export const zeppelinParagraphs = createSelector(
  zeppelin,
  state => state.get('paragraphs'),
);

export const zeppelinParagraphsAsArray = createSelector(
  zeppelin,
  state => objectToArray(state.get('paragraphs').toJS()),
);

export const getExpandedSpider = createSelector(
  zeppelin,
  (state) => {
    const paragraphs = state.get('paragraphs');

    if (!paragraphs.isEmpty()) {
      if (paragraphs.hasIn([zeppelinConfig.expandedGraphParagraph, 'results'])) {
        const results = paragraphs.getIn([zeppelinConfig.expandedGraphParagraph, 'results']);
        if (results.get('code') === 'SUCCESS') {
          if (Immutable.List.isList(results.get('msg'))
            && !results.get('msg').isEmpty()) {
            return results.get('msg').first().toJS();
          }
        }
      }
    }

    return {
      'type': '',
      'data': '',
    };
  },
);

export const isZeppelinActive = createSelector(
  zeppelin,
  state => !state.get('disabled'),
);

export const isZeppelinInProgress = createSelector(
  zeppelin,
  state => state.get('autocorrelateInProgress'),
);
