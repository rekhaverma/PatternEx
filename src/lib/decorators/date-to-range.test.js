import moment from 'moment';

import dateToRange from './date-to-range';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('date-to-range', () => {
  it('should return array with urls from range', () => {
    const url = 'behavioursummary?create_time=';
    const startDate = moment.utc('2018-05-24');
    const endDate = moment.utc('2018-05-25');

    const expectedData = [
      { 'date': '05-24-2018', 'url': 'behavioursummary?create_time=05-24-2018' },
      { 'date': '05-25-2018', 'url': 'behavioursummary?create_time=05-25-2018' }];

    expect(dateToRange(url, startDate, endDate)).toEqual(expectedData);
  });
});