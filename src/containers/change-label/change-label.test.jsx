import React from 'react';
import { fromJS } from 'immutable';

import { ChangeLabel, mapStateToProps } from './change-label.container';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<ChangeLabel />', () => {
  describe('render: ', () => {
    it('should match with snapshot', () => {
      const props = {
        predictionRow: {},
        tags: [],
        title: {},
        onCancel: jest.fn(),
        onSave: jest.fn(),
      };
      const wrapper = shallow(<ChangeLabel {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mapStateToProps: ', () => {
    it('should return the tags', () => {
      const initialState = {
        raw: fromJS({
          tags: {
            '8b176bac-31a5-497f-8983-e2ff8c1e937a': {
              name: 'Exploit',
            },
            '939b67c3-c3e0-4dd4-999b-07768adc3916': {
              name: 'CC Fraud',
            },
            'c56d395f-1369-40e3-b434-9e2d0bb9412f': {
              name: 'Command and Control',
            },
          },
        }),
      };
      const expectedResponse = {
        tags: [
          { id: '8b176bac-31a5-497f-8983-e2ff8c1e937a', label: 'Exploit' },
          { id: '939b67c3-c3e0-4dd4-999b-07768adc3916', label: 'CC Fraud' },
          { id: 'c56d395f-1369-40e3-b434-9e2d0bb9412f', label: 'Command and Control' },
        ],
      };
      expect(mapStateToProps(initialState)).toEqual(expectedResponse);
    });
  });
});
