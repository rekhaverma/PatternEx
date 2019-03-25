const defaultSourceLog = 'panw';
const dnsDefiningFeatures = {
  'sip': {
    'dns': ['num_dns_requests'],
    'panw': ['src_ip_03_count_connections'],
  },
  'sipdomain': {
    'dns': ['tot_dns_requests'],
    'panw': ['src_ip_01_tot_threat_sessions'],
  },
};

const checkSourceLog = (features, pipeline) => {
  const logSource = [];
  const dnsDefiningFeaturesByPipeline = dnsDefiningFeatures[pipeline];
  if (!features) {
    return '';
  }

  Object.keys(dnsDefiningFeaturesByPipeline).forEach((key) => {
    dnsDefiningFeaturesByPipeline[key].forEach((feature) => {
      if (features[feature] && features[feature] > 0) {
        logSource.push(key);
      }
    });
  });

  return logSource.join(',');
};

export default (pipeline, data) => {
  let sourceLog = defaultSourceLog;

  if (Object.keys(dnsDefiningFeatures).indexOf(pipeline) > -1) {
    const checkSource = checkSourceLog(data.top_n_features, pipeline);
    sourceLog = checkSource !== '' ? checkSource : sourceLog;
  }

  return sourceLog;
};
