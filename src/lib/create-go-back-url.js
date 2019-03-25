export default (props) => {
  const { location, backURL } = props;
  const goBackHash = location.query.go_back_hash;
  const stateValue = backURL ? backURL[goBackHash] || null : null;

  const localStoreDict = localStorage.getItem('go_back_evp') || '{}';
  const localStore = JSON.parse(localStoreDict);
  const localStorageValue = localStore[goBackHash] || null;

  let path = null;
  let search = null;

  if (!localStorageValue && !stateValue) {
    return false;
  }

  if (!localStorageValue && Object.keys(stateValue) > 0) {
    path = stateValue.path;
    search = stateValue.search || '';
  }

  if (Object.keys(localStorageValue)) {
    path = localStorageValue.path;
    search = localStorageValue.search || '';
  }

  if (!path) {
    return false;
  }

  return `${path}${search}`;
  // console.log(stateValue);
  // console.log(localStorageValue);

  // const { backURL } = props;
  // const path = backURL.pathname;
  // const search = backURL.search || '';
  // if (path) {
  //   return `${path}${search}`;
  // }
  // return defaultURL;
};

