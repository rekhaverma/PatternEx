import moment from 'moment';
import ptrxREST from 'lib/rest';

export default class DetectionMetrics {
  /**
   * Get the cached data from localStorage
   * @return {Object}
   */
  static getFromCache() {
    const cachedMetrics = localStorage.getItem('metrics');
    let parsed = {};
    try {
      parsed = JSON.parse(cachedMetrics);
    } catch (error) {
      // @todo: find a way to handle this error
    }
    return parsed || {};
  }

  /**
   * Cache the payload in localStorage
   *
   * @param {Object} payload
   */
  static setToCache(payload) {
    localStorage.setItem('metrics', JSON.stringify(payload));
  }


  /**
   * Because the period of time is the same, we are caching the response so
   * we only fetch it once a day. To know when we have a different day, we are
   * checking the endDate of the cached data with the current date.
   *
   * If we have a different date (not hour), we should fetch data again.
   *
   * @param {String} endDate
   * @return {Boolean}
   */
  static shouldRefetch(endDate) {
    const now = moment();
    const endDateMoment = moment(endDate);
    return !(endDateMoment.isSame(now, 'year')
      && endDateMoment.isSame(now, 'month')
      && endDateMoment.isSame(now, 'day'));
  }

  static getDataFromAPI({ startDate, endDate }) {
    return ptrxREST.get(`detectionmetrics?start_time=${startDate.format('X')}&end_time=${endDate.format('X')}`);
  }
}
