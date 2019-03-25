import React from 'react';
import ManageResource from './index';

describe('<ManageResource />', () => {
  const props = {
    'type': 'activate',
    'data': {},
    'onCancel': () => null,
    'onSubmit': () => null,
  };

  let manageResource;

  beforeEach(() => {
    manageResource = mountWithIntl(<ManageResource {...props} />);
  });

  it('renders correctly', () => {
    expect(manageResource).toMatchSnapshot();
  });
});
