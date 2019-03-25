import React from 'react';
import { HeatMapDropdown } from './heat-map-dropdown.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<HeatMapDropdown />', () => {
  it('should match with snapshot', () => {
    const props = {
      data: [],
      row: ['useraccess', 'sipdip', 'sip', 'dip', 'domain', 'sipdomain', 'hpa', 'request'],
      tags: {
        '8b176bac-31a5-497f-8983-e2ff8c1e937a': {
          id: '8b176bac-31a5-497f-8983-e2ff8c1e937a',
          severity: 2,
          name: 'Exploit',
        },
        '939b67c3-c3e0-4dd4-999b-07768adc3916': {
          id: '939b67c3-c3e0-4dd4-999b-07768adc3916',
          severity: 4,
          name: 'CC Fraud',
        },
        'c56d395f-1369-40e3-b434-9e2d0bb9412f': {
          id: 'c56d395f-1369-40e3-b434-9e2d0bb9412f',
          severity: 4,
          name: 'Command and Control',
        },
        '5378cfb2-ec24-11e5-b373-2c600c7f6a54': {
          id: '5378cfb2-ec24-11e5-b373-2c600c7f6a54',
          severity: 4,
          name: 'Exfiltration',
        },
        '1214af23-55fa-4a41-9b36-313491c79234': {
          id: '1214af23-55fa-4a41-9b36-313491c79234',
          severity: 4,
          name: 'Defense Evasion',
        },
        '07e5ceeb-92a6-466d-ba90-9829960c6f72': {
          id: '07e5ceeb-92a6-466d-ba90-9829960c6f72',
          severity: 4,
          name: 'Credential Access',
        },
        'd8b16568-5b2e-4ced-93ed-3fcaa64032e6': {
          id: 'd8b16568-5b2e-4ced-93ed-3fcaa64032e6',
          severity: 4,
          name: 'Lateral Movement',
        },
        'd8b29297-e989-471b-a2c9-42c0256b4e53': {
          id: 'd8b29297-e989-471b-a2c9-42c0256b4e53',
          severity: 3,
          name: 'TOS Abuse',
        },
        '65c71966-351f-4897-a75f-9c36f55fa128': {
          id: '65c71966-351f-4897-a75f-9c36f55fa128',
          severity: 5,
          name: 'ATO',
        },
        'ae99c4bc-f494-4e2d-829b-541ce7cc7c61': {
          id: 'ae99c4bc-f494-4e2d-829b-541ce7cc7c61',
          severity: 2,
          name: 'HPA',
        },
        '4a65ceca-1bce-42f7-ba28-04d8cf70015c': {
          id: '4a65ceca-1bce-42f7-ba28-04d8cf70015c',
          severity: 4,
          name: 'Discovery',
        },
        '5e799858-23f9-4073-9531-5552b6c65df7': {
          id: '5e799858-23f9-4073-9531-5552b6c65df7',
          severity: 4,
          name: 'Delivery',
        },
        '23841fc6-5150-11e8-9c2d-fa7ae01bbebc': {
          id: '23841fc6-5150-11e8-9c2d-fa7ae01bbebc',
          severity: 4,
          name: 'Reconnaissance',
        },
        '59d58a15-0f3e-493d-9f30-e66614e66b03': {
          id: '59d58a15-0f3e-493d-9f30-e66614e66b03',
          severity: 4,
          name: 'Denial of Service',
        },
        'ebdad7ea-efa1-4c54-8c71-eff30b7aa4e1': {
          id: 'ebdad7ea-efa1-4c54-8c71-eff30b7aa4e1',
          severity: 0,
          name: 'Benign',
        },
      },
      resetFilters: jest.fn(),
      filters: {active:{}},
      setFilter: jest.fn(),
    };
    const wrapper = shallow(<HeatMapDropdown {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
