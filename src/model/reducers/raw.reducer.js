import { fromJS } from 'immutable';

import { evpActions } from 'model/actions/exploded-view';
import * as actions from '../actions';

const initialState = fromJS({
  'loadStatus': {
    'isLoading': [],
    'maliciousBehavior': false,
    'suspiciousBehavior': false,
    'searchAPI': false,
    'historicalAPI': false,
    'columnFormatLoaded': false,
    'labelsHistoryLoaded': false,
    'entityInfoDataLoaded': false,
    'nxDomainsDataLoaded': false,
    'relatedEntitiesDataLoaded': false,
    'DHCPLoaded': false,
    'detailsLoaded': false,
  },
  'backURL': {},
  'requestFailed': false,
  'tags': {},
  'systemInfo': {},
  'behaviorSummary': [],
  'behaviorSummaryStart': '',
  'behaviorSummaryEnd': '',
  'maliciousBehavior': [],
  'maliciousBehaviorHash': '',
  'suspiciousBehavior': [],
  'suspiciousBehaviorHash': '',
  'pipelines': {},
  'relations': {
    'selected': '',
    'startDate': {},
    'endDate': {},
    'items': {},
    'filters': {
      'active': {},
    },
    'dashboardLink': '',
  },
  'privileges': {},
  'columnFormat': {},
  'isRefreshEnabled': true,
  'update_systeminfo': '',
  'pipelineUpdate': '',
  'explodedView': {
    'searchFired': false,
    'searchData': [],
    'historicalData': [],
    'pipelineEntityData': {},
    'relatedEntities': {},
    'labelsHistory': [],
    'vulnerabilityReport': [],
    'clusterRelations': {
      'clusterDetails': {},
      'clusterEntities': [],
    },
    'entityInfo': {},
    'nxDomains': [],
    'modelName': '',
    'dhcpData': [],
    'detailsData': [],
  },
  'logs': {
    'FW/PROXY': [],
    'DNS': [],
    'EDR': [],
  },
});

export default (state = initialState, { type, payload }) => {
  const isLoading = state.getIn(['loadStatus', 'isLoading']);
  switch (type) {
    case actions.FETCH_SYSTEMINFO:
    case actions.FETCH_TAGS:
    case actions.FETCH_PRIVILEGES:
    case actions.FETCH_RELATIONS:
    case actions.FETCH_PIPELINES:
    case actions.FETCH_COLUMN_FORMAT:
    case actions.FETCH_PIPELINES_MODEL:
    case actions.GET_EDR_LOGS_DATA:
    case actions.FETCH_ENTITIES:
      return state.setIn(['loadStatus', 'isLoading'], isLoading.push(type));

    case evpActions.FETCH_SEARCH_DATA:
      return state
        .setIn(['explodedView', 'searchFired'], true)
        .set('isLoading', isLoading.push(type));

    case actions.FETCH_SYSTEMINFO_COMPLETE:
      return state.setIn(['loadStatus', 'isLoading'], isLoading.filterNot(action => action === actions.FETCH_SYSTEMINFO))
        .set('systemInfo', payload);

    case actions.FETCH_TAGS_COMPLETE:
      return state.setIn(['loadStatus', 'isLoading'], isLoading.filterNot(action => action === actions.FETCH_TAGS)).set('tags', payload.items);

    case actions.FETCH_SUMMARY:
      return state.set('behaviorSummary', []);

    case actions.FETCH_SUMMARY_COMPLETE:
      const lastKeyOfAction = state.get('isLoading').findLastKey(action => action === actions.FETCH_SUMMARY);
      const isLoadingArr = state.get('isLoading').delete(lastKeyOfAction);
      return state.setIn(['loadStatus', 'isLoading'], isLoadingArr)
        .set('behaviorSummaryStart', payload.startDate)
        .set('behaviorSummaryEnd', payload.endDate)
        .set('behaviorSummary', payload.items);

    case actions.REFRESH_SUMMARY_CHUNK_COMPLETE:
    case actions.FETCH_SUMMARY_CHUNK_COMPLETE:
      if (payload.items) {
        return state
          .set('behaviorSummary', [...state.toJS().behaviorSummary, payload.items])
          .set('behaviorSummaryStart', payload.startDate)
          .set('behaviorSummaryEnd', payload.endDate);
      }
      return state;

    case actions.FETCH_MALICIOUS_BEHAVIOR:
      return state.setIn(['loadStatus', 'maliciousBehavior'], false);

    case actions.FETCH_MALICIOUS_BEHAVIOR_COMPLETE:
      return state
        .setIn(['loadStatus', 'maliciousBehavior'], true)
        .set('maliciousBehavior', payload.items)
        .set('maliciousBehaviorHash', payload.hash);

    case actions.FETCH_SUSPICIOUS_BEHAVIOR:
      return state.setIn(['loadStatus', 'suspiciousBehavior'], false);

    case actions.FETCH_SUSPICIOUS_BEHAVIOR_COMPLETE:
      return state
        .setIn(['loadStatus', 'suspiciousBehavior'], true)
        .set('suspiciousBehavior', payload.items)
        .set('suspiciousBehaviorHash', payload.hash);

    case actions.REFRESH_SUMMARY_COMPLETE:
      return state.set('behaviorSummaryStart', payload.startDate)
        .set('behaviorSummaryEnd', payload.endDate)
        .set('behaviorSummary', payload.items);

    case actions.REFRESH_MALICIOUS_BEHAVIOR_COMPLETE:
      if (payload.items) {
        return state
          .set('maliciousBehavior', payload.items)
          .set('maliciousBehaviorHash', payload.hash);
      }
      return state;

    case actions.REFRESH_SUSPICIOUS_BEHAVIOR_COMPLETE:
      if (payload.items) {
        return state
          .set('suspiciousBehavior', payload.items)
          .set('suspiciousBehaviorHash', payload.hash);
      }
      return state;

    case actions.FETCH_PIPELINES_COMPLETE:
      return state.setIn(['loadStatus', 'isLoading'], isLoading.filterNot(action => action === actions.FETCH_PIPELINES))
        .set('pipelines', payload);

    case actions.FETCH_PIPELINES_MODEL_COMPLETE:
      return state.setIn(['loadStatus', 'isLoading'], isLoading.filterNot(action => action === actions.FETCH_PIPELINES_MODEL));

    case actions.FETCH_ENTITIES_COMPLETE:
      return state.setIn(['loadStatus', 'isLoading'], isLoading.filterNot(action => action === actions.FETCH_ENTITIES));

    case actions.FETCH_PRIVILEGES_COMPLETE:
      return state.setIn(['loadStatus', 'isLoading'], isLoading.filterNot(action => action === actions.FETCH_PRIVILEGES))
        .set('privileges', payload);

    case actions.FETCH_COLUMN_FORMAT_COMPLETE:
      return state
        .setIn(['loadStatus', 'isLoading'], isLoading.filterNot(action => action === actions.FETCH_COLUMN_FORMAT))
        .setIn(['loadStatus', 'columnFormatLoaded'], true)
        .set('columnFormat', payload);

    case actions.FETCH_MALICIOUS_BEHAVIOR_FAILED:
      return state.setIn(['loadStatus', 'isLoading'], isLoading.filterNot(action => action === actions.FETCH_MALICIOUS_BEHAVIOR))
        .set('requestFailed', true);

    case actions.FETCH_RELATIONS_COMPLETE:
      return state
        .setIn(['loadStatus', 'isLoading'], isLoading.filterNot(action => action === actions.FETCH_RELATIONS))
        .setIn(['relations', 'startDate'], fromJS(payload.startDate))
        .setIn(['relations', 'endDate'], fromJS(payload.endDate))
        .setIn(['relations', 'items'], fromJS(payload.items));

    case actions.FETCH_LABELS_COMPLETE:
      return state.setIn(['loadStatus', 'isLoading'], isLoading.filterNot(action => action === actions.FETCH_LABELS));

    case actions.ADD_ENTITIES:
      return state
        .setIn(['relations', 'items', payload.id, 'cluster_entities'], fromJS(payload.cluster_entities));

    case actions.ADD_LABELS:
      return state
        .setIn(['relations', 'items', payload.id, 'labels'], fromJS(payload.labels));

    case actions.SET_ENTITY_AUTOCORRELATED:
      return state
        .setIn(['relations', 'items', payload.clusterId, 'cluster_entities', payload.entityName, 'autocorrelated'], true);

    case actions.SET_SELECTED_CLUSTER:
      return state
        .setIn(['relations', 'selected'], fromJS(payload));

    case actions.RESET_SEARCH_DATA:
      return state
        .setIn(['explodedView', 'searchFired'], false)
        .setIn(['explodedView', 'searchData'], fromJS([]));

    case actions.FETCH_SYSTEMINFO_FAILED:
    case actions.FETCH_TAGS_FAILED:
    case actions.FETCH_SUMMARY_FAILED:
    case actions.FETCH_SUSPICIOUS_BEHAVIOR_FAILED:
    case actions.FETCH_PIPELINES_FAILED:
    case actions.FETCH_PRIVILEGES_FAILED:
    case actions.FETCH_COLUMN_FORMAT_FAILED:
    case actions.FETCH_LABELS_FAILED:
    case actions.FETCH_RELATIONS_FAILED:
    case evpActions.GET_EDR_LOGS_DATA_FAILED:
    case actions.FETCH_PIPELINES_MODEL_FAILED: {
      return state.set('requestFailed', true)
        .setIn(['loadStatus', 'isLoading'], fromJS([]));
    }

    case actions.REFRESH_DASHBOARD:
      return state.set('isRefreshEnabled', payload.isRefreshEnabled);

    case evpActions.SET_HISTORICAL_DATA:
      return state
        .setIn(['explodedView', 'historicalData'], fromJS(payload))
        .setIn(['loadStatus', 'historicalAPI'], true);


    case evpActions.SET_SEARCH_DATA:
      return state
        .setIn(['explodedView', 'searchData'], fromJS(payload))
        .setIn(['loadStatus', 'searchAPI'], true);

    case actions.SET_PIPELINE_ENTITY_DATA:
      return state
        .setIn(['explodedView', 'pipelineEntityData'], fromJS(payload));

    case evpActions.SET_LABELS_HISTORY:
      return state
        .setIn(['explodedView', 'labelsHistory'], fromJS(payload))
        .setIn(['loadStatus', 'labelsHistoryLoaded'], true)
        .set('isLoading', fromJS([]));

    case evpActions.SET_CLUSTER_RELATIONS:
      return state
        .setIn(['explodedView', 'clusterRelations'], fromJS(payload))
        .set('isLoading', fromJS([]));

    case evpActions.SET_RELATED_ENTITIES_DATA:
      return state
        .setIn(['explodedView', 'relatedEntities'], fromJS(payload))
        .setIn(['loadStatus', 'relatedEntitiesDataLoaded'], true);

    case evpActions.SET_VULNERABILITY_REPORT_DATA:
      return state
        .setIn(['explodedView', 'vulnerabilityReport'], fromJS(payload))
        .set('isLoading', fromJS([]));

    case evpActions.GET_NX_DOMAINS:
      return state
        .setIn(['explodedView', 'nxDomains'], fromJS(payload))
        .setIn(['loadStatus', 'nxDomainsDataLoaded'], true);

    case evpActions.GET_ENTITY_INFO:
      return state
        .setIn(['explodedView', 'entityInfo'], fromJS(payload))
        .setIn(['loadStatus', 'entityInfoDataLoaded'], true);

    case evpActions.GET_DHCP_DATA_SUCCESS:
      return state
        .setIn(['explodedView', 'dhcpData'], fromJS(payload))
        .setIn(['loadStatus', 'DHCPLoaded'], true);

    case evpActions.SET_FW_LOGS_DATA:
      return state
        .setIn(['logs', 'FW/PROXY'], fromJS(payload))
        .set('isLoading', fromJS([]));
    case evpActions.SET_MODEL_NAME:
      return state
        .setIn(['explodedView', 'modelName'], fromJS(payload));

    case evpActions.SET_DNS_LOGS_DATA:
      return state
        .setIn(['logs', 'DNS'], fromJS(payload))
        .set('isLoading', fromJS([]));

    case actions.SET_CLUSTER_FILTER:
      return state.setIn(['relations', 'filters', payload.filter], payload.value);

    case actions.RESET_CLUSTER_FILTERS:
      return state.setIn(['relations', 'filters'], fromJS({ 'active': {} }));
    case evpActions.GET_EDR_LOGS_DATA_SUCCESS:
      return state
        .setIn(['logs', 'EDR'], fromJS(payload))
        .setIn(['loadStatus', 'isLoading'], isLoading.filterNot(action => action === evpActions.GET_EDR_LOGS_DATA));

    case actions.SET_GO_BACK_URL:
      return state
        .set('backURL', payload);

    case actions.SAVE_DASHBOARD_LINK:
      return state.setIn(['relations', 'dashboardLink'], payload);

    case actions.RESET_DASHBOARD_LINK:
      return state.setIn(['relations', 'dashboardLink'], '');

    case evpActions.GET_DHCP_DATA_FAILED:
      return state
        .setIn(['explodedView', 'dhcpData'], fromJS([]))
        .setIn(['loadStatus', 'DHCPLoaded'], true);

    case evpActions.GET_DETAILS_DATA:
      return state
        .setIn(['explodedView', 'detailsData'], fromJS([]))
        .setIn(['loadStatus', 'detailsLoaded'], true);

    case evpActions.SET_DETAILS_DATA:
      return state
        .setIn(['explodedView', 'detailsData'], fromJS(payload))
        .setIn(['loadStatus', 'detailsLoaded'], true);

    default:
      return state;
  }
};
