import { logsDataMock } from 'model/actions/mockData';

import parseParagrahToJson from './parse-paragraph-to-json';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('parse-paragraph-to-json', () => {
  it('should return the formatted json', () => {
    const expectedData = {
      destination_ip: '176.57.214.103',
      destination_port: '80',
      source_ip: '10.12.28.102',
      timestamp: '2017/12/28 17:38:28',
    };
    expect(parseParagrahToJson(logsDataMock)[0]).toEqual(expectedData);
  });
});