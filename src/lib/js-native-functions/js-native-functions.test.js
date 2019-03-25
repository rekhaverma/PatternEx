import jsNativeFunctions from './index';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('js-native-functions', () => {
  it('should return number with required decimals', () => {
    expect(jsNativeFunctions.toFixed(10.0320000003, 3)).toBe('10.032');
  });

  it('should return error', () => {
    try {
      jsNativeFunctions.toFixed('10.0320000003', 3);
    } catch (e) {
      expect(e.message).toEqual('TypeError: number.toFixed is not a function');
    }
  });
});