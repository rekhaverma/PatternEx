import { HeatMapDropdows } from './heat-map-dropdowns.class';

const data = [];
const rows = ['1', '2'];

describe('heat-map-dropdowns', () => {
  let heatMapDropDowns;
  beforeEach(() => {
    heatMapDropDowns = new HeatMapDropdows(data, rows);
  });

  it('should return the mapping', () => {
    const expectedResponse = {
      '4a65ceca-1bce-42f7-ba28-04d8cf70015c': {
        class: 'trivial',
        i18n: 'heatmap.tag.reconnaissance',
        pipelines: { '1': 0, '2': 0 },
      },
      '5378cfb2-ec24-11e5-b373-2c600c7f6a54': {
        class: 'high-risk',
        i18n: 'heatmap.tag.actionsOnObjective',
        pipelines: { '1': 0, '2': 0 },
      },
      '5e799858-23f9-4073-9531-5552b6c65df7': {
        class: 'low-risk',
        i18n: 'heatmap.tag.delivery',
        pipelines: { '1': 0, '2': 0 },
      },
      'c56d395f-1369-40e3-b434-9e2d0bb9412f': {
        class: 'medium-risk',
        i18n: 'heatmap.tag.commandAndControl',
        pipelines: { '1': 0, '2': 0 },
      },
      'd8b16568-5b2e-4ced-93ed-3fcaa64032e6': {
        class: 'needs-attention',
        i18n: 'heatmap.tag.lateralMovement',
        pipelines: { '1': 0, '2': 0 },
      },
    };
    expect(heatMapDropDowns.getDropdownsMap()).toEqual(expectedResponse);
  });
});