import {
  getZeppelinDataFromReport,
  getZeppelinNoteBookReportIdId,
} from './utils';

import { logsDataMock } from '../mockData';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('evp-utils', () => {
  describe('getZeppelinNoteBookReportIdId', () => {
    it('should return the report id', () => {
      const mockData = [
        {
          id: '2DDJT1RB1',
          name: 'Tenable Report',
        },
      ];
      const reportId = getZeppelinNoteBookReportIdId(mockData, 'Tenable Report');
      expect(reportId).toBe('2DDJT1RB1');
    });

    it('should return false', () => {
      const reportId = getZeppelinNoteBookReportIdId([], 'Tenable Report');
      expect(reportId).toBe(false);
    });
  });

  describe('getZeppelinDataFromReport', () => {
    it('should return results', () => {
      const mockData = {
        paragraphs: [
          {}, {},
          {
            results: {
              code: 'SUCCESS',
              msg: [{ 'type': 'TABLE', 'data': logsDataMock }],
            },
          },
        ],
      };
      const expectedData = { 'destination_ip': '176.57.214.103', 'destination_port': '80', 'source_ip': '10.12.28.102', 'timestamp': '2017/12/28 17:38:28' };
      const report = getZeppelinDataFromReport(mockData, 2);
      expect(report[0]).toEqual(expectedData);
    });
    it('should return empty array', () => {
      const mockData = {
        paragraphs: [
          {}, {},
          {
            results: {
              code: 'SUCCESS',
              msg: [{ 'type': 'TABLE', 'data': 'plugin\tplugin_name\tfamily\tseverity\tip_addr\tnetbios_name\tdns_name\n' }],
            },
          },
        ],
      };
      const report = getZeppelinDataFromReport(mockData, 2);
      expect(report).toEqual([]);
    });
  });
});