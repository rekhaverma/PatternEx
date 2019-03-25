import { createSelector } from 'reselect';

const dataConfigState = state => state.logManager.toJS().rawData.configData;

const getCleanContent = (array) => {
  const fileNames = [];
  const data = {};
  if (!array) {
    return [];
  }

  Object.keys(array).forEach((item) => {
    const property = Object.keys(array[item]).find(key => key !== 'filename');
    let cleanItems = {};
    if (property) {
      cleanItems = getCleanContent(array[item][property]);
    }
    if (Object.keys(cleanItems).length ||
      (array[item].filename && !fileNames.includes(array[item].filename))) {
      data[item] = {};
      if (Object.keys(cleanItems).length) {
        data[item][property] = cleanItems;
      }
      if (array[item].filename && !fileNames.includes(array[item].filename)) {
        fileNames.push(array[item].filename);
        data[item].filename = array[item].filename;
      }
    }
  });
  return data;
};

export const getCleanDataConfig = createSelector(dataConfigState, (dataConfig) => {
  try {
    const categories = getCleanContent([dataConfig]);
    return categories[0] || dataConfig;
  } catch (e) {
    return dataConfig;
  }
});
