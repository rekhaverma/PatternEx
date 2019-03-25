import slugify from './slugify';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('slugify', () => {
  it('should return text slugified', () => {
    expect(slugify('demo demo')).toBe('demo-demo');
  });
});