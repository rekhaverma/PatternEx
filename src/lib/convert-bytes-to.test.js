import convertBytesTo from './convert-bytes-to';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('convert-bytes-to', () => {
  describe('recommended format', () => {
    it('should return GB format', () => {
      expect(convertBytesTo(2002326579)).toBe('1.9 GB');
    });

    it('should return MB format', () => {
      expect(convertBytesTo(1955397)).toBe('1.9 MB');
    });

    it('should return KB format', () => {
      expect(convertBytesTo(1909)).toBe('1.9 KB');
    });
  });

  describe('forced format', () => {
    it('should return GB format', () => {
      expect(convertBytesTo(2002326579, 'GB', true)).toBe('1.9 GB');
    });

    it('should return MB format', () => {
      expect(convertBytesTo(2002326579, 'MB', true)).toBe('1,909.6 MB');
    });

    it('should return KB format', () => {
      expect(convertBytesTo(2002326579, 'KB', true)).toBe('1,955,397 KB');
    });
  });
});