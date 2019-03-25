import { createSelector } from 'reselect';

const dataSources = state => state.logManager.toJS().rawData.dataSources;
const configData = state => state.logManager.toJS().rawData.configData;

const getConfigData = (item, config) => {
  const itemConfig = {};
  try {
    if (!config.Category[item.devicecategory]) {
      const categoryLabel = Object.keys(config.Category)
        .find(cat => config.Category[cat].filename === item.devicecategory);
      if (categoryLabel) {
        itemConfig.devicecategoryLabel = categoryLabel;
      }
    } else {
      itemConfig.devicecategoryLabel = item.devicecategory;
    }
    const types = config.Category[itemConfig.devicecategoryLabel].Type;
    if (types) {
      if (!types[item.devicetype]) {
        const typeLabel = Object.keys(types)
          .find(type => types[type].filename === item.devicetype);
        if (typeLabel) {
          itemConfig.devicetypeLabel = typeLabel;
        }
      } else {
        itemConfig.devicetypeLabel = item.devicetype;
      }
    }

    const subTypes = types[itemConfig.devicetypeLabel].SubType;
    if (subTypes) {
      if (!subTypes[item.devicesubtype]) {
        const subTypeLabel = Object.keys(subTypes)
          .find(subType => subTypes[subType].filename === item.devicesubtype);
        if (subTypeLabel) {
          itemConfig.devicesubtypeLabel = subTypeLabel;
        }
      } else {
        itemConfig.devicesubtypeLabel = item.devicesubtype;
      }
    }
    return itemConfig;
  } catch (e) {
    return itemConfig;
  }
};

export const getDataSourcesSelector = createSelector(
  dataSources,
  configData,
  (data, config) => {
    if (!data && !config) {
      return data;
    }
    return data.map(item => ({
      ...item,
      ...getConfigData(item, config),
      devicetimezoneLabel: item.timezone && item.timezone,
      dataSourceStatus: item.status,
      dataSourceDebug: item.debug || false,
    }));
  },
);
