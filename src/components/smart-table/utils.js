import { sortTypes } from './constants';

const { ASC, DESC } = sortTypes;
export const reverseSortDirection = sortDir => (sortDir === DESC ? ASC : DESC);

const SMART_TABLE_CONFIG_KEY = 'smart-table-config';
export const saveTableConfigOnLocalHost = (tableId, config) => {
  const currentConfig = JSON.parse(localStorage.getItem(SMART_TABLE_CONFIG_KEY) || '{}');

  currentConfig[tableId] = config.map(item => ({
    field: item.field,
    hidden: item.hidden,
  }));

  localStorage.setItem(SMART_TABLE_CONFIG_KEY, JSON.stringify(currentConfig));
};

export const getTableConfigFromLocalHost = (tableId, tableConfig) => {
  let currentConfig = JSON.parse(localStorage.getItem(SMART_TABLE_CONFIG_KEY) || '{}');

  if (!currentConfig || !currentConfig[tableId]) {
    return tableConfig;
  }

  currentConfig = currentConfig[tableId];

  return tableConfig.map((item) => {
    const field = currentConfig.find(row => row.field === item.field);

    if (!field) {
      return item;
    }

    return {
      ...item,
      hidden: field.hidden,
    };
  });
};
