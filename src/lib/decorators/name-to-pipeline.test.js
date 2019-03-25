import nameToPipeline from './name-to-pipeline';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('name-to-pipeline.test', () => {

  it('should return pipeline for source ip', () => {

    expect(nameToPipeline('source ip')).toEqual('sip');
  });

  it('should return pipeline for destination ip', () => {

    expect(nameToPipeline('destination ip')).toEqual('dip');
  });

  it('should return pipeline for connection', () => {

    expect(nameToPipeline('connection')).toEqual('sipdip');
  });

  it('should return pipeline for session', () => {

    expect(nameToPipeline('session')).toEqual('sipdomain');
  });

  it('should return pipeline for user access', () => {

    expect(nameToPipeline('user access')).toEqual('useraccess');
  });

  it('should return pipeline for user name', () => {

    expect(nameToPipeline('user name')).toEqual('username');
  });

  it('should return pipeline for domain', () => {

    expect(nameToPipeline('domain')).toEqual('domain');
  });

  it('should return pipeline for user', () => {

    expect(nameToPipeline('user')).toEqual('user');
  });

  it('should return pipeline for hpa', () => {

    expect(nameToPipeline('hpa')).toEqual('hpa');
  });

  it('should return pipeline for login', () => {

    expect(nameToPipeline('login')).toEqual('login');
  });

  it('should return pipeline for request', () => {

    expect(nameToPipeline('request')).toEqual('request');
  });

});