/**
 * Check if flow exists already in array
 * @param {array} array of flows
 * [
 *  {
 *    'start': 10.20.11.10,
 *    'end': 10.21.22.10,
 *  }
 * ]
 * @param {array} newFlow
 * @return {boolean}
 */
export const checkForDuplicatedPaths = (array, newFlow) => {
  let exists = false;
  array.forEach((flow) => {
    if ((flow.start === newFlow[0] && flow.end === newFlow[1]) ||
      (flow.start === newFlow[1] && flow.end === newFlow[0])) {
      exists = true;
    }
  });
  return exists;
};

/**
 * Search in entities for entity with name = entityName and return it's type
 * @param {string} entityName
 * @param {array} entities
 * @return {string}
 */
export const getEntityType = (entityName, entities) => {
  const output = entities.find(entity => entity.entity_name.toString() === entityName.toString());
  if (output && Object.keys(output).includes('entity_type')) {
    return output.entity_type;
  }
  return '';
};

  /**
 * Search in entities for entity with type = entityType and return number of occurrences
 * @param {string} entityType
 * @param {array} entities
 * @return {number}
 */
export const getTypeOccurences = (entityType, entities) => entities.filter(entity =>
  entity.entity_type === entityType).length;

/**
 * Decorate flows
 * [
 *  {
 *    'start': 10.20.11.20,
 *    'end': 11.20.201.12,
 *    'start_ip_type': 'user',
 *    'start_ip_type_occurrences': 2,
 *    'end_ip_type: 'domain',
 *    'end_ip_type_occurrences': 1,
 *  },
 *  *  {
 *    'start': 11.20.11.20,
 *    'end': 121.21.01.12,
 *    'start_ip_type': 'sip',
 *    'start_ip_type_occurrences': 3,
 *    'end_ip_type: 'dip',
 *    'end_ip_type_occurrences': 1,
 *  }
 * ]
 * @param {string} relations
 * @param {array} entities
 * @return {array} of objects
 */
export const decorateFlowsData = (relations, entities) => {
  const flows = [];

  relations.forEach((relation) => {
    const flowExists = flows.length > 1 ? checkForDuplicatedPaths(flows, relation) : false;
    if (flowExists === false) {
      const startIpType = getEntityType(relation[0], entities);
      const endIpType = getEntityType(relation[1], entities);
      flows.push({
        'start': relation[0],
        'end': relation[1],
        'start_ip_type': startIpType,
        'start_ip_type_occurrences': getTypeOccurences(startIpType, entities),
        'end_ip_type': endIpType,
        'end_ip_type_occurrences': getTypeOccurences(endIpType, entities),
      });
    }
  });
  return flows;
};

/**
 * Decorate relations for chord flows
 * To draw a flow, it is needed to have x and y coordinates
 * Add attributes start_ip, entity_type, start_ip_type_occurrences
 * to use in flows tooltip information
 * @param {object} centroids
 * {
 *  10.20.11.21: [191.021, 79.02876],
 *  10.41.119.167: [45.021, 49.02876],
 *  104.27.11.21: [131.021, 29.02876],
 * }
 * @param {array} flows
 * @return {string}
 */
export const augmentDataFlows = (centroids, flows) =>
  flows.filter(flow => (centroids[flow.start] && centroids[flow.end]) &&
    (centroids[flow.start][0] !== centroids[flow.end][0]
      && centroids[flow.start][1] !== centroids[flow.end][1]))
    .map(flow => ([
      {
        'start_ip': flow.start,
        'x': centroids[flow.start][0],
        'y': centroids[flow.start][1],
        'entity_type': flow.start_ip_type,
        'start_ip_type_occurrences': flow.start_ip_type_occurrences,
      },
      { 'x': -1 * centroids[flow.end][0], 'y': -1 * centroids[flow.end][1] },
      { 'x': -1 * centroids[flow.start][0], 'y': -1 * centroids[flow.start][1] },
      {
        'end_ip': flow.end,
        'x': centroids[flow.end][0],
        'y': centroids[flow.end][1],
        'entity_type': flow.end_ip_type,
        'end_ip_type_occurrences': flow.end_ip_type_occurrences,
      },
    ]));

/**
 * Decide a flow behavior by checking the start ip's behavior and end ip's behavior
 * @param {string} startBehavior
 * @param {string} endBehavior
 * @return {string} 'malicious'/ 'suspicious' / 'unknown'
 */
export const getFlowBehavior = (startBehavior, endBehavior) => {
  const start = startBehavior || '';
  const end = endBehavior || '';
  if (start.toLowerCase() === 'malicious' || end.toLowerCase() === 'malicious') {
    return 'malicious';
  }
  if (start.toLowerCase() === 'suspicious' || end.toLowerCase() === 'suspicious') {
    return 'suspicious';
  }
  return 'unknown';
};
