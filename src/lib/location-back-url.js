const SESSION_STORAGE_KEY = 'location-back-url';

const setSessionStorage = (urls) => {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(urls));
};

const getSessionStorage = () => {
  const sessionUrls = sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (sessionUrls) {
    return JSON.parse(sessionUrls);
  }

  return {};
};

const setBackUrl = (nextPathName) => {
  const urls = getSessionStorage();
  urls[nextPathName] = `${window.location.pathname}${window.location.search}`;
  setSessionStorage(urls);
};

const getBackUrl = () => {
  const urls = getSessionStorage();
  return urls[window.location.pathname] || false;
};

export default {
  setBackUrl,
  getBackUrl,
};
