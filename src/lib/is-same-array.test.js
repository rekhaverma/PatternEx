import isSameArray from './is-same-array';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('is-same-array', () => {
  it('should return true since the arrays are the same', () => {
    expect(isSameArray([{ id: 1 }], [{ 'id': 1 }])).toBe(true);
  });

  it('should return false since the arrays aren\'t the same', () => {
    expect(isSameArray([], [{}])).toBe(false);
  });
});