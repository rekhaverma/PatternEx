export default (name) => {
  switch (name.toLowerCase()) {
    case 'source ip':
      return 'sip';

    case 'destination ip':
      return 'dip';

    case 'connection':
      return 'sipdip';

    case 'session':
      return 'sipdomain';

    case 'user access':
      return 'useraccess';

    case 'user name':
      return 'username';

    case 'domain':
    case 'user':
    case 'hpa':
    case 'login':
    case 'request':
      return name.toLowerCase();

    default:
      return name;
  }
};
