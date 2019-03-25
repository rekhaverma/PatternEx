export default (state) => {
  const tags = state.raw.toJS().tags;

  return Object.keys(tags).map(key => ({
    'id': key,
    'label': tags[key].name,
  }));
};
