/**
 * /**
 * Create an array of URLs for each date between 'fromDate' and 'untilDate'.
 *
 * Both dates are Moment instances. So, to find the range from 'startDate' to
 * 'untilDate', we will loop while 'startDate' is a date before 'untilDate'
 * (using Moment's method isBefore()) and add another 24 hours to 'startDate'.
 *
 * E.g.
 *  timeline: { 'fromDate': 2017-07-02, 'untilDate': 2017-07-04 }
 *  requests: ['cluster_entities/2017-09-26', 'cluster_entities/2017-09-27']
 *
 * @param baseUrl
 * @param fromDate
 * @param untilDate
 * @param format
 * @returns {Array}
 */
export default (baseUrl, fromDate, untilDate, format = 'MM-DD-YYYY') => {
  const requests = [];
  let startDate = fromDate.clone().hours(0).minutes(0).seconds(0);

  while (startDate.isSameOrBefore(untilDate, 'YYYY-MM-DD')) {
    requests.push({
      'date': startDate.format(format),
      'url': `${baseUrl}${startDate.format(format)}`,
    });
    startDate = startDate.add(24, 'hours');
  }
  return requests;
};
