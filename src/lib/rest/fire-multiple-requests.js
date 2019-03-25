import { ptrxREST } from './constants';

/**
 * Use this function if you want to fire multiple requests
 * @param {Array} urls
 * @param endpoint
 * @param pagination
 * @returns {Promise<any[]>}
 * @todo: check if this method is used
 */
export const fireMultipleRequests = async (urls, endpoint, pagination = true) => {
  try {
    return await Promise.all(urls.map(async (req) => {
      const response = await ptrxREST.get(req.url);
      const { limit, start, totalCount } = response.data;

      if (pagination && limit <= totalCount) {
        const paginationUrls = [];
        let endCount = start;

        while (endCount < totalCount) {
          endCount += limit;
          if (endCount < totalCount) {
            paginationUrls.push({
              'url': `${endpoint}?create_time=${req.date}&start=${endCount}`,
              'date': req.date,
            });
          }
        }

        const paginationResponse = await fireMultipleRequests(paginationUrls, endpoint, false);

        return {
          'data': {
            'items': response.data.items.concat(paginationResponse.reduce((acc, el) => acc.concat(el.data.items), [])),
          },
          'day_ts': req.date,
        };
      }

      return {
        'data': {
          'items': response.data.items,
        },
        'day_ts': req.date,
      };
    }));
  } catch (error) {
    throw (error);
  }
};
