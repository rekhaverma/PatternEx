import moxios from 'moxios';
import moment from 'moment';

import { ptrxREST } from '../constants';
import clusters from './clusters.model';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('clusters', () => {
  beforeEach(() => moxios.install(ptrxREST));
  afterEach(() => moxios.uninstall(ptrxREST));

  it('should return data from request for getClusterRelations', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [
          {
            id: 1,
          }],
      });
    });
    const data = await clusters.getClusterRelations(moment.utc('2018-08-03'), moment.utc('2018-08-03'));
    expect(data).toEqual([{ id: 1 }]);

  });
});