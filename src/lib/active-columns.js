const LOCALSTORAGE_KEY = 'active-table-columns';

const setLocalStorage = (activeOptions) => {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(activeOptions));
};

const getLocalStorage = () => {
  const options = localStorage.getItem(LOCALSTORAGE_KEY);

  if (options) {
    return JSON.parse(options);
  }
  return {};
};

const setActiveOptions = (tableID, options) => {
  const activeOptions = getLocalStorage();
  activeOptions[tableID] = options;
  setLocalStorage(activeOptions);
};

const getActiveOptions = (tableID) => {
  if (!tableID) {
    return false;
  }
  const activeOptions = getLocalStorage();
  return activeOptions[tableID] || false;
};

export default {
  setActiveOptions,
  getActiveOptions,
};
