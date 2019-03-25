/*
  All possible cards for EVP
  Each card config should contain {
    id: card unique id,
    label: card name,
    visible: initial all are true; this will be changed when user will want to hide it,
    size: 1 or 2 (2-> 2/3 row width; 1-> 1/3 row width),
    height: 0.65, 1, 2 (most of cards have equal height -> 1,
      but some of them are higher or lower height, according to design),
  }
*/
const basicUIConfig = [
  {
    'id': 'detailsCard',
    'label': 'Details',
    'visible': true,
    'size': 1,
    'height': 1,
    'isDraggable': true,
    'order': 0,
  },
  {
    'id': 'labelsHistoryTimeline',
    'label': 'Label History Timeline',
    'visible': true,
    'size': 2,
    'height': 1,
    'isDraggable': true,
    'minW': 2,
    'order': 1,
  },
  {
    'id': 'labelsHistoryCard',
    'label': 'Label History',
    'visible': true,
    'size': 1,
    'height': 1,
    'isDraggable': true,
    'order': 2,
  },
  {
    'id': 'geolocation',
    'label': 'Autocorrelated Entities/Geolocation',
    'visible': true,
    'size': 2,
    'height': 1,
    'isDraggable': true,
    'minW': 2,
    'order': 3,
  },
  {
    'id': 'top3FeaturesCard',
    'label': 'Top 3 Feature',
    'visible': true,
    'size': 1,
    'height': 1,
    'isDraggable': true,
    'order': 4,
  },
  {
    'id': 'domainInfoCard',
    'label': 'Domain Information',
    'visible': true,
    'size': 1,
    'height': 1,
    'isDraggable': true,
    'order': 5,
  },
  {
    'id': 'externalEnrichmentCard',
    'label': 'External Enrichment',
    'visible': true,
    'size': 1,
    'height': 1,
    'isDraggable': true,
    'order': 6,
  },
  {
    'id': 'nxDomain',
    'label': 'NX Domain',
    'visible': true,
    'size': 1,
    'height': 1,
    'isDraggable': true,
    'order': 7,
  },
  {
    'id': 'contributionPredictionScore',
    'label': 'Contribution Prediction Score',
    'visible': true,
    'size': 2,
    'height': 1,
    'isDraggable': true,
    'order': 8,
  },
  {
    'id': 'relatedUsers',
    'label': 'Related Users',
    'visible': true,
    'size': 1,
    'height': 1,
    'isDraggable': true,
    'order': 9,
  },
  {
    'id': 'relatedSourceIPs',
    'label': 'Related Source IPs',
    'visible': true,
    'size': 1,
    'height': 1,
    'isDraggable': true,
    'order': 10,
  },
  {
    'id': 'vulnerabilityReport',
    'label': 'Vulnerability Report',
    'visible': true,
    'size': 1,
    'height': 1,
    'isDraggable': true,
    'order': 11,
  },
  {
    'id': 'DHCPCard',
    'label': 'DHCPCard',
    'visible': true,
    'size': 1,
    'height': 1,
    'isDraggable': true,
    'order': 12,
  },
  {
    'id': 'featurePlot',
    'label': 'FeaturePlot',
    'visible': true,
    'size': 1,
    'height': 1,
    'isDraggable': true,
    'order': 13,
  },
];

/*
  Some pipelines shouldn't show some particular cards
*/
const cardRestrictions = {
  'domain': ['nxDomain'],
  'sip': ['domainInfoCard', 'relatedSourceIPs'],
  'dip': ['domainInfoCard', 'nxDomain'],
  'user': ['geolocation', 'relatedUsers', 'domainInfoCard', 'nxDomain'],
  'sipdip': ['domainInfoCard', 'relatedSourceIPs', 'nxDomain'],
  'sipdomain': ['domainInfoCard', 'nxDomain', 'relatedSourceIPs'],
  'hpa': ['geolocation', 'relatedUsers', 'nxDomain'],
  'request': ['geolocation', 'relatedUsers', 'relatedSourceIPs', 'domainInfoCard', 'nxDomain'],
};

const CARDS_CONFIG_KEY = 'cards-config';

const generateOrderArray = (layout) => {
  const matrix = [];

  let i = 0;
  let hasValue = layout.filter(item => item.y === i).length;

  const getRow = item => item.y === i;

  while (hasValue) {
    const row = layout.filter(getRow);

    if (row.length) {
      matrix.push(row);
    }
    hasValue = row.length;
    i += 1;
  }

  if (!matrix.length) {
    return [];
  }

  const orderArray = [];

  matrix.map(row => row.map(column => orderArray.push(column.i)));

  return orderArray;
};

/*
  Return array of cards for a pipeline
*/
export const getCardsByPipeline = (pipeline) => {
  if (Object.keys(cardRestrictions).includes(pipeline)) {
    return basicUIConfig.filter(card => !cardRestrictions[pipeline].includes(card.id));
  }
  return basicUIConfig;
};

export const getCardConfig = (cardId, x, y) => {
  const card = basicUIConfig.find(item => item.id === cardId);

  return {
    x,
    y,
    w: card.size,
    h: card.height,
    i: card.id,
  };
};

export const generateConfig = (layout, visibility, pipeline) => {
  const orderArray = generateOrderArray(layout) || [];
  const defaultCards = getCardsByPipeline(pipeline);

  const config = defaultCards.map((row) => {
    const item = {
      id: row.id,
      visible: false,
      order: orderArray.findIndex(id => id === row.id),
    };

    if (item.order === -1) {
      item.order = layout.length;
    }

    const visibilityItem = visibility.find(i => i.id === item.id);
    if (visibilityItem) {
      item.visible = visibilityItem.visible;
    }

    return item;
  });

  config.sort((a, b) => a.order - b.order);

  return config;
};

export const getConfigFromLocalStorage = (pipeline = false) => {
  let config = localStorage.getItem(CARDS_CONFIG_KEY);

  if (!config) {
    if (pipeline) {
      return [];
    }

    return {};
  }
  config = JSON.parse(config);
  if (!pipeline) {
    return config;
  }

  return config[pipeline] || [];
};

export const saveConfigToLocalStorage = (pipeline, config) => {
  const localStorageConfig = getConfigFromLocalStorage();
  localStorageConfig[pipeline] = config;
  localStorage.setItem(CARDS_CONFIG_KEY, JSON.stringify(localStorageConfig));
};
