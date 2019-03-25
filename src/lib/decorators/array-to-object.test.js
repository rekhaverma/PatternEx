import arrayToObject from './array-to-object';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('array-to-object', () => {
  it('should return object instead of array', () => {
    const mockData = [
      {
        alert: 'True',
        id: '8b176bac-31a5-497f-8983-e2ff8c1e937a',
        severity: 2,
      }];

    const expectedData = {
      '8b176bac-31a5-497f-8983-e2ff8c1e937a':
        {
          alert: 'True',
          id: '8b176bac-31a5-497f-8983-e2ff8c1e937a',
          severity: 2,
        },
    };
    expect(arrayToObject(mockData, 'id')).toEqual(expectedData);
  });
});