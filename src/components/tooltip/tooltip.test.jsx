import React from 'react';
import Tooltip from './tooltip.component';

describe('<Tooltip />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      trigger: (<div />),
      children: (<div />),
      managerStyle: {},
      position: 'top',
      hideWhenHoveringTooltipContent: false,
      style: {},
    };
    wrapper = shallow(<Tooltip {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

