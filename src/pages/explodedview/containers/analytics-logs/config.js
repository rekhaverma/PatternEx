import moment from 'moment';
import Tags from 'model/classes/tags.class';
import { historical30DaysPipelineFeatures } from '../../config';

const getPropertyValue = (property, data) => {
  let value = '';
  if (data[property] !== null) {
    switch (property) {
      case 'dstip_geo_location':
      case 'srcip_geo_location':
      case 'ipv4_geo_location':
        if (data[property].city && data[property].country) {
          value = `${data[property].city} ${data[property].country}`;
        } else if (data[property].city) {
          value = `${data[property].city}`;
        } else {
          value = `${data[property].country}`;
        }
        break;

      default:
        value = isNaN(data[property]) ? data[property] : parseFloat(data[property]).toFixed(2);
        break;
    }
  }
  return value;
};

/**
 * Create data for Analytics Table - Historical(30 days)
 * Get all items returned by search api and for each item create an object which
 * contains it's pipeline specific features
 * @return {Array}
 */

export const getBehaviour30daysTableData = (data, pipeline) => {
  if (data.length > 0) {
    /**
     * Create array of tags of all items contained by searchdata api response
     */
    const entitiesTags = data
      .map((item) => {
        if (Object.keys(item).includes('predicted_tag')
          && item.predicted_tag !== null
          && item.predicted_tag.id !== null) {
          return item.predicted_tag.id;
        }
        return null;
      })
      .filter((x, i, a) => a.indexOf(x) === i);

    const tagsInstance = new Tags(entitiesTags);
    const tagsFromCache = tagsInstance.constructor.getFromCache();

    return data.reduce((acc, item, index) => {
      /**
       * Get specific features for current pipeline, map over them and create
       * an object like { featureName: featureValue }
       */
      const featuresValues = historical30DaysPipelineFeatures[pipeline].reduce((accum, feature) => {
        const featuresObj = accum;
        if (feature === 'predicted_tag' && item.predicted_tag) {
          featuresObj[feature] = tagsFromCache[item.predicted_tag.id].name || 'Others';
        } else {
          featuresObj[feature] = getPropertyValue(feature, item);
        }
        return featuresObj;
      }, {});

      /**
       * id and date are the properties which are present for all types of pipelines
       */
      const defaultProperties = {
        'id': `historicalTableRow__${index}`,
        'date': moment.utc(item.ts).format('MM - DD - YYYY'),
      };
      return [...acc, Object.assign(defaultProperties, featuresValues)];
    }, []);
  }
  return [];
};

export const getFWLogsTable = data => data.reduce((acc, item) => [...acc, {
  'id': item.timestamp,
  'timestamp': moment(item.timestamp, 'YYYY/MM/DD HH:mm:ss').format('llll'),
  'srcip': item.source_ip,
  'dstip': item.destination_ip,
  'dst_port': Number(item.destination_port),
}], []);

export const getEDRLogsTable = data => data.reduce((acc, item) => [...acc, {
  'timestamp': moment(item[0], 'YYYY/MM/DD HH:mm:ss').format('DD-MM-YYYY'),
  'date': moment(item[10], 'YYYY-MM-DD').format('DD-MM-YYYY'),
  'log_source': item[1],
  'ip': item[2],
  'hostname': item[3],
  'username': item[4],
  'os': item[5],
  'process_name': item[6],
  'process_path': item[7],
  'process_md5': item[8],
}], []);
