import { fromJS } from 'immutable';
import { getLabelsHistory } from './labels.selectors';

const initialState = {
  raw: fromJS({
    tags: {
      '939b67c3-c3e0-4dd4-999b-07768adc3916': {
        description: 'Credit Card Fraud. Account created using compromised/stolen credit card details and personal identity information',
        alert: 'True',
        href: '/api/v0.2/tags/939b67c3-c3e0-4dd4-999b-07768adc3916',
        id: '939b67c3-c3e0-4dd4-999b-07768adc3916',
        severity: 4,
        labels_count: 7,
        name: 'CC Fraud',
        system_tag: true,
        create_time: 'Fri, 01 Jul 2016 00:00:00 -0000',
        type: 'M',
      },
      'c56d395f-1369-40e3-b434-9e2d0bb9412f': {
        update_time: 'Fri, 01 Jul 2016 00:00:00 -0000',
        description: 'How adversaries communicate with systems under their control within a target network.',
        alert: 'True',
        href: '/api/v0.2/tags/c56d395f-1369-40e3-b434-9e2d0bb9412f',
        id: 'c56d395f-1369-40e3-b434-9e2d0bb9412f',
        severity: 4,
        labels_count: 7,
        name: 'Command and Control',
        system_tag: true,
        create_time: 'Fri, 01 Jul 2016 00:00:00 -0000',
        type: 'M',
      },
    },
    explodedView: {
      labelsHistory: [
        {
          status: 'active',
          pipeline: 'sip',
          weight: 1,
          time_start: 'Mon, 04 Jun 2018 08:57:00 -0000',
          score: null,
          entity_name: '10.202.88.31',
          entity_type: 'ip',
          predicted_tag_id: {
            '2018-03-26-Classifier-Sip-4': 'ebdad7ea-efa1-4c54-8c71-eff30b7aa4e1',
          },
          time_end: 'Mon, 04 Jun 2018 08:57:00 -0000',
          tag_id: '939b67c3-c3e0-4dd4-999b-07768adc3916',
          mode: 'realtime',
          type: 'local',
          id: '170d77a0-68ad-44fd-ad88-43b91008208b',
          description: '',
        }],
    },
  }),
};

describe('Label Selectors', () => {
  it('should return entity labels', () => {
    const expected = [
      {
        'create_time': 'Mon, 04 Jun 2018 08:57:00 -0000',
        'description': 'Credit Card Fraud. Account created using compromised/stolen credit card details and personal identity information',
        'id': '170d77a0-68ad-44fd-ad88-43b91008208b',
        'name': 'CC Fraud',
        'severity': 4,
        'type': 'M',
      }];

    expect(getLabelsHistory(initialState)).toEqual(expected);
  });
});