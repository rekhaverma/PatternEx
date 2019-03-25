import mapIcons from './map-icons';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
const pipelines = [
  'domain',
  'sip',
  'dip',
  'user',
  'useraccess',
  'user access',
  'username',
  'user name',
  'main',
  'sipdip',
  'sipdomain',
  'hpa',
  'request',
  'ip',
];
const ICONS = {
  'domain': 'icon-world',
  'sip': 'icon-laptop',
  'dip': 'icon-hosting',
  'user': 'icon-user',
  'useraccess': 'icon-user',
  'user access': 'icon-user',
  'username': 'icon-user',
  'user name': 'icon-user',
  'main': 'icon-mainText',
  'sipdip': 'icon-share-1',
  'sipdomain': 'icon-hosting',
  'hpa': 'icon-hpa',
  'request': 'icon-request',
  'ip': 'icon-ip',
};
describe('map-icons', () => {
  pipelines.map((pipeline) => {
    it(`should return '${ICONS[pipeline]}' icon for pipeline '${pipeline}'`, () => {
      expect(mapIcons(pipeline)).toBe(ICONS[pipeline]);
    });
  });
});