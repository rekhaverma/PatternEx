import objectToArray from './object-to-array';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('object-to-array', () => {
  it('should return array from object', () => {
    const mockData = {
      demo: 'demo',
      another: 'another',
    };
    expect(objectToArray(mockData)).toEqual(['demo', 'another']);
  });

});