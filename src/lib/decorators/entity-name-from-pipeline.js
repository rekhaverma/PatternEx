export default (data) => {
  const entityName = {
    domain: null,
    srcip: null,
  };

  if (data) {
    switch (data.pipeline) {
      case 'domain':
        entityName.domain = data.entity_name;
        break;
      case 'sipdomain':
        const dataSplit = data.entity_name.split(' ');
        entityName.domain = dataSplit[1];
        entityName.srcip = dataSplit[0];
        break;
      case 'sipdip':
        const sipdipsplit = data.entity_name.split(' ');
        entityName.srcip = sipdipsplit[0];
        break;
      default:
        entityName.srcip = data.entity_name;
        break;
    }
  }

  return entityName;
};

