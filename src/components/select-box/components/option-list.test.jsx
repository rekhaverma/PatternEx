import React from 'react';
import OptionList from './option-list.component';

const optionsList = [
  {
    content: 'All values',
    label: 'All Values',
    id: 'all',
  },
  {
    content: 'Value1',
    label: 'Value1',
    id: 'value1',
  },
  {
    content: 'Value2',
    label: 'Value2',
    id: 'value2',
  },
];

const styleList = {
  marginRight: 20,
};

describe('<OptionList />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      activeOption: 'all',
      className: 'optionList__test',
      onClick: jest.fn(),
      options: optionsList,
      scrollBar: true,
      singleSelect: true,
      style: styleList,
    };
    wrapper = shallow(<OptionList {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

