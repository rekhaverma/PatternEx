import React from 'react';
import moment from 'moment';
import { fromJS } from 'immutable';

import { MaliciousTimeline, mapStateToProps } from './malicious-timeline.container';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<MaliciousTimeline />', () => {
  describe('render: ', () => {
    it('should match with snapshot', () => {
      const props = {
        items: {},
        startDate: moment.utc('2018-08-06').startOf('day'),
        endDate: moment.utc('2018-08-10').endOf('day'),
        resetDayClick: jest.fn(),
        onDayClick: jest.fn(),
      };
      const wrapper = shallow(<MaliciousTimeline {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mapStateToProps: ', () => {
    it('should return chart items', () => {
      const initialState = {
        raw: fromJS({
          behaviorSummary: [
            {
              entity_pipeline_map: {
                destination_ip: [
                  'dip',
                ],
                source_ip: [
                  'sip',
                  'hpa',
                ],
                domain: [
                  'domain',
                ],
                connection: [
                  'sipdip',
                ],
                session: [
                  'sipdomain',
                  'request',
                ],
                user: [
                  'user',
                  'useraccess',
                ],
              },
              total_malicious_behavior: 0,
              total_suspicious_behavior: 142,
              method_wise_suspicious_behavior: {
                ranking: 142,
              },
              malicious_pipeline_tactic_map: {},
              pipeline_wise_suspicious_behavior: {
                domain: 11,
                sipdomain: 131,
              },
              href: '/api/v0.2/behaviorsummary',
              day_ts: '1521504000',
            },
            {
              entity_pipeline_map: {
                destination_ip: [
                  'dip',
                ],
                source_ip: [
                  'sip',
                  'hpa',
                ],
                domain: [
                  'domain',
                ],
                connection: [
                  'sipdip',
                ],
                session: [
                  'sipdomain',
                  'request',
                ],
                user: [
                  'user',
                  'useraccess',
                ],
              },
              total_malicious_behavior: 0,
              total_suspicious_behavior: 0,
              method_wise_suspicious_behavior: {},
              malicious_pipeline_tactic_map: {},
              pipeline_wise_suspicious_behavior: {},
              href: '/api/v0.2/behaviorsummary',
              day_ts: '1521936000',
            },
          ],
          relations: {
            selected: '',
            items: {},
            filters: {
              active: {},
            },
            dashboardLink: '',
          },
        }),
      };
      const expectedResponse = {
        '1521504000000':
          {
            clusters: 0,
            malicious: 0,
            suspicious: 142,
          },
      };
      expect(mapStateToProps(initialState).items).toEqual(expectedResponse);
    });
  });
});
