import React from 'react';
import { AddEditResourceModal } from './index';

describe('<AddEditResourceModal />', () => {
  const props = {
    'addResource': () => null,
    'updateResource': () => null,
    'onCancel': () => null,
    'resetErrorResource': () => null,
    'type': 'Add',
  };
  let component;
  beforeEach(() => {
    component = mountWithIntl(<AddEditResourceModal {...props} />);
  });

  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
