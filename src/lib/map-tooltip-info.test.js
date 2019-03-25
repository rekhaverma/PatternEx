import mapTooltipInfo from './map-tooltip-info';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
const TOOLTIPINFO = {
  precision: 'Precision',
  topLabel: 'Labels',
  suspicious: 'Suspicious',
  malicious: 'Malicious',
  clusters: 'Clusters',
};

describe('map-tooltip-info', () => {
  Object.keys(TOOLTIPINFO).map((tooltip) => {
    it(`should return '${TOOLTIPINFO[tooltip]}' info for tooltip '${tooltip}'`, () => {
      expect(mapTooltipInfo(tooltip)).toBe(TOOLTIPINFO[tooltip]);
    });
  });
});