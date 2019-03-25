const tagsMapping = [
  '4a65ceca-1bce-42f7-ba28-04d8cf70015c',
  '5e799858-23f9-4073-9531-5552b6c65df7',
  'd8b16568-5b2e-4ced-93ed-3fcaa64032e6',
  'c56d395f-1369-40e3-b434-9e2d0bb9412f',
  '5378cfb2-ec24-11e5-b373-2c600c7f6a54',
];

export const tagsI18nMapping = {
  '4a65ceca-1bce-42f7-ba28-04d8cf70015c': {
    i18n: 'heatmap.tag.reconnaissance',
    name: 'Reconnaissance',
    class: 'trivial',
  },
  '5e799858-23f9-4073-9531-5552b6c65df7': {
    i18n: 'heatmap.tag.delivery',
    name: 'Delivery',
    class: 'low-risk',
  },
  'd8b16568-5b2e-4ced-93ed-3fcaa64032e6': {
    i18n: 'heatmap.tag.lateralMovement',
    name: 'Lateral Movement',
    class: 'needs-attention',
  },
  'c56d395f-1369-40e3-b434-9e2d0bb9412f': {
    i18n: 'heatmap.tag.commandAndControl',
    name: 'Command and Control',
    class: 'medium-risk',
  },
  '5378cfb2-ec24-11e5-b373-2c600c7f6a54': {
    i18n: 'heatmap.tag.actionsOnObjective',
    name: 'Actions on Objective',
    class: 'high-risk',
  },
};

/**
 * @todo: check what should we do with following tags:
 * @todo| Exploit, Defense Evasion, ATO, Benign
 */

export class HeatMapDropdows {
  constructor(data, rows) {
    this.rows = rows;
    this.data = data;
    this.mapping = {};
  }


  generateMapping() {
    tagsMapping.forEach((tag) => {
      if (!this.mapping[tag]) {
        this.mapping[tag] = {
          i18n: tagsI18nMapping[tag].i18n,
          class: tagsI18nMapping[tag].class,
          pipelines: {},
        };
      }
      this.rows.forEach((row) => {
        this.mapping[tag].pipelines[row] = 0;
      });
    });
  }

  generateData() {
    this.data.forEach((item) => {
      this.mapping[item.tag_id].pipelines[item.pipeline] += 1;
    });
  }

  getDropdownsMap() {
    this.mapping = {};
    this.generateMapping();
    this.generateData();
    return { ...this.mapping };
  }
}
