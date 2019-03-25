export const SET_DATE = '@timeline/SET_DATE';

export const setDate = (key, value) => ({
  'type': SET_DATE,
  'payload': { key, value },
});
