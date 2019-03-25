import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';

import ptrxREST from 'lib/rest/index';
import reportActions from './actions';
import { fetchReports, fetchReportSummary, createReport, updateReport, deleteReport, getReportById, fetchReportResults, fetchReportResultsCSV, onDemandPost } from './reports.actions';

jest.mock('model/actions/ui.actions', () => ({ addNotification: jest.fn(() => jest.fn()) }));

const mockStore = configureMockStore([thunk]);

describe('reports action: ', () => {
  beforeEach(() => moxios.install(ptrxREST));
  afterEach(() => moxios.uninstall(ptrxREST));

  it('should dispatch FETCH_REPORTS_SUCCESS action when fetching reports has been done', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          type: reportActions.FETCH_REPORTS,
        },
        {
          type: reportActions.FETCH_REPORTS_SUCCESS,
          payload: [{
            id: 1,
          }],
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      store.dispatch(fetchReports());

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            items: [{
              id: 1,
            }],
          },
        }).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });
  });

  it('should dispatch FETCH_REPORT_SUMMARY_SUCCESS action when fetching reportSummary has been done', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          type: reportActions.FETCH_REPORT_SUMMARY,
        },
        {
          type: reportActions.FETCH_REPORT_SUMMARY_SUCCESS,
          payload: [{
            id: 1,
          }],
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      const id = 'aldicidleikds8l39dkald';
      const params = {
        start_time: '1534238871',
        end_time: '1534238871',
        mode: 'batch',
      };

      store.dispatch(fetchReportSummary(id, params));

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: [{
            id: 1,
          }],
        }).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });
  });

  it('should dispatch CREATE_NEW_REPORT_SUCCESS action when creating new Report has been done', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          type: reportActions.CREATE_NEW_REPORT,
        },
        {
          type: reportActions.CREATE_NEW_REPORT_SUCCESS,
          payload: [{
            id: 1,
          }],
        },
        {
          type: reportActions.FETCH_REPORTS,
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      const params = {
        'pipeline': 'sip_byday',
        'name': 'string',
        'rules': ['string'],
        'mode': 'batch',
      };

      store.dispatch(createReport(params));

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 201,
          response: [{
            id: 1,
          }],
        }).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });
  });

  it('should dispatch EDIT_REPORT_SUCCESS action when updating Report has been done', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          type: reportActions.EDIT_REPORT,
        },
        {
          type: reportActions.EDIT_REPORT_SUCCESS,
          payload: [{
            id: 1,
          }],
        },
        {
          type: reportActions.FETCH_REPORTS,
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      const id = 'alcilkdoiekc9k3idk';
      const params = {
        'name': 'string',
      };

      store.dispatch(updateReport(id, params));

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 201,
          response: [{
            id: 1,
          }],
        }).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });
  });

  it('should dispatch DELETE_REPORT_SUCCESS action when deleting Report has been done', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          type: reportActions.DELETE_REPORT,
        },
        {
          type: reportActions.DELETE_REPORT_SUCCESS,
          payload: [{
            id: 1,
          }],
        },
        {
          type: reportActions.FETCH_REPORTS,
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      const id = 'alcilkdoiekc9k3idk';

      store.dispatch(deleteReport(id));

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 204,
          response: [{
            id: 1,
          }],
        }).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });
  });

  it('should dispatch GET_REPORT_BYID_SUCCESS action when fetching Report by id has been done', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          type: reportActions.GET_REPORT_BYID,
        },
        {
          type: reportActions.GET_REPORT_BYID_SUCCESS,
          payload: [{
            id: 1,
          }],
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      const id = 'alcilkdoiekc9k3idk';

      store.dispatch(getReportById(id));

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: [{
            id: 1,
          }],
        }).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });
  });

  it('should dispatch FETCH_REPORT_RESULTS_SUCCESS action when fetching report results has been done', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          type: reportActions.FETCH_REPORT_RESULTS,
        },
        {
          type: reportActions.FETCH_REPORT_RESULTS_SUCCESS,
          payload: [{
            id: 1,
          }],
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      const id = 'alcilkdoiekc9k3idk';
      const params = {
        'time_start': '1534238871',
        'time_end': '1534238871',
        'limit': 10,
      };

      store.dispatch(fetchReportResults(id, params));

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: [{
            id: 1,
          }],
        }).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });
  });

  it('should dispatch FETCH_REPORT_RESULTS_CSV_SUCCESS action when fetching report results csv has been done', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          type: reportActions.FETCH_REPORT_RESULTS_CSV,
        },
        {
          type: reportActions.FETCH_REPORT_RESULTS_CSV_SUCCESS,
          payload: 'file/url',
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      const id = 'alcilkdoiekc9k3idk';
      const params = {
        'time_start': '1534238871',
        'time_end': '1534238871',
        'limit': 10,
        'csv_download': true,
      };

      store.dispatch(fetchReportResultsCSV(id, params));

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            file_url: 'file/url',
          },
        }).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });
  });

  it('should dispatch ON_DEMAND_SUCCESS action when running report has been done', (done) => {
    moxios.withMock(() => {
      const expectedActions = [
        {
          type: reportActions.ON_DEMAND,
        },
        {
          type: reportActions.ON_DEMAND_SUCCESS,
        },
      ];

      const store = mockStore({
        mockStore: [],
      });

      const id = 'alcilkdoiekc9k3idk';
      const params = {
        'start_date': '1534238871',
        'end_date': '1534238871',
        'mode': 'batch',
        'pipeline': 'sip_byday',
      };

      store.dispatch(onDemandPost(id, params));

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
        }).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });
  });
});
