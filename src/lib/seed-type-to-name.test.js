import seedTypeToName from './seed-type-to-name';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('seed-type-to-name', () => {
  it('should return name of seed `suspicious`', () => {
    expect(seedTypeToName('suspicious')).toEqual('Suspicious');
  });
  it('should return name of seed `malicious`', () => {
    expect(seedTypeToName('malicious')).toEqual('Malicious');
  });
  it('should return name of seed `label`', () => {
    expect(seedTypeToName('label')).toEqual('Label');
  });
  it('should return name of seed `blocked`', () => {
    expect(seedTypeToName('blocked')).toEqual('Pattern generated');
  });
});