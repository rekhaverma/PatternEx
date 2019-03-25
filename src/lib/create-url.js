export default (path, params) => {
  const paramsUrl = Object.keys(params)
    .filter(key => params[key])
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return `${path}${'?'.concat(...paramsUrl)}`;
};
