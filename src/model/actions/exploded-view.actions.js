import ptrxREST, { ptrxRESTFormData, ptrxZeppelin } from 'lib/rest';
import moment from 'moment';
import { ENVS, dateFormats } from 'config';
import { fromJS } from 'immutable';

import getEntityTypeByPipeline from 'lib/decorators/pipeline-to-entity-type';
import getRelationFromPipeline from 'lib/decorators/relation-from-pipeline';
import entityNameFromPipeline from 'lib/decorators/entity-name-from-pipeline';
import findEntityName from 'lib/decorators/find-entity-name';
import { addNotification } from './ui.actions';

import {
  domainInfoMock,
  nxDomainsMock,
  vulnerabilityReportMock,
  logsDataMock,
} from './mockData';
import Zeppelin from '../classes/zeppelin.class';

export const SET_SEARCH_DATA = '@@explodedView/SET_SEARCH_DATA';
export const SET_PIPELINE_ENTITY_DATA = '@@explodedView/SET_PIPELINE_ENTITY_DATA';
export const SET_DOMAIN_INFORMATION = '@@explodedView/SET_DOMAIN_INFORMATION';
export const FETCH_SEARCH_DATA = '@@explodedView/FETCH_SEARCH_DATA';
export const SET_RELATED_ENTITIES_DATA = '@@explodedView/SET_RELATED_ENTITIES_DATA';
export const FETCH_RELATED_ENTITIES_DATA = '@@explodedView/FETCH_RELATED_ENTITIES_DATA';
export const SET_LABELS_HISTORY = '@@explodedView/SET_LABELS_HISTORY';
export const FETCH_LABELS_HISTORY = '@@explodedView/FETCH_LABELS_HISTORY';
export const SET_CLUSTER_RELATIONS = '@@explodedView/SET_CLUSTER_RELATIONS';
export const FETCH_CLUSTER_RELATIONS = '@@explodedView/FETCH_CLUSTER_RELATIONS';
export const FETCH_VULNERABILITY_REPORT_DATA = '@@explodedView/FETCH_VULNERABILITY_REPORT_DATA';
export const SET_VULNERABILITY_REPORT_DATA = '@@explodedView/SET_VULNERABILITY_REPORT_DATA';
export const SET_FW_LOGS_DATA = '@@explodedView/SET_FW_LOGS_DATA';
export const SET_DNS_LOGS_DATA = '@@explodedView/SET_DNS_LOGS_DATA';
export const GET_NX_DOMAINS = '@@explodedView/GET_NX_DOMAINS';
export const RESET_SEARCH_DATA = '@@explodedView/RESET_SEARCH_DATA';
export const GET_ENTITY_INFO = '@@explodedView/GET_ENTITY_INFO';
export const DELETE_LABEL = '@@rest/DELETE_LABEL';
export const DELETE_LABEL_SUCCESS = '@@rest/DELETE_LABEL_SUCCESS';
export const DELETE_LABEL_FAILED = '@@rest/DELETE_LABEL_FAILED';
export const UPDATE_SEARCH_DATA = '@@explodedView/UPDATE_SEARCH_DATA';
export const SET_MODEL_NAME = '@@explodedView/SET_MODEL_NAME';
export const SET_HISTORICAL_DATA = '@@explodedView/SET_HISTORICAL_DATA';
export const GET_EDR_LOGS_DATA = '@@rest/GET_EDR_LOGS_DATA';
export const GET_EDR_LOGS_DATA_SUCCESS = '@@rest/GET_EDR_LOGS_DATA_SUCCESS';
export const GET_EDR_LOGS_DATA_FAILED = '@@rest/GET_EDR_LOGS_DATA_FAILED';
export const SET_GO_BACK_URL = '@explodedView/SET_GO_BACK_URK';

export const dispatchGoBackURL = data => ({ 'type': SET_GO_BACK_URL, 'payload': data });
export const fetchSearchData = () => ({ 'type': FETCH_SEARCH_DATA });
export const setSearchData = data => ({ 'type': SET_SEARCH_DATA, 'payload': data });
export const setHistoricalData = data => ({ 'type': SET_HISTORICAL_DATA, 'payload': data });
export const setPipelineEntityData = data => ({ 'type': SET_PIPELINE_ENTITY_DATA, 'payload': data });
export const resetSearchData = () => ({ 'type': RESET_SEARCH_DATA });
export const fetchRelatedEntitiesData = () => ({ 'type': FETCH_RELATED_ENTITIES_DATA });
export const setRelatedEntitiesData = data => ({ 'type': SET_RELATED_ENTITIES_DATA, 'payload': data });
export const fetchClusterRelationsEVP = () => ({ 'type': FETCH_CLUSTER_RELATIONS });
export const setClusterRelations = data => ({ 'type': SET_CLUSTER_RELATIONS, 'payload': data });
export const fetchVulnerabilityReportData = () => ({ 'type': FETCH_VULNERABILITY_REPORT_DATA });
export const setVulnerabilityReportData = data => ({ 'type': SET_VULNERABILITY_REPORT_DATA, 'payload': data });
export const setFWLogsData = data => ({ 'type': SET_FW_LOGS_DATA, 'payload': data });
export const setDNSLogsData = data => ({ 'type': SET_DNS_LOGS_DATA, 'payload': data });
export const setNXData = data => ({ 'type': GET_NX_DOMAINS, 'payload': data });
export const setModelName = data => ({ 'type': SET_MODEL_NAME, 'payload': data });
/**
 * @deprecated: use `model/actions/exploded-view/related-entities-data`
 * @param params
 * @returns {Function}
 */
export const getRelatedEntitiesData = params => async (dispatch) => {
  dispatch(fetchRelatedEntitiesData());

  try {
    const relationData = getRelationFromPipeline({
      pipeline: params.pipeline,
      entityName: params.entity_name.split(' ')[0],
      entityType: getEntityTypeByPipeline(params.pipeline),
    });

    const startTime = moment(params.start_time)
      .startOf('day')
      .subtract(1, 'days')
      .unix();
    const endTime = moment(params.end_time)
      .endOf('day')
      .unix();

    const response = await ptrxREST.get(`relatedentity?entity_name=${relationData.entityName}&entity_type=${relationData.entityType}&related_type=${relationData.relatedType}&relation=${relationData.relation}&time_start=${startTime}&time_end=${endTime}`);
    dispatch(setRelatedEntitiesData(response.data));
  } catch (err) {
    throw (err);
  }
};

/**
 * @deprecated: use `model/actions/exploded-view/search-data`
 */
export const getSearchData = params => async (dispatch) => {
  dispatch(fetchSearchData());
  try {
    const endTime = moment.utc(params.end_time, dateFormats.mmddyyDash).endOf('day').format('X');
    const startTime = moment.utc(params.start_time, dateFormats.mmddyyDash).format('X');
    let url = `search?entity_name=${params.entity_name}&entity_type=${getEntityTypeByPipeline(params.pipeline)}&pipeline=${params.pipeline}&time_start=${startTime}&time_end=${endTime}`;
    if (params.mode) {
      url = `search?entity_name=${params.entity_name}&entity_type=${getEntityTypeByPipeline(params.pipeline)}&pipeline=${params.pipeline}&time_start=${startTime}&time_end=${endTime}&mode=${params.mode}`;
    }

    if (params.origin && params.origin === 'pipeline') {
      url += `&model_type=${params.model_type}&model_name=${params.model_name}`;
    }

    const response = await ptrxREST.get(url);
    dispatch(setModelName(response.data.model_name));
    dispatch(setSearchData(response.data.items));
  } catch (err) {
    dispatch(setSearchData([])); // @todo: remove this line when API will be fixed!
    throw (err);
  }
};
/**
 * @deprecated: use `model/actions/exploded-view/historical-data`
 */
export const getHistoricalData = (params, firstTime = false) => async (dispatch) => {
  try {
    const endTime = moment.utc(params.end_time, dateFormats.mmddyyDash).endOf('day');
    let startTime = moment.utc(params.start_time, dateFormats.mmddyyDash).startOf('day');
    if (firstTime) {
      startTime = startTime.subtract(30, 'days');
    }

    let url = `search?entity_name=${params.entity_name}&entity_type=${getEntityTypeByPipeline(params.pipeline)}&pipeline=${params.pipeline}&time_start=${startTime.format('X')}&time_end=${endTime.format('X')}`;
    if (params.mode && params.mode !== 'realtime') { // @todo: check with BE team if realtime mode will crash the request
      url = `search?entity_name=${params.entity_name}&entity_type=${getEntityTypeByPipeline(params.pipeline)}&pipeline=${params.pipeline}&time_start=${startTime.format('X')}&time_end=${endTime.format('X')}&mode=${params.mode}`;
    }

    if (params.origin && params.origin === 'pipeline') {
      url += `&model_type=${params.model_type}&model_name=${params.model_name}`;
    }
    const response = await ptrxREST.get(url);

    dispatch(setHistoricalData(response.data.items || []));
  } catch (err) {
    dispatch(setHistoricalData([])); // @todo: remove this line when API will be fixed!
    throw (err);
  }
};

/**
 * @deprecated: use `model/actions/exploded-view/search-data
 * @param params
 * @returns {Function}
 */
export const fetchEntitySearchData = params => async (dispatch) => {
  dispatch(fetchSearchData());
  try {
    let url = `search?entity_name=${params.entity_name}&entity_type=${getEntityTypeByPipeline(params.pipeline)}&pipeline=${params.pipeline}&${params.model_name ? `model_name=${params.model_name}&` : ''}time_start=${params.start_time}&time_end=${params.end_time}`;
    if (params.mode) {
      url = `search?entity_name=${params.entity_name}&entity_type=${getEntityTypeByPipeline(params.pipeline)}&pipeline=${params.pipeline}&${params.model_name ? `model_name=${params.model_name}&` : ''}time_start=${params.start_time}&time_end=${params.end_time}&mode=${params.mode}`;
    }
    const response = await ptrxREST.get(url);
    dispatch(setModelName(response.data.model_name));
    dispatch(setSearchData(response.data.items));
  } catch (err) {
    throw (err);
  }
};

/**
 * @deprecated: use `model/actions/exploded-view/cluster-relations`
 */
export const getClusterRelations = params => async (dispatch) => {
  dispatch(fetchClusterRelationsEVP());
  try {
    const endTime = moment.utc(params.end_time).add(2, 'hours').startOf('day').format('X');
    const clusterDetails = await ptrxREST.get(`cluster_relations?end_time=${endTime}&entity_name=${params.entity_name}`);

    let clusterDetailsData = [];
    let clusterEntitiesData = [];

    if (clusterDetails.data.items.length) {
      clusterDetailsData = clusterDetails.data.items[0];
      let clusterEntitiesDate;
      if (clusterDetails.data.items.length > 0 && Object.keys(clusterDetails.data.items[0]).includes('day_ts')) {
        clusterEntitiesDate = moment.utc(clusterDetails.data.items[0].day_ts).format('YYYY-MM-DD');
      } else {
        clusterEntitiesDate = moment.utc(params.end_time).add(2, 'hours').startOf('day').format('YYYY-MM-DD');
      }
      const clusterId = clusterDetails.data.items.length > 0 ? clusterDetails.data.items[0].cluster_id : '';
      const clusterEntities = await ptrxREST.get(`/cluster_entities/${clusterEntitiesDate}?cluster_id=${clusterId || ''}`);
      clusterEntitiesData = clusterEntities.data.items.length > 0 ? clusterEntities.data.items : [];
    }

    dispatch(setClusterRelations({
      'clusterDetails': clusterDetailsData,
      'clusterEntities': clusterEntitiesData,
    }));
  } catch (err) {
    throw (err);
  }
};

/**
 * @deprecated: use `model/actions/exploded-view/entity-label-history`
 */
export const getEntityLabelHistory = params => async (dispatch) => {
  dispatch({
    'type': FETCH_LABELS_HISTORY,
  });
  try {
    const response = await ptrxREST.get(`labels/entity?entity_name=${params.entity_name}&entity_type=${getEntityTypeByPipeline(params.pipeline)}&pipeline=${params.pipeline}`);
    dispatch({
      'type': SET_LABELS_HISTORY,
      'payload': response.data.items,
    });
  } catch (err) {
    throw (err);
  }
};

/**
 * @deprecated: use `model/actions/exploded-view/set-label`
 * @param row
 * @param behaviorType
 * @param callback
 * @returns {Function}
 */
export const setLabelForEVP = (row, behaviorType, callback = () => {}) => async (dispatch) => {
  const data = new URLSearchParams();
  data.append('entity_name', findEntityName(row.pipeline, row));
  data.append('entity_type', getEntityTypeByPipeline(row.entity_type));
  data.append('pipeline', row.pipeline);
  data.append('time_start', moment.utc(row.ts).format('X'));
  data.append('time_end', moment.utc(row.ts).format('X'));
  data.append('status', 'confirmed');
  data.append('tag_id', row.tag_id);
  data.append('description', Object.keys(row).includes('description') ? row.description : '');
  data.append('weight', Object.keys(row).includes('weight') ? row.weight : 1);
  data.append('id', row.id);
  if (behaviorType === 'suspicious') {
    data.append('method_name', row.method_name);
  }

  try {
    let apiUrl = 'suspiciousbehavior';
    if (behaviorType === 'malicious') {
      apiUrl = 'maliciousbehavior';
    }
    const response = await ptrxRESTFormData.put(apiUrl, data);
    if (response.status >= 200 && response.status < 300) {
      dispatch(addNotification('success', 'Set label succeded'));

      callback(response, row.index);
    }
  } catch (error) {
    dispatch(addNotification('error', 'Set label failed.\n Please contact admin'));
    throw error;
  }
};
/**
 * @deprecated: use `model/actions/exploded-view/set-label`
 * @param row
 * @param callback
 * @returns {Function}
 */
export const setLabelEVPnonBehavior = (row, callback = () => {}) => async (dispatch) => {
  const data = new URLSearchParams();
  data.append('entity_name', findEntityName(row.pipeline, row));
  data.append('entity_type', getEntityTypeByPipeline(row.entity_type));
  data.append('pipeline', row.pipeline);
  data.append('time_start', moment.utc(row.ts).format('X'));
  data.append('time_end', moment.utc(row.ts).format('X'));
  data.append('status', 'active');
  data.append('tag_id', row.tag_id);
  data.append('description', Object.keys(row).includes('description') ? row.description : '');
  data.append('weight', Object.keys(row).includes('weight') ? row.weight : 1);
  data.append('mode', row.mode);
  data.append('model_name', row.model_name);

  try {
    const response = await ptrxRESTFormData.post('labels', data);
    if (response.status >= 200 && response.status < 300) {
      dispatch(addNotification('success', 'Set label succeded'));

      callback(response, row.index);
    }
  } catch (error) {
    dispatch(addNotification('error', 'Set label failed.\n Please contact admin'));
    throw error;
  }
};

/**
 * Delete the labels using label id
 * @deprecated - not used
 * @param {string} label's id
 * @return {}
 */
export const deleteLabel = (labelId, index) => async (dispatch, getState) => {
  dispatch({
    'type': DELETE_LABEL,
  });

  try {
    const response = await ptrxREST.delete(`labels/${labelId}`);
    if (response.status >= 200 && response.status < 300) {
      const searchDataLabel = getState().raw.toJS().explodedView.searchData;
      searchDataLabel[index] = {
        ...searchDataLabel[index],
        user_tag: {
          'label_id': null,
          'alert': null,
          'description': null,
          'id': null,
          'name': null,
          'severity': null,
          'system_tag': null,
          'type': null,
        },
      };
      dispatch({
        'type': SET_SEARCH_DATA,
        'payload': searchDataLabel,
      });
    } else {
      dispatch({
        'type': DELETE_LABEL_FAILED,
      });
    }
  } catch (error) {
    dispatch({
      'type': DELETE_LABEL_FAILED,
    });
  }
};

/**
 * @deprecated: use `model/actions/exploded-view/entity-info`
 * @param locationQuery
 * @returns {Function}
 */
export const getEntityInfo = locationQuery => async (dispatch) => {
  try {
    const entityData = entityNameFromPipeline(locationQuery);
    let returnData = domainInfoMock;
    if (process.env.NODE_ENV !== ENVS.DEV) {
      const ip = `ip=${entityData.srcip}`;
      const domain = `domain=${entityData.domain}`;
      let url = 'entity/info';

      if (entityData.domain && entityData.srcip) {
        url = `${url}?${ip}&${domain}`;
      } else if (entityData.domain && !entityData.srcip) {
        url = `${url}?${domain}`;
      } else if (entityData.srcip && !entityData.domain) {
        url = `${url}?${ip}`;
      }

      const response = await ptrxREST.get(url);
      if (response.status >= 200 && response.status < 300) {
        returnData = response.data;
      } else {
        dispatch(addNotification('error', 'Unable to get domain information.\n Please contact admin'));
      }
    }
    dispatch({
      'type': GET_ENTITY_INFO,
      'payload': returnData,
    });
  } catch (err) {
    throw (err);
  }
};

/**
 * @deprecated: use `lib/parse-paragraph-to-json`
 * @param data
 * @returns {*}
 */
const parseParagraphToJSON = (data) => {
  const splitByNewLine = data.split('\n');
  const extractPropertiesName = splitByNewLine[0].split('\t');
  splitByNewLine.shift();
  const createRowObject = extractPropertiesName.reduce((acc, value, i) => ([
    ...acc,
    {
      'idx': i,
      'name': value,
    },
  ]), []);

  function mapPropertiesWithFields(rowData) {
    return rowData.reduce((acc, value, i) => ({
      ...acc,
      [createRowObject[i].name]: value,
    }), {});
  }

  function isHTML(str) {
    const a = document.createElement('div');
    a.innerHTML = str;
    /* eslint-disable */
    for (let c = a.childNodes, i = c.length; i--;) {
      if (c[i].nodeType === 1) return true;
    }
    /* eslint-enable */

    return false;
  }

  return splitByNewLine.reduce((acc, value) => {
    if (value !== '' && !isHTML(value) && !value.includes('<!--')) {
      return [
        ...acc,
        {
          ...mapPropertiesWithFields(value.split('\t')),
        },
      ];
    }
    return [...acc];
  }, []);
};
/**
 * @deprecated: use `model/actions/exploded-view/vulnerability-report-data`
 * @param ip
 * @returns {Function}
 */
export const getTenableReportData = ip => async (dispatch) => {
  dispatch(fetchVulnerabilityReportData);
  try {
    let returnData = parseParagraphToJSON(vulnerabilityReportMock);
    const notebooks = await ptrxZeppelin('/notebook');
    const tenableReport = notebooks.data.body.filter(el => el.name === 'Tenable Report')[0];

    const getReportData = await Zeppelin.getNotebookById(tenableReport.id, { ip });
    const paragraphs = getReportData ? getReportData.paragraphs : null;
    const results = (paragraphs && paragraphs[2]) ? paragraphs[2].results : {};
    const data = Object.keys(results).length > 0 && results.code !== 'ERROR' ? results.msg[0].data : '';
    returnData = parseParagraphToJSON(data);

    dispatch(setVulnerabilityReportData(returnData));
  } catch (err) {
    throw err;
  }
};
/**
 * @deprecated use `model/actions/exploded-view/nx-domain`
 * @param params
 * @returns {Function}
 */
export const getNXDomains = params => async (dispatch) => {
  try {
    let returnData = nxDomainsMock;
    const notebooks = await ptrxZeppelin('/notebook');
    const tenableReport = notebooks.data.body.filter(el => el.name === 'DgaActivityAnalytics')[0];

    const getReportData = await Zeppelin.getNotebookById(tenableReport.id, params);
    const paragraphs = getReportData ? getReportData.paragraphs : null;
    const results = (paragraphs && paragraphs[5]) ? paragraphs[5].results : {};
    const data = Object.keys(results).length > 0 && results.code !== 'ERROR' ? results.msg[0].data : '';
    returnData = parseParagraphToJSON(data);

    dispatch(setNXData(returnData));
  } catch (err) {
    throw (err);
  }
};

/**
 * @deprecated: use 'model/actions/exploded-view/logs/fw-proxy
 * @param params
 * @returns {Function}
 */
export const getLogsFWProxy = params => async (dispatch) => {
  try {
    let returnData = parseParagraphToJSON(logsDataMock);
    const notebooks = await ptrxZeppelin('/notebook');
    const tenableReport = notebooks.data.body.filter(el => el.id === 'EntityDetailAnalytics')[0];

    const getReportData = await Zeppelin.getNotebookById(tenableReport.id, params);
    const paragraphs = getReportData ? getReportData.paragraphs : null;
    const results = (paragraphs && paragraphs[6]) ? paragraphs[6].results : {};
    const data = Object.keys(results).length > 0 && results.code !== 'ERROR' ? results.msg[0].data : '';
    returnData = parseParagraphToJSON(data);

    dispatch(setFWLogsData(returnData));
  } catch (err) {
    throw (err);
  }
};
/**
 * @deprecated: use 'model/actions/exploded-view/logs/dns
 * @param params
 * @returns {Function}
 */
export const getLogsDNS = params => async (dispatch) => {
  try {
    let returnData = parseParagraphToJSON(logsDataMock);
    const notebooks = await ptrxZeppelin('/notebook');
    const tenableReport = notebooks.data.body.filter(el => el.name === 'DNSExfillAnalysis')[0];

    const getReportData = await Zeppelin.getNotebookById(tenableReport.id, params);
    const paragraphs = getReportData ? getReportData.paragraphs : null;
    const results = (paragraphs && paragraphs[2]) ? paragraphs[2].results : {};
    const data = Object.keys(results).length > 0 && results.code !== 'ERROR' ? results.msg[0].data : '';
    returnData = parseParagraphToJSON(data);

    dispatch(setDNSLogsData(returnData));
  } catch (err) {
    throw (err);
  }
};

/**
 * @deprecated: use `model/actions/exploded-view/logs/edr`
 * @param params
 * @returns {Function}
 */
export const getLogsEDR = params => async (dispatch) => {
  try {
    dispatch({
      'type': GET_EDR_LOGS_DATA,
    });
    const url = `/log_sources/edr?entity_name=${params.entity_name}&entity_type=${params.entity_type}&start_date=${params.start_date}&end_date=${params.end_date}`;
    const response = await ptrxREST(url);

    if (response.status >= 200 && response.status < 300 && response.data instanceof Array) {
      dispatch({
        'type': GET_EDR_LOGS_DATA_SUCCESS,
        'payload': response.data,
      });
    } else {
      dispatch({
        'type': GET_EDR_LOGS_DATA_FAILED,
      });
    }
  } catch (error) {
    dispatch({
      'type': GET_EDR_LOGS_DATA_FAILED,
    });
  }
};

export const goBackUrl = (hash, url = {}) => async (dispatch, getState) => {
  if (Object.keys(url).length > 0) {
    const backUrlState = getState().raw.toJS().backURL;
    const backUrl = Object.assign({}, fromJS(url));
    const localStoreValue = localStorage.getItem('go_back_evp') || '{}';
    const localStore = JSON.parse(localStoreValue);
    const backUrlParams = {
      'path': backUrl.pathname,
      'search': backUrl.search,
    };

    localStore[hash] = backUrlParams;
    backUrlState[hash] = backUrlParams;

    localStorage.setItem('go_back_evp', JSON.stringify(localStore));
    dispatch(dispatchGoBackURL(backUrlState));
  }
};
