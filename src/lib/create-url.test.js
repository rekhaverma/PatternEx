import createUrl from './create-url';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('create-url', () => {
  it('should return the url from object', () => {
    const mockParams = {
      prop: 1,
      prop2: 2,
    };

    expect(createUrl('path', mockParams)).toBe('path?prop=1&prop2=2');
  });
});