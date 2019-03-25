import namePretty from './name-pretty';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('name-pretty', () => {
  it('should return pretty name', () => {
    expect(namePretty('device_ip')).toBe('Device Ip');
  });
});