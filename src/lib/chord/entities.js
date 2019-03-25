
/**
 * Return true if type is one of 'srcip', 'dstip', 'domain', 'user'
 * @param {string} type
 * @return {boolean}
 */
export const isEntityType = type => ['srcip', 'dstip', 'domain', 'user'].indexOf(type.toString().toLowerCase()) !== -1;

/**
 * Return division of arrayLength to total
 * @param {number} arrayLength
 * @param {number} total
 * @return {number}
 */
export const calculatePercentage = (arrayLength, total) => arrayLength / total;

/**
 * Get an array of objects and return their behavior
 * Behavior priority is malicious > suspicious > unknown
 * @param {array} entities
 * @return {string}
 */
export const getBehavior = (entities) => {
  let isMalicious = false;
  let isSuspicious = false;
  entities.forEach((entity) => {
    if (entity.behavior && entity.behavior.toLowerCase() === 'malicious') {
      isMalicious = true;
    } else if (entity.behavior && entity.behavior.toLowerCase() === 'suspicious') {
      isSuspicious = true;
    }
  });
  if (isMalicious) {
    return 'malicious';
  }
  if (isSuspicious) {
    return 'suspicious';
  }
  return 'unknown';
};

/**
  Create groups of entities filtered by entity_type
  Return array example:
  [
    [{entity_1}, {entity_2}],           // complete object
    0.16,                               // entity_type_percentage
    "user",                             // entity_type
    "malicious",                        // behavior
  ],
 * @param {array} array
 * @param {string} pipeline
 * @return {array}
 */
export const getPipeline = (array, pipeline) => {
  const pipelineArray = array.filter(item => item.entity_type === pipeline);
  if (pipelineArray.length > 0) {
    return [
      pipelineArray,
      calculatePercentage(pipelineArray.length, array.length),
      pipeline,
      getBehavior(pipelineArray),
    ];
  }
  return [];
};


/**
 * Return array of arrays grouped by their entity_type
 * @param {array} entities
 * @return {array} of arrays
 */
export const getEntities = entities => [
  getPipeline(entities, 'dstip'),
  getPipeline(entities, 'domain'),
  getPipeline(entities, 'srcip'),
  getPipeline(entities, 'user'),
].filter(el => el !== null && el.length > 0);

/**
 * Hypotenuse formula
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
export const calcHypotenuse = (x, y) => Math.sqrt((x * x) + (y * y));

/**
 * Count behavior of type entityBehavior from entities
 * @param {array} entities
 * @param {string} entityBehavior
 * @return {number}
 */
export const getBehaviorOccurrences = (entities, entityBehavior) => {
  let occurrences = 0;
  entities.forEach((entity) => {
    if (entity.behavior && entity.behavior.toLowerCase() === entityBehavior.toLowerCase()) {
      occurrences += 1;
    }
  });
  return occurrences;
};

/**
 * Create an array like:
  [
    [{entity_1},           // complete object
    0.16,                  // entity_type_percentage
    "user",                // entity_type
    "malicious",           // behavior
  ],
 *  for each entity found in openPipelines.
 * Is used to refactor data for clusters when a chord arc is opened
 * @param {array} data
 * @param {array} openPipelines
 * @return {array} of arrays grouped by entity_type
 */
export const ungroupOpenPipelines = (data, openPipelines) => {
  const entitiesData = data;

  let dataModif = [];
  if (openPipelines.length !== 0) {
    entitiesData.forEach((cluster) => {
      if (openPipelines.indexOf(cluster[2]) !== -1) {
        const newClustersPercent = calculatePercentage(
          cluster[1],
          cluster[0].length,
        );
        const pipelineName = cluster[2];
        const newClusters = cluster[0].map(item =>
          [[item], newClustersPercent, pipelineName, getBehavior([item])]);
        dataModif = [
          ...dataModif,
          ...newClusters,
        ];
      } else {
        dataModif = [
          ...dataModif,
          cluster,
        ];
      }
    });
    return dataModif;
  }
  return entitiesData;
};
