import locationBackUrl from './location-back-url';

describe('Location Back Url', () => {
  beforeEach(() => {
    global.sessionStorage = jest.fn();
    global.sessionStorage.setItem = jest.fn();
    global.sessionStorage.getItem = jest.fn();
    Object.defineProperty(window.location, 'pathname', {
      value: '/current-url',
    });
    Object.defineProperty(window.location, 'search', {
      value: '?demo',
    });
  });

  it('should set in session storage the next path and current Url', () => {
    locationBackUrl.setBackUrl('/url');

    expect(JSON.parse(global.sessionStorage.setItem.mock.calls[0][1])['/url']).toEqual('/current-url?demo');
  });

  it('should return the back url from session storage', () => {
    global.sessionStorage.getItem = () => JSON.stringify({ '/current-url': '/back-url' });

    expect(locationBackUrl.getBackUrl()).toBe('/back-url');
  });
});
