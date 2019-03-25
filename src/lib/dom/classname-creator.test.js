import classNameCreator from './classname-creator';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('classname-creator', () => {
  it('should return the class from props and state', () => {
    const mockProps = {
      active: 'idsIndicator',
      className: 'tabsV2',
      items: [
        { id: 'idsIndicator', 'title': 'IDS Indicators' },
        { id: 'exfilterationIndicator', 'title': 'Exfilteration' },
        { id: 'icmpIndicator', 'title': 'ICMP EXFILRATION AND TUNNELING' }],
      style: {
        margin: 10,
      },
      slim: true,
      customClassName: '',
      fullWidth: false,
    };
    const mockStates = [];
    const mockBase = 'tabsV2';

    expect(classNameCreator(mockProps, mockStates, mockBase)).toEqual('tabsV2');
  });
});