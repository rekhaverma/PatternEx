import React from 'react';
import Tab from './tabs.component';

describe('<Tab />', () => {
  let wrapper;
  let props;

  const itemList = [
    {
      count: '10',
      id: 'test',
      title: 'Test',
    },
    {
      count: '0',
      id: 'test_tab',
      title: 'Tab',
    },
  ];

  beforeEach(() => {
    props = {
      active: 'test_tab',
      className: 'tab__test',
      customClassName: '',
      fullWidth: false,
      items: itemList,
      style: {},
      slim: false,
      onClick: jest.fn(),
    };
    wrapper = shallow(<Tab {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

