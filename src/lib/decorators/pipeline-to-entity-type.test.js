import pipelineToEntityType from './pipeline-to-entity-type';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('pipeline-to-entity-type', () => {

  it('should return entity type for useraccess', () => {

    expect(pipelineToEntityType('useraccess')).toEqual('username');
  });

  it('should return entity type for user', () => {

    expect(pipelineToEntityType('user')).toEqual('user');
  });

  it('should return entity type for sipdip', () => {

    expect(pipelineToEntityType('sipdip')).toEqual('sipdip');
  });

  it('should return entity type for domain', () => {

    expect(pipelineToEntityType('domain')).toEqual('domain');
  });

  it('should return entity type for sipdomain', () => {

    expect(pipelineToEntityType('sipdomain')).toEqual('sipdomain');
  });

  it('should return entity type for request', () => {

    expect(pipelineToEntityType('request')).toEqual('request');
  });

  it('should return entity type for username', () => {

    expect(pipelineToEntityType('username')).toEqual('username');
  });

  it('should return entity type for dip', () => {

    expect(pipelineToEntityType('dip')).toEqual('ip');
  });

  it('should return entity type for sip', () => {

    expect(pipelineToEntityType('sip')).toEqual('ip');
  });

  it('should return entity type for hpa', () => {

    expect(pipelineToEntityType('hpa')).toEqual('ip');
  });

});