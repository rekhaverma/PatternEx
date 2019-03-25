import { pick, uniq } from 'lodash';
import moment from 'moment';

import Tags from './tags.class';

import { tagsMap } from '../../config';

const defaultTagsUUID = [
  '4a65ceca-1bce-42f7-ba28-04d8cf70015c',
  '5e799858-23f9-4073-9531-5552b6c65df7',
  'd8b16568-5b2e-4ced-93ed-3fcaa64032e6',
  'c56d395f-1369-40e3-b434-9e2d0bb9412f',
  '5378cfb2-ec24-11e5-b373-2c600c7f6a54',
];

class HeatMapModel {
  static calculateSeverity(count, index) {
    if (count === 0) {
      return 'none';
    }
    switch (index) {
      case 2:
        return 'lowRisk';
      case 3:
        return 'needsAttention';
      case 4:
        return 'mediumRisk';
      case 5:
        return 'highRisk';
      default:
        return 'trivial';
    }
  }

  static calculateOpacity(count, maxCount) {
    const countPercent = (100 * count) / maxCount;

    if (countPercent <= 20) {
      return 20;
    } else if (countPercent <= 40) {
      return 40;
    } else if (countPercent <= 60) {
      return 60;
    } else if (countPercent <= 80) {
      return 80;
    }
    return 100;
  }

  static findHighlighted(items, startDate) {
    const rowType = this.rowType;
    return items.reduce(
      (acc, item) => {
        const itemUtcDate = moment(item.create_time).utc();
        if (itemUtcDate.format('MM DD YYYY') === startDate.format('MM DD YYYY')) {
          return {
            ...acc,
            [rowType === 'pipeline' ? item.pipeline : item.seed_type]: uniq([].concat(acc[rowType === 'pipeline' ? item.pipeline : item.seed_type], item.tag_id)),
          };
        }
        return acc;
      },
      {},
    );
  }

  static defaultColumnMaxCount() {
    const tagsObject = {};

    defaultTagsUUID.forEach(tag => tagsObject[tag] = 0);
    return tagsObject;
  }

  constructor(data, rows, tags, rowType, defaultTags = defaultTagsUUID) {
    this.tags = new Tags(tags);
    this.rows = rows;
    this.defaultTags = defaultTags;
    this.rowType = rowType;

    this.maxCount = 0;
    this.minCount = 0;

    this.columnMaxCount = this.constructor.defaultColumnMaxCount();

    this.data = this.count(data);
  }


  /**
   * Create the default model of the heat map
   */
  constructDefaultData() {
    return this.rows.reduce(
      (acc, key) => {
        const item = new Map();
        item.set('id', key);

        this.defaultTags.forEach(tag => item.set(tag, []));

        return acc.set(key, item);
      },
      new Map(),
    );
  }

  formatTagName(tag) {
    const tagObj = this.tags.getTagById(tag);

    if (!tagObj || !tagObj.name) {
      return tag;
    }
    switch (tagObj.name.toLowerCase()) {
      case 'discovery':
        return 'Reconnaissance';

      case 'delivery':
        return 'Delivery';

      case 'lateral movement':
      case 'credential access':
        return 'Lateral Movement';

      case 'command and control':
        return 'Command and Control';

      case 'exfiltration':
      case 'denial os service':
      case 'cc fraud':
      case 'tos abuse':
      case 'hpa':
        return 'Actions on Objective';

      default:
        return tag;
    }
  }

  setMinMax(data) {
    let max = 0;
    let min = 9999999999999;

    data.forEach((el) => {
      const values = Object.values(el);

      values.forEach((val) => {
        if (typeof val.length === 'number') {
          if (val.length < min) {
            min = val.length;
          }
          if (val.length > max) {
            max = val.length;
          }
        }
      });
    });

    this.minCount = min;
    this.maxCount = max;
  }

  setColumnMaxCount(data) {
    Object.values(data).forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (key !== 'id') {
          if (row[key].length > this.columnMaxCount[key]) {
            this.columnMaxCount[key] = row[key].length;
          }
        }
      });
    });
  }

  getMidValue() {
    return (this.minCount + this.maxCount) / 2;
  }

  /**
   * Increment the number of tag's apparitions if
   * it's present in element.
   *
   * @param {Map} element    defaultModel pipeline object
   * @param {String} item        Tag UUID
   */
  incrementCount(element, item) {
    const tagObj = this.tags.getTagById(item.tag_id);
    const mapKey = Object.keys(tagsMap)
      .filter(key => tagsMap[key].includes(tagObj.name && tagObj.name.toLowerCase()))[0];

    if (mapKey === undefined) {
      return element;
    }

    const mapTagObj = this.tags.getTagByName(mapKey)[0];

    if (Object.keys(mapTagObj).length > 0 && element.has(mapTagObj.id)) {
      const obj = element.get(mapTagObj.id);
      return element.set(
        mapTagObj.id,
        obj.concat(pick(item, ['create_time', 'end_time', 'id', 'tag_id'])),
      );
    }

    return element;
  }

  /**
   * Count the tag in items and map it to pipeline
   *
   *  Iterate thru items and if we have in the defaultModel
   * the current pipeline, search for current tag_id in the
   * defaultModel pipeline's object.
   *
   * Output sample:
   *  {
   *    'id': 'sip',
   *    'tagUUID': 0,
   *    'tagUUID: 0,
   *  }
   *
   * @param {Array} items           Items
   * @param {Map} defaultModel   Default model of the heat map
   */
  count(items, defaultModel) {
    const model = defaultModel !== undefined
      ? defaultModel
      : this.constructDefaultData();

    const output = items.reduce(
      (acc, item) => {
        const row = this.rowType === 'pipeline' ? item.pipeline : item.seed_type;

        if (acc.has(row)) {
          return acc.set(row, this.incrementCount(acc.get(row), item));
        }

        return acc;
      },
      model,
    );


    const dataArr = [];
    output.forEach((value) => {
      const obj = {};
      Array.from(value.keys()).map(id => obj[id] = value.get(id));

      dataArr.push(obj);
    });

    this.setMinMax(dataArr);
    this.setColumnMaxCount(dataArr);

    return dataArr;
  }
}

export default HeatMapModel;
