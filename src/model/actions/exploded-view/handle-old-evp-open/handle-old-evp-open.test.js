import moment from 'moment';
import { handleOldExplodedView } from './handle-old-evp-open.no-action';

describe('handle-old-evp-open.no-action', () => {
  beforeEach(() => {
    global.localStorage = jest.fn();
    global.localStorage.setItem = jest.fn();
    Object.defineProperty(window.location, 'origin', {
      value: '/current-url',
    });
  });

  it('should save the data to localStorage for non-pipeline', () => {
    const mockData = {
      end_time: '2018-08-01',
      start_time: '2018-08-02',
      start_time_moment: moment.utc('2018-08-01'),
      end_time_moment: moment.utc('2018-08-02'),
    };

    const expectedData = JSON.stringify({
      end_time: '2018-08-01',
      start_time: '2018-08-02',
      start_time_moment: moment.utc('2018-08-01'),
      end_time_moment: moment.utc('2018-08-02'),
      behaviorType: 'suspicious',
    });

    handleOldExplodedView(mockData, 'suspicious');
    expect(global.localStorage.setItem.mock.calls[0][1]).toEqual(expectedData);
  });

  it('should save the data to localStorage for pipeline', () => {
    const mockData = {
      end_time: '2018-08-01',
      start_time: '2018-08-02',
      start_time_moment: moment.utc('2018-08-01'),
      end_time_moment: moment.utc('2018-08-02'),
      pipeline: 'sip',
      srcip: '123.123.123.0',
      mode: 'realtime',
      model_type: 'model_type',
    };

    const expectedData = JSON.stringify({
      end_time: '2018-08-01',
      start_time: '2018-08-02',
      start_time_moment: '2018-08-01T00:00:00.000Z',
      end_time_moment: '2018-08-02T00:00:00.000Z',
      pipeline: 'sip',
      srcip: '123.123.123.0',
      mode: 'realtime',
      model_type: 'model_type',
      entity_name: '123.123.123.0',
      entity_type: 'ip',
      modeType: 'realtime',
      featureAvailable: true,
      behaviorType: 'pipeline',
    });

    handleOldExplodedView(mockData, 'pipeline');
    expect(global.localStorage.setItem.mock.calls[0][1]).toEqual(expectedData);
  })
  ;
});