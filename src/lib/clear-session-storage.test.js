import clearSessionStorage from './clear-session-storage';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('clear-session-storage', () => {
  beforeEach(() => {
    global.sessionStorage = jest.fn();
    global.sessionStorage.clear = jest.fn();
  });

  it('should clear the sessionStorage', () => {
    clearSessionStorage();
    expect(global.sessionStorage.clear.mock.calls.length).toBe(1);
  });

  it('should not clear the sessionStorage', () => {
    Object.defineProperty(window.history, 'length', {
      value: 2,
    });

    clearSessionStorage();
    expect(global.sessionStorage.clear.mock.calls.length).toBe(0);
  });
});