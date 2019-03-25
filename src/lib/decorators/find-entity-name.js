export default (pipeline, data) => {
  let entityName = '';

  if (data) {
    switch (pipeline) {
      case 'sip':
        entityName = data.srcip;
        break;
      case 'sipdip':
        entityName = `${data.srcip} ${data.dstip}`;
        break;
      case 'dip':
        entityName = data.dstip;
        break;
      case 'hpa':
        entityName = data.ipv4;
        break;
      case 'user':
        entityName = data.user_id;
        break;
      case 'useraccess':
      case 'username':
        entityName = data.user;
        break;
      case 'domain':
        entityName = data.domain;
        break;
      case 'sipdomain':
        entityName = `${data.srcip} ${data.domain}`;
        break;
      case 'request':
        entityName = `${data.source_ip} ${data.uid}`;
        break;
      default:
    }
  }

  return entityName;
};
