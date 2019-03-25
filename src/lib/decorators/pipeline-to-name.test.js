import pipelineToName from './pipeline-to-name';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('pipeline-to-name', () => {

  it('should return nice name for useraccess', () => {

    expect(pipelineToName('useraccess')).toEqual('User Access');
  });
  it('should return nice name for user access', () => {

    expect(pipelineToName('user access')).toEqual('User Access');
  });

  it('should return nice name for user', () => {

    expect(pipelineToName('user')).toEqual('User');
  });

  it('should return nice name for sipdip', () => {

    expect(pipelineToName('sipdip')).toEqual('Connection');
  });

  it('should return nice name for domain', () => {

    expect(pipelineToName('domain')).toEqual('Domain');
  });

  it('should return nice name for sipdomain', () => {

    expect(pipelineToName('sipdomain')).toEqual('Session');
  });

  it('should return nice name for request', () => {

    expect(pipelineToName('request')).toEqual('Request');
  });

  it('should return nice name for username', () => {

    expect(pipelineToName('username')).toEqual('Username');
  });

  it('should return nice name for dip', () => {

    expect(pipelineToName('dip')).toEqual('Destination IP');
  });

  it('should return nice name for sip', () => {

    expect(pipelineToName('sip')).toEqual('Source IP');
  });

  it('should return nice name for hpa', () => {

    expect(pipelineToName('hpa')).toEqual('HPA');
  });

  it('should return nice name for login', () => {

    expect(pipelineToName('login')).toEqual('HPA');
  });

  it('should return nice name for ip', () => {

    expect(pipelineToName('ip')).toEqual('IP');
  });

});