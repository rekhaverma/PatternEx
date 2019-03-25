import moment from 'moment';

import isSameDate from './is-same-date';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('is-same-date', () => {
  it('should return true since the dates are the same', () => {
    expect(isSameDate(moment.utc('2018-08-02'), moment.utc('2018-08-02'))).toBe(true);
  });

  it('should return false since the dates aren\'t the same', () => {
    expect(isSameDate(moment.utc('2018-08-02'), moment.utc('2018-08-03'))).toBe(false);
  });
});