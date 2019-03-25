import mapTagToColor from './map-tag-to-color';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
const TAGS_COLOR = {
  'tod abuse': '#204742',
  'delivery': '#3e987a',
  'discovery': '#bfb663',
  'exfiltration': '#f9c757',
  'hpa': '#f6a938',
  'cc fraud': '#2678b4',
  'benign': '#B93740',
  'denial of service': '#574B90',
  'lateral movement': '#67809F',
  'command and control': '#F2784B',
  'credential access': '#227093',
  'ato': '#4B77BE',
  'unknown': '#947CB0',
  'default': '#3498DB',
};

describe('map-tag-to-color', () => {
  Object.keys(TAGS_COLOR).map((tag) => {
    it(`should return '${TAGS_COLOR[tag]}' color for tag '${tag}'`, () => {
      expect(mapTagToColor(tag)).toBe(TAGS_COLOR[tag]);
    });
  });
});