import React from 'react';
import ThreatFilter from './threat-filter.component';

describe('<ThreatFilter />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      activeThreatTactic: 'TestThreat',
      threatTactics: [
        { id: 'TestThreat',
          label: 'TestThreat' },
      ],
      withTooltip: true,
    };
    wrapper = shallow(<ThreatFilter {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

