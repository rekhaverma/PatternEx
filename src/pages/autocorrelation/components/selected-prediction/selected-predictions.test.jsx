import React from 'react';

import SelectedPredictions from './selected-prediction.component';

describe('<SelectedPredictions />', () => {
  it('should render the component hidden', () => {
    const component = shallowWithIntl(<SelectedPredictions isHidden />);
    expect(component.find('.selectedPrediction').hasClass('+hidden')).toBe(true);
  });

  // it('should render all <Item />', () => {
  //   const component = shallowWithIntl(<SelectedPredictions />);

  //   expect(component.find(Item)).toHaveLength(4);
  // });
});
