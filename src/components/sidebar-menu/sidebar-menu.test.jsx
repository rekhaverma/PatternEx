import React from 'react';
import SidebarMenu from './sidebar-menu.component';

describe('<SidebarMenu />', () => {
  let wrapper;
  let props;

  const itemsList = [
    {
      icon: 'icon-test1',
      id: 'test1',
      label: 'Test1',
      location: '/test',
      params: ['start_time', 'end_time'],
      type: 'link',
    },
    {
      icon: 'icon-test2',
      id: 'test2',
      label: 'Test2',
      location: '/test',
      params: ['start_time', 'end_time'],
      type: 'link',
    },
  ];

  const privilegesObject = {
    privilege1: {
      edit: true,
      read: true,
      remove: true,
    },
    privilege2: {
      edit: true,
      read: true,
      remove: true,
    },
  };

  beforeEach(() => {
    props = {
      active: '',
      className: 'sidebarMenu__test',
      hasLogo: true,
      isOld: false,
      items: itemsList,
      privileges: privilegesObject,
      query: {
        'end_time': '08-02-2018',
        'start_time': '07-26-2018',
      },
    };
    wrapper = shallow(<SidebarMenu {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

