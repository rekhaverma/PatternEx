import smartNumber from './smart-number';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
const number = 190.9;
describe('smart-number', () => {
  it('should return number w/o format', () => {
    expect(smartNumber(number)).toBe('190.9');
  });

  it('should return with `K` format', () => {
    expect(smartNumber(number * (10 ** 3))).toBe('190.9 K');
  });

  it('should return with `M` format', () => {
    expect(smartNumber(number * (10 ** 6))).toBe('190.9 M');
  });

  it('should return with `B` format', () => {
    expect(smartNumber(number * (10 ** 9))).toBe('190.9 B');
  });
});