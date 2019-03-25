import capitalizeFirstLetter from './capitalize-first-letter';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('capitalize-first-letter', () => {
  it('should return the first letter capitalize', () => {
    expect(capitalizeFirstLetter('demo demo')).toBe('Demo demo');
  });
});