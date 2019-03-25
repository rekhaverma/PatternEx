import React from 'react';
import MultiSelectBox from './multi-select-box.component';

const optionsList = [
  {
    content: 'All values',
    id: 'all',
  },
  {
    content: 'Value1',
    id: 'value1',
  },
  {
    content: 'Value2',
    id: 'value2',
  },
];

const activeOption = ['all', 'value1'];

const styleList = {
  marginRight: 20,
};

describe('<MultiSelectBox />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      activeOption,
      boxIsOpen: true,
      className: 'MultiSelectBox__test',
      closeBox: jest.fn(),
      customClassName: '',
      hasScrollbar: true,
      onClick: jest.fn(),
      openBox: jest.fn(),
      options: optionsList,
      placeHolder: 'Test placeholder',
      singleSelect: false,
      style: styleList,
    };
    wrapper = shallow(<MultiSelectBox {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

