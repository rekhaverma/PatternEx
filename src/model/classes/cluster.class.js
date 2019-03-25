import moment from 'moment';
import ptrxREST, { fireMultipleRequests } from 'lib/rest';

/**
 * Get cluster relations in the time range
 *
 * @param {Moment} startDate
 * @param {Moment} endDate
 * @return {Array}
 */
const fetchRelations = async (start, end) => {
  const url = `cluster_relations?start_time=${start.format('X')}&end_time=${end.format('X')}`;

  try {
    const response = await ptrxREST.get(url);
    if (response.status >= 200 && response.status < 300) {
      return {
        ...response,
        'items': response.data.items.map((item) => {
          const clusterEntities = item.cluster_entities.reduce((acc, el) => ({
            ...acc,
            [el]: {},
          }), {});

          return {
            ...item,
            'cluster_entities': clusterEntities,
            'relations': {},
          };
        }),
      };
    }
    return [];
  } catch (error) {
    throw error;
  }
};

const fetchLabelsInCluster = async (clusterEntities) => {
  const baseUrl = '/labels/entity';
  const urls = Object.keys(clusterEntities).map(key => ({
    'url': `${baseUrl}?entity_name=${clusterEntities[key].entity_name}&entity_type=${clusterEntities[key].entity_type}`,
  }));

  const mergeMultipleResponses = responses => Object.keys(responses).reduce(
    (acc, key) => ({
      ...acc,
      'items': {
        ...acc.items,
        ...responses[key].data.items,
      },
    }),
    {},
  );

  try {
    const response = await fireMultipleRequests(urls, baseUrl, false);
    return mergeMultipleResponses(response);
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch related entities in a cluster
 *
 * @param {String} day
 * @param {Array} entities
 * @param {String} format
 */
const fetchEntitiesInCluster = async (day, clusterId, format = 'YYYY-MM-DD') => {
  const url = `cluster_entities/${moment.utc(day).format(format)}?cluster_id=${clusterId}`;

  try {
    const response = await ptrxREST.get(url);
    if (response.status >= 200 && response.status < 300) {
      const {
        limit,
        start,
        totalCount,
        items,
      } = response.data;

      // If we have to do a pagination
      if (limit < totalCount) {
        const paginationUrls = [];
        let endCount = start;

        // Create pagination urls based on url + start=NUM
        while (endCount < totalCount) {
          endCount += limit;
          if (endCount < totalCount) {
            paginationUrls.push(`${url}&start=${endCount}`);
          }
        }

        // Fire all requests
        const paginationResponse = await Promise
          .all(paginationUrls.map(async req => ptrxREST.get(req)));

        // Return items concatenated
        return items.concat(paginationResponse.map(resp => resp.data.items));
      }

      return items;
    }
    return [];
  } catch (error) {
    throw (error);
  }
};

/**
 * Find the cluster with "cluster_id" equal to <id> if not, return an empty object.
 *
 * @param {Array} clusters
 * @param {String} id
 */
const getById = (clusters, id) => {
  const find = clusters.filter(el => el.cluster_id.toLowerCase() === id.toLowerCase());
  if (Array.isArray(find) && find.length > 0) {
    return find[0];
  }
  return {};
};

export default {
  'getById': getById,
  'fetchLabelsInCluster': fetchLabelsInCluster,
  'fetchRelations': fetchRelations,
  'fetchEntitiesInCluster': fetchEntitiesInCluster,
};
