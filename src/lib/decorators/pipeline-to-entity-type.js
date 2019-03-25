export default (pipeline) => {
  switch (pipeline) {
    case 'user':
      return 'user';
    case 'useraccess':
    case 'username':
      return 'username';
    case 'sipdip':
      return 'sipdip';
    case 'dip':
    case 'sip':
    case 'hpa':
      return 'ip';
    case 'domain':
      return 'domain';
    case 'sipdomain':
      return 'sipdomain';
    case 'request':
      return 'request';
    default:
      return 'ip';
  }
};
