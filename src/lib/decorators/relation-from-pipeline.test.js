import relationFromPipeline from './relation-from-pipeline';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('relation-from-pipeline', () => {
  it('should return nice name for user', () => {
    const mockData = {
      pipeline: 'user',
      entityName: 'entityName',
      entityType: 'entityType',
    };
    const expectedData = {
      entityName: 'entityName',
      entityType: 'entityType',
      relatedType: 'ip',
      relation: undefined,
      targetPipeline: 'hpa',
    };

    expect(relationFromPipeline(mockData)).toEqual(expectedData);
  });
  it('should return nice name for useraccess', () => {
    const mockData = {
      pipeline: 'useraccess',
      entityName: 'entityName',
      entityType: 'entityType',
    };
    const expectedData = {
      entityName: 'entityName',
      entityType: 'entityType',
      relatedType: 'ip',
      relation: undefined,
      targetPipeline: 'sip',
    };

    expect(relationFromPipeline(mockData)).toEqual(expectedData);
  });
  it('should return nice name for sipdip', () => {
    const mockData = {
      pipeline: 'sipdip',
      entityName: 'entityName',
      entityType: 'entityType',
    };
    const expectedData = {
      entityName: 'entityName',
      entityType: 'ip',
      relatedType: 'ip',
      relation: 'sipdip',
      targetPipeline: 'dip',
    };

    expect(relationFromPipeline(mockData)).toEqual(expectedData);
  });
  it('should return nice name for dip', () => {
    const mockData = {
      pipeline: 'dip',
      entityName: 'entityName',
      entityType: 'entityType',
    };
    const expectedData = {
      entityName: 'entityName',
      entityType: 'entityType',
      relatedType: 'ip',
      relation: 'dipsip',
      targetPipeline: 'sip',
    };

    expect(relationFromPipeline(mockData)).toEqual(expectedData);
  });
  it('should return nice name for sip', () => {
    const mockData = {
      pipeline: 'sip',
      entityName: 'entityName',
      entityType: 'entityType',
    };
    const expectedData = {
      entityName: 'entityName',
      entityType: 'entityType',
      relatedType: 'ip',
      relation: 'sipdip',
      targetPipeline: 'dip',
    };

    expect(relationFromPipeline(mockData)).toEqual(expectedData);
  });
  it('should return nice name for hpa', () => {
    const mockData = {
      pipeline: 'hpa',
      entityName: 'entityName',
      entityType: 'entityType',
    };
    const expectedData = {
      entityName: 'entityName',
      entityType: 'entityType',
      relatedType: 'user',
      relation: undefined,
      targetPipeline: 'user',
    };

    expect(relationFromPipeline(mockData)).toEqual(expectedData);
  });
  it('should return nice name for domain', () => {
    const mockData = {
      pipeline: 'domain',
      entityName: 'entityName',
      entityType: 'entityType',
    };
    const expectedData = {
      entityName: 'entityName',
      entityType: 'entityType',
      relatedType: 'ip',
      relation: undefined,
      targetPipeline: 'sip',
    };

    expect(relationFromPipeline(mockData)).toEqual(expectedData);
  });
  it('should return nice name for sipdomain', () => {
    const mockData = {
      pipeline: 'sipdomain',
      entityName: 'entityName',
      entityType: 'entityType',
    };
    const expectedData = {
      entityName: 'entityName',
      entityType: 'ip',
      relatedType: 'domain',
      relation: undefined,
      targetPipeline: 'domain',
    };

    expect(relationFromPipeline(mockData)).toEqual(expectedData);
  });
});