import findEntityName from './find-entity-name';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
const mockData = {
  srcip: '10.202.45.175',
  dstip: '23.41.93.69',
  ipv4: 'ipv4',
  user_id: 1,
  user: 'demo',
  domain: 'demo.com',
  source_ip: '123.123.123.0',
  uid: 'demo-uid-test',
};
describe('find-entity-name', () => {

  it('should return entity name for sip', () => {
    const expectedData = '10.202.45.175';

    expect(findEntityName('sip', mockData)).toEqual(expectedData);
  });

  it('should return entity name for sipdip', () => {
    const expectedData = '10.202.45.175 23.41.93.69';

    expect(findEntityName('sipdip', mockData)).toEqual(expectedData);
  });

  it('should return entity name for dip', () => {
    const expectedData = '23.41.93.69';

    expect(findEntityName('dip', mockData)).toEqual(expectedData);
  });

  it('should return entity name for hpa', () => {
    const expectedData = 'ipv4';

    expect(findEntityName('hpa', mockData)).toEqual(expectedData);
  });

  it('should return entity name for user', () => {
    const expectedData = 1;

    expect(findEntityName('user', mockData)).toEqual(expectedData);
  });

  it('should return entity name for useraccess', () => {
    const expectedData = 'demo';

    expect(findEntityName('useraccess', mockData)).toEqual(expectedData);
  });

  it('should return entity name for username', () => {
    const expectedData = 'demo';

    expect(findEntityName('username', mockData)).toEqual(expectedData);
  });

  it('should return entity name for domain', () => {
    const expectedData = 'demo.com';

    expect(findEntityName('domain', mockData)).toEqual(expectedData);
  });

  it('should return entity name for sipdomain', () => {
    const expectedData = '10.202.45.175 demo.com';

    expect(findEntityName('sipdomain', mockData)).toEqual(expectedData);
  });

  it('should return entity name for request', () => {
    const expectedData = '123.123.123.0 demo-uid-test';

    expect(findEntityName('request', mockData)).toEqual(expectedData);
  });
});