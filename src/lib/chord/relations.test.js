import {
  augmentDataFlows,
  checkForDuplicatedPaths, decorateFlowsData,
  getEntityType, getFlowBehavior, getTypeOccurences,
} from './relations';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('relations', () => {
  describe('checkForDuplicatedPaths function', () => {
    it('should return true because new flow exists in array', () => {
      const mockData = [
        {
          start: '10.20.11.10',
          end: '10.21.22.10',
        }];

      const newFlow = ['10.20.11.10', '10.21.22.10'];

      expect(checkForDuplicatedPaths(mockData, newFlow)).toBe(true);
    });

    it('should return false because new flow doesn\'t exists in array', () => {
      const mockData = [
        {
          start: '10.20.11.10',
          end: '10.21.22.10',
        }];
      const newFlow = ['10.20.11.11', '10.21.22.10'];

      expect(checkForDuplicatedPaths(mockData, newFlow)).toBe(false);
    });
  });

  describe('getEntityType function', () => {
    it('should return entity type from entities array', () => {
      const mockData = [
        {
          entity_name: '10.20.11.10',
          entity_type: 'demo',
        }];

      expect(getEntityType('10.20.11.10', mockData)).toBe('demo');
    });

    it('should return empty string, because entity name doesn\'t exists', () => {
      const mockData = [
        {
          entity_name: '10.20.11.10',
          entity_type: 'demo',
        }];

      expect(getEntityType('10.20.11.11', mockData)).toBe('');
    });
  });

  describe('getTypeOccurences function', () => {
    it('should return one occurence', () => {
      const mockData = [
        {
          entity_name: '10.20.11.10',
          entity_type: 'demo',
        }];

      expect(getTypeOccurences('demo', mockData)).toBe(1);
    });

    it('should return zero occurences', () => {
      const mockData = [
        {
          entity_name: '10.20.11.10',
          entity_type: 'demo',
        }];

      expect(getTypeOccurences('10.20.11.11', mockData)).toBe(0);
    });
  });

  describe('decorateFlowsData function', () => {
    it('should return flow data', () => {
      const mockData1 = [['220.243.196.76', 'benlailife.com'], ['global\\jingguo', '10.133.221.99'], ['10.133.221.99', '220.243.196.76']];
      const mockData2 = [
        {
          cluster_id: '29799900-429a-38e4-b4c9-fe4cc87c448c',
          tag_id: null,
          is_central_entity: false,
          pipeline: null,
          domain: null,
          entity_name: '10.133.221.99',
          last_ts: 'Mon, 16 Oct 2017 00:00:00 -0000',
          feature_vector: null,
          first_ts: 'Mon, 16 Oct 2017 00:00:00 -0000',
          ac_behavior: null,
          behavior: null,
          ac_score: 1,
          entity_type: 'srcip',
          ts: 'Mon, 16 Oct 2017 00:00:00 -0000',
          threat_tactic: '',
        },
        {
          cluster_id: '29799900-429a-38e4-b4c9-fe4cc87c448c',
          tag_id: null,
          is_central_entity: false,
          pipeline: null,
          domain: null,
          entity_name: 'global\\jingguo',
          last_ts: 'Mon, 16 Oct 2017 00:00:00 -0000',
          feature_vector: null,
          first_ts: 'Mon, 16 Oct 2017 00:00:00 -0000',
          ac_behavior: null,
          behavior: null,
          ac_score: 1,
          entity_type: 'user',
          ts: 'Mon, 16 Oct 2017 00:00:00 -0000',
          threat_tactic: '',
        }];
      const expectedData = [
        {
          end: 'benlailife.com',
          end_ip_type: '',
          end_ip_type_occurrences: 0,
          start: '220.243.196.76',
          start_ip_type: '',
          start_ip_type_occurrences: 0,
        },
        {
          end: '10.133.221.99',
          end_ip_type: 'srcip',
          end_ip_type_occurrences: 1,
          start: 'global\\jingguo',
          start_ip_type: 'user',
          start_ip_type_occurrences: 1,
        },
        {
          end: '220.243.196.76',
          end_ip_type: '',
          end_ip_type_occurrences: 0,
          start: '10.133.221.99',
          start_ip_type: 'srcip',
          start_ip_type_occurrences: 1,
        }];

      expect(decorateFlowsData(mockData1, mockData2)).toEqual(expectedData);
    });
  });

  describe('augmentDataFlows function', () => {
    it('should return augmented data', () => {
      const mockData1 = { 'benlailife.com': [220, 0], 'global\\jingguo': [-220, 2.694222958124177e-14] };
      const mockData2 = [
        {
          start: '220.243.196.76',
          end: 'benlailife.com',
          start_ip_type: 'dstip',
          start_ip_type_occurrences: 1,
          end_ip_type: 'domain',
          end_ip_type_occurrences: 1,
        },
        {
          start: 'global\\jingguo',
          end: '10.133.221.99',
          start_ip_type: 'user',
          start_ip_type_occurrences: 1,
          end_ip_type: 'srcip',
          end_ip_type_occurrences: 1,
        },
        {
          start: '10.133.221.99',
          end: '220.243.196.76',
          start_ip_type: 'srcip',
          start_ip_type_occurrences: 1,
          end_ip_type: 'dstip',
          end_ip_type_occurrences: 1,
        }];
      const expectedData = [];

      expect(augmentDataFlows(mockData1, mockData2)).toEqual(expectedData);
    });
  });

  describe('getFlowBehavior function', () => {
    it('should return malicious', () => {
      expect(getFlowBehavior('malicious', 'malicious')).toBe('malicious');
    });

    it('should return suspicious', () => {
      expect(getFlowBehavior('suspicious', 'suspicious')).toBe('suspicious');
    });

    it('should return unknown', () => {
      expect(getFlowBehavior('', '')).toBe('unknown');
    });
  });
});