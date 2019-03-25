import getPercent from './get-percent';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('get-percent', () => {
  it('should return percent', () => {
    expect(getPercent(100, 20)).toBe('20.00');
  });

});