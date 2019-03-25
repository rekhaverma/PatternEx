import longPolling from './long-polling';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('long-polling', () => {
  it('should return the success status (200)', async () => {
    const mockFn = () => ({
      status: 200,
    });
    expect(await longPolling(mockFn)).toEqual({
      status: 200,
    });
  });
});