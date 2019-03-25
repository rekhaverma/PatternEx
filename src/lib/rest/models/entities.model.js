import ptrxREST from '../index';

/**
 * @todo: check if this class used
 */
export default class EntitiesRequests {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  /**
   * Method used to create a promise for each URL in urls parameter.
   * For each promise we will make a GET request at URL and we will
   * return a flatten array with response 'items'.
   *
   * E.g. of urls: ['cluster_entities/2017-09-26', 'cluster_entities/2017-09-27']
   *
   * @static
   * @param {Array} urls          Array of URL
   * @returns { Array }           Array of entities
   * @memberof EntitiesRequests
   */
  static async fetchAll(urls) {
    try {
      return await Promise.all(urls.map(async (req) => {
        const response = await ptrxREST.get(req.url);
        return response.data;
      }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Method used as success callback in a try/catch. If the request(s) succeeds,
   * we will also dispatch an COMPLETE action with the respective response as payload.
   *
   * @param {Array} response        Response of request(s)
   * @param {String} type           Action type
   * @returns {Array}
   * @memberof EntitiesRequests
   */
  onSuccess(response, type) {
    this.dispatch({ 'type': type, 'payload': response });
    return response;
  }

  /**
   * Method used as failed callback in a try/catch. If the request(s) fails,
   * we will also dispatch an FAILED action with the respective error as payload.
   *
   * @param {any} error             Response of request(s)
   * @param {any} type              Action type
   * @returns
   * @memberof EntitiesRequests
   */
  onError(error, type) {
    this.dispatch({ 'type': type, 'payload': error.message });
    throw error;
  }
}
