import moment from 'moment';
import ptrxREST from 'lib/rest';


/**
 * Cluster model used to populate the Correlation View
 *
 * Fire Sequence:
 * 1) Fetch the cluster relations from time range
 * 2) For each cluster, fetch the cluster_entities on day_ts
 *
 */
export default class ClustersEndpoint {
  /**
   * Get cluster relations in the time range
   *
   * @param {Moment} startDate
   * @param {Moment} endDate
   * @return {Array}
   */
  static async getClusterRelations(startDate, endDate) {
    const url = `cluster_relations?start_time=${startDate.unix()}&end_time=${endDate.unix()}`;

    try {
      const response = await ptrxREST.get(url);

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }

      return [];
    } catch (error) {
      throw (error);
    }
  }

  /**
   * Fetch related entities in a cluster
   *
   * @param {String} day
   * @param {Array} entities
   * @param {String} format
   * @todo: check if this method is used
   */
  static async getEntitiesInCluster(day, entities, format = 'MM-DD-YYYY') {
    const defaultAcc = `cluster_entities/${moment(day).format(format)}`;
    const url = entities.reduce((acc, entity, index) => {
      const delimiter = index === 0 ? '?' : '&'; // If first entity put the '?'
      if (entity !== '') {
        return acc.concat(`${delimiter}entity_names=${entity}`);
      }

      return acc;
    }, defaultAcc);

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
  }
}
