import React from 'react';
import { Model } from './index';
import moment from 'moment';
import { Button } from 'components/forms';

/* Mocking children components date-range with Jest  */
jest.mock('components/date-range', () => 'date-range')

describe('<Model />', () => {
  const props = {
    'fetchModels': () => null,
    'addNotification': () => null,
    'fetchColumnFormat': () => null,
    'fetchModelDetails': () => null,
    'modelAction': () => null,
    'resetModelState': () => null,
    'clearResultSummary': () => null,
    'retrainModel': () => null,
  };
  let mountedModel;
  let shallowedModel;
  const getMountedModelComponent = () => {
    if (!mountedModel) {
      mountedModel = mountWithIntl(
        <Model
          {...props}
        ></Model>
      )
    }
    return mountedModel;
  }
  const getShallowModelComponent = () => {
    if (!shallowedModel) {
      shallowedModel = shallowWithIntl(
        <Model
          {...props}
        ></Model>
      );
    }
    return shallowedModel;
  }

  test('test component mount', () => {
    const component = getShallowModelComponent();
    expect(component.find('.models__modelHeading').text()).toEqual(' Model list ');
  });

  test('test default state of selectedTab', () => {
    const component = getShallowModelComponent();
    expect(component.state()).toEqual({
      'startDate': moment.utc(1, 'X'),
      'endDate': moment.utc().endOf('day'),
      'modelRetrainData': {},
      'selectedRowData': null,
      'showAddNewModal': false,
      'showModelDeployment': false,
      'showModelDetails': false,
      'showRetrainModal': false,
    });
  });

  // TODO fix for Add new button simulation
  /* test('simulate tab click and test state change of selectedTab', () => {
    const component = getMountedModelComponent();
    const addNewModel = component.find(Button).at(0);
    addNewModel.simulate('click');
    expect(component.state().showAddNewModal).to.be.true;
  }); */
})
