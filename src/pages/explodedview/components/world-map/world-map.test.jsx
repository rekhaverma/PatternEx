import React from 'react';
import { WorldMap } from './world-map.component';
// @todo: add signature
describe('<WorldMap />', () => {
  const props = {
    'data': {
      'connections': [{
        'source': '-122.002',
        'target': '37.3061',
      }],
      'sources': [{
        'latitude': '37.3061',
        'longitude': '-122.002',
      }],
    },
  };

  let component;
  beforeEach(() => {
    component = mountWithIntl(<WorldMap {...props} />);
  });

  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
