import {
  calcHypotenuse,
  calculatePercentage,
  getBehavior,
  getBehaviorOccurrences,
  getEntities,
  getPipeline,
  isEntityType, ungroupOpenPipelines,
} from './entities';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('entities', () => {
  describe('isEntityType function', () => {
    it('should return true when value send is `domain`', () => {
      expect(isEntityType('domain')).toBe(true);
    });

    it('should return false when value send is `sipdip`', () => {
      expect(isEntityType('sipdip')).toBe(false);
    });
  });

  describe('calculatePercentage function', () => {
    it('should return correct percentage', () => {
      expect(calculatePercentage(10, 50)).toBe(0.2);
    });
  });

  describe('getBehavior function', () => {
    it('should return malicious', () => {
      const mockData = [
        {
          behavior: 'malicious',
        }];
      expect(getBehavior(mockData)).toBe('malicious');
    });
    it('should return suspicious', () => {
      const mockData = [
        {
          behavior: 'suspicious',
        }];
      expect(getBehavior(mockData)).toBe('suspicious');
    });
    it('should return malicious', () => {
      const mockData = [
        {
          behavior: '',
        }];
      expect(getBehavior(mockData)).toBe('unknown');
    });
  });

  describe('getPipeline function', () => {
    it('should return correct data', () => {
      const mockData = [
        {
          entity_type: 'sip',
          behavior: 'malicious',
        }, {
          entity_type: 'dip',
          behavior: 'malicious',
        }, {
          entity_type: 'domain',
          behavior: 'malicious',
        }, {
          entity_type: 'request',
          behavior: 'malicious',
        }];

      const expectedResult = [[{ 'behavior': 'malicious', 'entity_type': 'sip' }], 0.25, 'sip', 'malicious'];

      expect(getPipeline(mockData, 'sip')).toEqual(expectedResult);
    });
  });

  describe('getEntities function', () => {
    it('should return correct data', () => {
      const mockData = [
        {
          entity_type: 'srcip',
          behavior: 'malicious',
        }, {
          entity_type: 'dstip',
          behavior: 'malicious',
        }, {
          entity_type: 'domain',
          behavior: 'malicious',
        }, {
          entity_type: 'user',
          behavior: 'malicious',
        }];

      const expectedResult = [
        [[{ 'behavior': 'malicious', 'entity_type': 'dstip' }], 0.25, 'dstip', 'malicious'],
        [[{ 'behavior': 'malicious', 'entity_type': 'domain' }], 0.25, 'domain', 'malicious'],
        [[{ 'behavior': 'malicious', 'entity_type': 'srcip' }], 0.25, 'srcip', 'malicious'],
        [[{ 'behavior': 'malicious', 'entity_type': 'user' }], 0.25, 'user', 'malicious']];

      expect(getEntities(mockData)).toEqual(expectedResult);
    });
  });

  describe('calcHypotenuse function', () => {
    it('should return correct hypotenuse', () => {
      expect(calcHypotenuse(3, 4)).toBe(5);
    });
  });

  describe('getBehaviorOccurrences function', () => {
    it('should return correct data', () => {
      const mockData = [
        {
          entity_type: 'sip',
          behavior: 'malicious',
        }, {
          entity_type: 'dip',
          behavior: 'malicious',
        }, {
          entity_type: 'domain',
          behavior: 'malicious',
        }, {
          entity_type: 'user',
          behavior: 'suspicious',
        }];

      expect(getBehaviorOccurrences(mockData, 'malicious')).toEqual(3);
    });
  });

  describe('ungroupOpenPipelines function', () => { //@todo: review this test
    it('should return correct data', () => {
      const mockData = [
        {
          entity_type: 'sip',
          behavior: 'malicious',
        }, {
          entity_type: 'dip',
          behavior: 'malicious',
        }, {
          entity_type: 'domain',
          behavior: 'malicious',
        }, {
          entity_type: 'user',
          behavior: 'malicious',
        }];

      const expectedResult = [
        { 'behavior': 'malicious', 'entity_type': 'sip' },
        { 'behavior': 'malicious', 'entity_type': 'dip' },
        { 'behavior': 'malicious', 'entity_type': 'domain' },
        { 'behavior': 'malicious', 'entity_type': 'user' }];

      expect(ungroupOpenPipelines(mockData, ['sip'])).toEqual(expectedResult);
    });
  });

});