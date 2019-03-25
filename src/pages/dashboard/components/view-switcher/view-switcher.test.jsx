import React from 'react';

import ViewSwitcher from './view-switcher.component';

describe('<ViewSwitcher />', () => {
  it('should render empty', () => {
    const component = shallow(
      <ViewSwitcher
        active="noKey"
        views={{}}
      />,
    );
    expect(component.html()).toEqual(null);
  });

  it('should render the expected view', () => {
    const views = {
      'firstView': <span>First View</span>,
      'secondView': <span>Second View</span>,
    };
    const component = shallow(
      <ViewSwitcher
        active="firstView"
        views={views}
      />,
    );

    expect(component.matchesElement(views.firstView)).toEqual(true);
  });

  it('should update view based on active prop', () => {
    const views = {
      'firstView': <span>First View</span>,
      'secondView': <span>Second View</span>,
    };
    const component = shallow(
      <ViewSwitcher
        active="firstView"
        views={views}
      />,
    );

    expect(component.matchesElement(views.firstView)).toEqual(true);

    component.setProps({ 'active': 'secondView', views });
    expect(component.matchesElement(views.secondView)).toEqual(true);
  });
});
