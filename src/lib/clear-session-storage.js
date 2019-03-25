/**
 * Used to clear the sessionStorage if is new tab
 */
export default () => {
  if (window.history.length === 1) {
    sessionStorage.clear();
  }
};
