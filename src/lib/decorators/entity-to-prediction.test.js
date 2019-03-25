import entityToPrediction from './entity-to-prediction';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('entity-to-prediction.test', () => {
  it('should return the correct entity format', () => {
    const mockData = {
      entity_name: 'entityName',
      entity_type: 'entityType',
    };

    const expectedData = {
      entity_name: 'entityName',
      entity_type: 'entityType',
      tags: ['entityType'],
    };

    expect(entityToPrediction(mockData, true)).toEqual(expectedData);
  });
});