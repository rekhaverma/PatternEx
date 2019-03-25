import { locationBackUrl } from 'lib';
import { getEvpUrlHandler, handleOldExplodedView } from 'model/actions/exploded-view';

import EvpOpenMethods from './evp-open-methods.class';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
jest.mock('lib');
jest.mock('model/actions/exploded-view');
let handleOldExplodedViewCallsCount = 0;
locationBackUrl.setBackUrl.mockImplementation(() => jest.fn());
getEvpUrlHandler.mockImplementation(() => 'evp-url');
handleOldExplodedView.mockImplementation(() => handleOldExplodedViewCallsCount += 1);

describe('evp-open-methods', () => {
  let row;
  let behaviorType;
  let isOldEVPActive;

  beforeEach(() => {
    row = {
      create_time: '03 - 20 - 2018',
      entity_name: 'komprise.com',
      entity_type: 'domain',
      start_time: 'Sun, 11 Mar 2018 00:00:00 -0000',
      end_time: 'Sun, 11 Mar 2018 00:00:00 -0000',
      pipeline: 'domain',
      id: '68c61c06-2c75-11e8-9bb2-0a75d54c5790',
      global_rank: 88,
      method_score: 100,
      start_time_moment: '2018-03-11T00:00:00.000Z',
      end_time_moment: '2018-03-11T00:00:00.000Z',
      method_name: 'ranking',
      start_time_formatted: '03 - 11 - 2018',
      modeType: 'batch',
      model_name: '2017-07-04-Ranking-Domain-1',
      user_tag: {
        label_id: '2ec212d7-bd1b-4624-8a32-13f703f22831',
        system_tag: true,
        name: 'Benign',
        severity: 0,
        alert: false,
        type: 'N',
        id: 'ebdad7ea-efa1-4c54-8c71-eff30b7aa4e1',
        description: 'System Benign tag',
      },
    };
    behaviorType = 'pipeline';
    handleOldExplodedViewCallsCount = 0;
  });

  describe('onRowClickHandler method', () => {
    let handleExplodedView;
    beforeEach(() => handleExplodedView = jest.fn());

    it('should `handleExplodedView`', () => {
      isOldEVPActive = false;
      EvpOpenMethods.onRowClickHandler(row, behaviorType, isOldEVPActive, handleExplodedView);

      expect(handleExplodedView.mock.calls.length).toBe(1);
    });

    it('should trigger `handleOldExplodedView`', () => {
      isOldEVPActive = true;

      EvpOpenMethods.onRowClickHandler(row, behaviorType, isOldEVPActive, handleExplodedView);

      expect(handleOldExplodedViewCallsCount).toBe(1);
    });
  });

  describe('onInspectHandler', () => {
    it('should trigger `handleOldExplodedView`', () => {
      isOldEVPActive = true;

      EvpOpenMethods.onInspectHandler(row, behaviorType, isOldEVPActive);
      expect(handleOldExplodedViewCallsCount).toBe(1);
    });

    it('should not trigger `handleOldExplodedView`', () => {
      isOldEVPActive = false;

      EvpOpenMethods.onInspectHandler(row, behaviorType, isOldEVPActive);
      expect(handleOldExplodedViewCallsCount).toBe(0);
    });
  });

  describe('getNewTabUrlHandler', () => {
    it('should return false', () => {
      isOldEVPActive = true;

      expect(EvpOpenMethods.getNewTabUrlHandler(row, behaviorType, isOldEVPActive)).toBe(false);
    });

    it('should return evp url', () => {
      isOldEVPActive = false;

      expect(EvpOpenMethods.getNewTabUrlHandler(row, behaviorType, isOldEVPActive)).toBe('evp-url');
    });
  });
});