import noAncestry from './no-ancestry';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('no-ancestry', () => {
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

  it('should return true because node doesn\'t exists in parent', () => {
    const mockNode = 'two-node';
    const mockParent = {
      parentNode: {
        parentNode: {
          parentNode: {
            parentNode: 'one-node',
          },
        },
      },
    };

    expect(noAncestry(mockParent, mockNode)).toEqual(true);
  });
});