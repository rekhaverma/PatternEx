import getSource from './get-source';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('get-source', () => {
  it('should return default log source', () => {
    const mockData = {
      top_n_features: ['count_malware', 'sld_length', 'tld_frequency'],
    };

    expect(getSource('domain', mockData)).toEqual('panw');
  });

  it('should return log source from to_n_features', () => {
    const mockData = {
      top_n_features: { 'tot_dns_requests': 2 },
    };

    expect(getSource('sipdomain', mockData)).toEqual('dns');
  });
});