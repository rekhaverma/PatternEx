import React from 'react';
import SingleSelectBox from './single-select-box.component';

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

const styleList = {
  marginRight: 20,
};

describe('<SingleSelectBox />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      activeOption: 'all',
      allowSearch: false,
      boxIsOpen: false,
      className: 'singleSelectBox__tests',
      closeBox: jest.fn(),
      customClassName: '',
      onClick: jest.fn(),
      openBox: jest.fn(),
      options: optionsList,
      placeholder: 'SingleSelectBox',
      scrollbar: true,
      showLabel: false,
      singleSelect: true,
      style: styleList,
    };
    wrapper = shallow(<SingleSelectBox {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

