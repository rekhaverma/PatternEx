import numberPretty from './number-pretty';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('number-pretty', () => {
  it('should return pretty number - w/o decimals', () => {
    expect(numberPretty(200279)).toBe('200,279');
  });

  it('should return pretty number - with decimals', () => {
    expect(numberPretty(200279.3243)).toBe('200,279.3243');
  });
});