import React from 'react';
import moment from 'moment';
import { D3HistoricalBehaviourMap } from './d3-historical-behaviour-map.component';

import { defaultDimensions } from '../../config';

const mockHistoricalData = [{
  'date': moment.utc('2018-01-01'),
  'predicted_prob': '1.00',
  'predicted_tag': 'Benign',
  'score': '98.20',
}];

describe('<D3HistoricalBehaviourMap />', () => {
  const props = {
    'startDate': moment.utc('2018-01-01'),
    'endDate': moment.utc('2018-01-01'),
    'featuresNumber': defaultDimensions.length,
    'historicalData': mockHistoricalData,
  };

  let component;
  beforeEach(() => {
    component = mountWithIntl(<D3HistoricalBehaviourMap {...props} />);
  });

  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
