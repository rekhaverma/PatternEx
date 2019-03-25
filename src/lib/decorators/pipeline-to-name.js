export default (pipeline = '') => {
  if (typeof pipeline === 'string') {
    switch (pipeline.toLowerCase()) {
      case 'srcip':
      case 'sip':
        return 'Source IP';

      case 'dstip':
      case 'dip':
        return 'Destination IP';

      case 'domain':
        return 'Domain';

      case 'sipdip':
        return 'Connection';

      case 'sipdomain':
        return 'Session';

      case 'user':
        return 'User';

      case 'hpa':
      case 'login':
        return 'HPA';

      case 'username':
        return 'Username';

      case 'user access':
      case 'useraccess':
        return 'User Access';

      case 'request':
        return 'Request';

      case 'ip':
        return 'IP';

      default:
        return pipeline;
    }
  }
  return '';
};
