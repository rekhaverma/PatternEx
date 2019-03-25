import { fromJS } from 'immutable';
import { logManagerActions } from '../actions/log-manager';

const initialState = fromJS({
  loading: {
    addDataSource: false,
    updateDataSource: false,
    startDataSource: false,
    stopDataSource: false,
    deleteDataSource: false,
    getSummaryData: false,
    getDataConfig: false,
    getDataSources: false,
  },
  status: {
    updateDataSource: null,
    addDataSource: null,
    startDataSource: null,
    stopDataSource: null,
    deleteDataSource: null,
  },
  rawData: {
    summaryData: [],
    configData: {},
    dataSources: [],
  },
});

const disableItem = (state, payload) => state.toJS().rawData.dataSources.map((item) => {
  if (item.uuid === payload.uuid) {
    return payload;
  }

  return item;
});

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case logManagerActions.GET_SUMMARY_DATA_BEGIN_LOADING:
      return state.setIn(['loading', 'getSummaryData'], true);
    case logManagerActions.GET_SUMMARY_DATA_COMPLETE_LOADING:
      return state.setIn(['loading', 'getSummaryData'], false)
        .setIn(['rawData', 'summaryData'], payload);
    case logManagerActions.GET_DATA_CONFIG_BEGIN_LOADING:
      return state.setIn(['loading', 'getDataConfig'], true);
    case logManagerActions.GET_DATA_CONFIG_COMPLETE_LOADING:
      return state.setIn(['loading', 'getDataConfig'], false)
        .setIn(['rawData', 'configData'], payload);

    /**
     * Set `getDataSources` to loading and reset the other with complete
     */
    case logManagerActions.GET_DATA_SOURCES_BEGIN_LOADING:
      return state.setIn(['loading', 'getDataSources'], true)
        .setIn(['status', 'addDataSource'], 'complete')
        .setIn(['status', 'startDataSource'], 'complete')
        .setIn(['status', 'stopDataSource'], 'complete')
        .setIn(['status', 'updateDataSource'], 'complete')
        .setIn(['status', 'deleteDataSource'], 'complete');

    case logManagerActions.GET_DATA_SOURCES_FAIL_LOADING:
      return state.setIn(['loading', 'getDataSources'], false)
        .setIn(['status', 'dataSources'], []);

    case logManagerActions.GET_DATA_SOURCES_COMPLETE_LOADING:
      return state.setIn(['loading', 'getDataSources'], false)
        .setIn(['rawData', 'dataSources'], payload);

    case logManagerActions.ADD_DATA_SOURCE_BEGIN_SENDING:
      return state.setIn(['loading', 'addDataSource'], true);

    case logManagerActions.ADD_DATA_SOURCE_FAIL_SENDING:
      return state.setIn(['loading', 'addDataSource'], false)
        .setIn(['status', 'addDataSource'], 'fail');

    case logManagerActions.ADD_DATA_SOURCE_COMPLETE_SENDING:
      return state.setIn(['loading', 'addDataSource'], false)
        .setIn(['status', 'addDataSource'], 'success');

    case logManagerActions.UPDATE_DATA_SOURCE_BEGIN_SENDING:
      return state.setIn(['loading', 'updateDataSource'], true)
        .setIn(['rawData', 'dataSources'], disableItem(state, payload));

    case logManagerActions.UPDATE_DATA_SOURCE_FAIL_SENDING:
      return state.setIn(['loading', 'updateDataSource'], false)
        .setIn(['status', 'updateDataSource'], 'fail');

    case logManagerActions.UPDATE_DATA_SOURCE_COMPLETE_SENDING:
      return state.setIn(['loading', 'updateDataSource'], false)
        .setIn(['status', 'updateDataSource'], 'success');

    case logManagerActions.START_DATA_SOURCE_BEGIN_SENDING:
      return state.setIn(['loading', 'startDataSource'], true)
        .setIn(['rawData', 'dataSources'], disableItem(state, payload));

    case logManagerActions.START_DATA_SOURCE_FAIL_SENDING:
      return state.setIn(['loading', 'startDataSource'], false)
        .setIn(['status', 'startDataSource'], 'fail');

    case logManagerActions.START_DATA_SOURCE_COMPLETE_SENDING:
      return state.setIn(['loading', 'startDataSource'], false)
        .setIn(['status', 'startDataSource'], 'success');

    case logManagerActions.STOP_DATA_SOURCE_BEGIN_SENDING:
      return state.setIn(['loading', 'stopDataSource'], true)
        .setIn(['rawData', 'dataSources'], disableItem(state, payload));

    case logManagerActions.STOP_DATA_SOURCE_FAIL_SENDING:
      return state.setIn(['loading', 'stopDataSource'], false)
        .setIn(['status', 'stopDataSource'], 'fail');

    case logManagerActions.STOP_DATA_SOURCE_COMPLETE_SENDING:
      return state.setIn(['loading', 'stopDataSource'], false)
        .setIn(['status', 'stopDataSource'], 'success');

    case logManagerActions.DELETE_DATA_SOURCE_BEGIN_SENDING:
      return state.setIn(['loading', 'deleteDataSource'], true)
        .setIn(['rawData', 'dataSources'], disableItem(state, payload));

    case logManagerActions.DELETE_DATA_SOURCE_FAIL_SENDING:
      return state.setIn(['loading', 'deleteDataSource'], false)
        .setIn(['status', 'deleteDataSource'], 'fail');

    case logManagerActions.DELETE_DATA_SOURCE_COMPLETE_SENDING:
      return state.setIn(['loading', 'deleteDataSource'], false)
        .setIn(['status', 'deleteDataSource'], 'success');
    default:
      return state;
  }
};
