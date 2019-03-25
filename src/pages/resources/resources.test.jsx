import React from 'react';
import { Resources } from './index';

describe('<Resources />', () => {
  it('should match with snapshot', () => {
    const props = {
      'getResources': () => null,
      'resetResource': () => null,
      'getUserDetail': () => null,
      'updateResource': () => null,
      'deleteResourceByName': () => null,
    };

    const tree = shallow(<Resources {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
