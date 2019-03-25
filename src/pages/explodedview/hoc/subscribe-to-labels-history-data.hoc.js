import { connect } from 'react-redux';

import { deleteLabel } from 'model/actions/rest/labels.actions.js';
import {
  getLabelsHistory,
} from 'model/selectors';
import {
  setLabelHandler,
  getEntityLabelHistory,
  getSearchData,
} from 'model/actions/exploded-view';

export const withLabelsHistoryData = (subscriber) => {
  const mapStateToProps = state => ({
    'isLabelsHistoryLoaded': state.raw.toJS().loadStatus.labelsHistoryLoaded,
    'labelsHistory': getLabelsHistory(state),
  });

  return connect(mapStateToProps)(subscriber);
};

export const withLabelsActions = (subscriber) => {
  const mapDispatchToProps = dispatch => ({
    'deleteLabel': (...params) => dispatch(deleteLabel(...params)),
    'setLabelHandler': (...params) => dispatch(setLabelHandler(...params)),
    'getEntityLabelHistory': params => dispatch(getEntityLabelHistory(params)),
    'getSearchData': (...params) => dispatch(getSearchData(...params)),
  });

  return connect(null, mapDispatchToProps)(subscriber);
};

