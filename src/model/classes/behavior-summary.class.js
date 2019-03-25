import ptrxREST from 'lib/rest';

const aggregateData = (responses, model) => responses.reduce((acc, el) => {
  const accCopy = acc;
  const item = el.data;
  if (item.total_malicious_behavior > 0) {
    accCopy.days_with_malicious.push({
      'date': parseInt(el.day_ts, 10) * 1000,
      'count': item.total_malicious_behavior,
    });
  }

  if (item.total_suspicious_behavior > 0) {
    accCopy.days_with_suspicious.push({
      'date': parseInt(el.day_ts, 10) * 1000,
      'count': item.total_suspicious_behavior,
    });
  }

  accCopy.total_malicious_behavior += item.total_malicious_behavior || 0;
  accCopy.total_suspicious_behavior += item.total_suspicious_behavior || 0;
  ['method_wise_suspicious_behavior', 'pipeline_wise_suspicious_behavior'].forEach((outerKey) => {
    if (item[outerKey]) {
      Object.keys(item[outerKey]).forEach((innerKey) => {
        accCopy[outerKey][innerKey] = accCopy[outerKey][innerKey] || 0;
        accCopy[outerKey][innerKey] += item[outerKey][innerKey] || 0;
      });
    }
  });

  return accCopy;
}, model);

const getSummaryByDay = async urls => Promise.all(urls.map(async (req) => {
  const response = await ptrxREST.get(req.url);
  return {
    'day_ts': req.date,
    'data': response.data,
  };
}));

export default class BehaviorSummary {
  static async getDataFromAPI(urls) {
    return aggregateData(await getSummaryByDay(urls), {
      'method_wise_suspicious_behavior': {},
      'pipeline_wise_suspicious_behavior': {},
      'total_malicious_behavior': 0,
      'total_suspicious_behavior': 0,
      'days_with_malicious': [],
      'days_with_suspicious': [],
    });
  }
}
