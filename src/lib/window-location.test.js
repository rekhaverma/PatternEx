import { windowLocation } from './window-location';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('window-location', () => {
  it('should return the origin', () => {
    Object.defineProperty(window.location, 'origin', { value: '/origin' });

    expect(windowLocation.origin()).toBe('/origin');
  });

  it('should call the window.location.replace method', () => {
    const replace = jest.fn();
    Object.defineProperty(window.location, 'replace', { value: replace });
    windowLocation.replace('/current');

    expect(replace.mock.calls.length).toBe(1);
  });
});