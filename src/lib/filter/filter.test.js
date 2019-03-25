import filter from './index';

/**
 * @status: WIP
 * @sign-off-by: Alex Andries
 * @todo: check if function is used
 */
describe.skip('filter', () => {
  it('should return false because node exists in parent', () => {
    const mockNode = 'one-node';
    const mockParent = {
      parentNode: {
        parentNode: {
          parentNode: {
            parentNode: 'one-node',
          },
        },
      },
    };

    expect(noAncestry(mockParent, mockNode)).toEqual(false);
  });
});