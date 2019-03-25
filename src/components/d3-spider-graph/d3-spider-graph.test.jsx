import React from 'react';

import { D3SpiderGraph } from './d3-spider-graph.component';

describe('<D3SpiderGraph />', () => {
  const props = {
    'config': {
      'svgHeight': 600,
    },
    'data': {
      'nodes': [],
      'links': [],
    },
  };

  let component;
  beforeEach(() => {
    component = mount(<D3SpiderGraph {...props} />);
  });

  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
