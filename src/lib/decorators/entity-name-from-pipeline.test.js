import entityNameFromPipeline from './entity-name-from-pipeline';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('entity-name-from-pipeline', () => {
  it('should return srcip by default', () => {
    const mockData = {
      pipeline: 'sip',
      entity_name: 'demo',
    };

    const expectedData = {
      domain: null,
      srcip: 'demo',
    };

    expect(entityNameFromPipeline(mockData)).toEqual(expectedData);
  });

  it('should return domain for pipeline domain', () => {
    const mockData = {
      pipeline: 'domain',
      entity_name: 'demo',
    };

    const expectedData = {
      domain: 'demo',
      srcip: null,
    };

    expect(entityNameFromPipeline(mockData)).toEqual(expectedData);
  });

  it('should return srcip and domain for pipeline sipdomain', () => {
    const mockData = {
      pipeline: 'sipdomain',
      entity_name: 'srcip domain',
    };

    const expectedData = {
      domain: 'domain',
      srcip: 'srcip',
    };

    expect(entityNameFromPipeline(mockData)).toEqual(expectedData);
  });

  it('should return srcip and domain for pipeline sipdip', () => {
    const mockData = {
      pipeline: 'sipdip',
      entity_name: 'srcip',
    };

    const expectedData = {
      domain: null,
      srcip: 'srcip',
    };

    expect(entityNameFromPipeline(mockData)).toEqual(expectedData);
  });
});