import moxios from 'moxios';
import moment from 'moment';
import { fromJS } from 'immutable';

import ptrxREST from 'lib/rest/index';

import { getUrl, getItems, getHash } from './utils';

const startTime = moment.utc('2018-03-11').unix();
const endTime = moment.utc('2018-03-11').unix();

const mockData = {
  'startTime': startTime,
  'endTime': endTime,
  'params': {
    'pipeline': 'sip',
  },
};

describe('dashboard-utils', () => {
  beforeEach(() => moxios.install(ptrxREST));
  afterEach(() => moxios.uninstall(ptrxREST));

  describe('getUrl function', () => {
    it('should return the correct URL', () => {
      const urlCreated = getUrl(mockData.startTime, mockData.endTime, mockData.params);
      expect(urlCreated).toBe('maliciousbehavior?start_time=1520726400&end_time=1520726400');
    });
  });

  describe('getItems function', () => {
    it('should return an items object', () => {
      const items = getItems(mockData.startTime, mockData.endTime, mockData.params);

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            items: [
              {
                id: 1,
              },
            ],
          },
        })
          .then(() => {
            expect(items).toEqual({});
          });
      });
    });
  });

  describe('getHash function', () => {
    it('should return a hash', () => {
      const store = {
        raw: fromJS({
          maliciousBehaviorHash: 'hash',
          maliciousBehavior: [],
        }),
      };

      const getStore = () => store;
      const hash = getHash(getStore, mockData.startTime, mockData.endTime, 'malicious', mockData.params);
      expect(hash).toEqual('20180311/20180311#malicious&pipeline=sip');
    });
  });
});
