import removeFromArray from './remove-from-array';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('remove-from-array', () => {
  it('should return array without element from first position', () => {
    const mockArray = [1, 2, 3];
    expect(removeFromArray(mockArray, 1)).toEqual([2, 3]);
  });
  it('should return array without element from center of array', () => {
    const mockArray = [1, 2, 3];
    expect(removeFromArray(mockArray, 2)).toEqual([1, 3]);
  });
  it('should return array without element from last position', () => {
    const mockArray = [1, 2, 3];
    expect(removeFromArray(mockArray, 3)).toEqual([1, 2]);
  });
});