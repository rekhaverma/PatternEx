import { getEvpUrlHandler } from './open-evp-url.no-action';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('open-evp-url', () => {
  let mockRow = {};
  beforeEach(() => {
    mockRow = {
      start_time: 'Mon, 05 Feb 2018 10:56:00 -0000',
      end_time: 'Mon, 05 Feb 2018 10:56:00 -0000',
      entity_name: '64.74.133.82',
      pipeline: 'sip',
      modeType: 'realtime',
      model_name: '2017-08-27-Classifier-Sip-1',
      goBackHash: '123',
    };
  });
  it('should return the evp url', () => {
    const expectedUrl = '/exploded-view?start_time=02-05-2018&end_time=02-05-2018&entity_name=64.74.133.82&pipeline=sip&mode=realtime&model_name=2017-08-27-Classifier-Sip-1';

    expect(getEvpUrlHandler(mockRow)).toEqual(expectedUrl);
  });

  it('should return the evp url with entity id', () => {
    mockRow.id = '2692e000-0a63-11e8-872e-2169f7eda48d';
    const expectedUrl = '/exploded-view?start_time=02-05-2018&end_time=02-05-2018&entity_name=64.74.133.82&pipeline=sip&mode=realtime&model_name=2017-08-27-Classifier-Sip-1&entity_id=2692e000-0a63-11e8-872e-2169f7eda48d';

    expect(getEvpUrlHandler(mockRow)).toEqual(expectedUrl);
  });

  it('should return the evp url with method name', () => {
    mockRow.method_name = 'classifier';
    const expectedUrl = '/exploded-view?start_time=02-05-2018&end_time=02-05-2018&entity_name=64.74.133.82&pipeline=sip&mode=realtime&model_name=2017-08-27-Classifier-Sip-1&behaviorType=suspicious&method_name=classifier';

    expect(getEvpUrlHandler(mockRow, 'suspicious')).toEqual(expectedUrl);
  });

  it('should return the evp url for pipeline', () => {
    mockRow.method_name = 'classifier';
    mockRow.srcip = 'entity_name';
    mockRow.mode = 'realtime';
    mockRow.selectedModel = 'Unknown-Classifier-Sip';
    mockRow.model_type = 'model_type';
    mockRow.origin = 'pipeline';
    mockRow.start_time = null;
    mockRow.end_time = null;
    mockRow.timestamp = '1517788800';
    const expectedUrl = '/exploded-view?start_time=02-05-2018&end_time=02-05-2018&entity_name=entity_name&pipeline=sip&mode=realtime&model_name=Unknown-Classifier-Sip&behaviorType=pipeline&entity_type=ip&model_type=model_type&origin=pipeline';

    expect(getEvpUrlHandler(mockRow, 'pipeline')).toEqual(expectedUrl);
  });
});