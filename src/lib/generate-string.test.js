import generateString from './generate-string';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('generate-string', () => {
  it('should return the random generated string with length 5', () => {
    const string = generateString();

    expect(string.length).toBe(5);
  });
});