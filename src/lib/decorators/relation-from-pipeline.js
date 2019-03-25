export default (params) => {
  const relationData = {};

  if (params) {
    const pipeline = params.pipeline;
    const entityName = params.entityName;

    relationData.entityType = params.entityType;
    relationData.entityName = entityName;

    switch (pipeline) {
      case 'user':
        relationData.relatedType = 'ip';
        relationData.relation = undefined;
        relationData.targetPipeline = 'hpa';
        break;
      case 'useraccess':
        relationData.relatedType = 'ip';
        relationData.relation = undefined;
        relationData.targetPipeline = 'sip';
        break;
      case 'sipdip':
        relationData.relatedType = 'ip';
        relationData.relation = 'sipdip';
        relationData.entityType = 'ip';
        relationData.entityName = entityName && entityName.split(' ')[0];
        relationData.targetPipeline = 'dip';
        break;
      case 'dip':
        relationData.relatedType = 'ip';
        relationData.relation = 'dipsip';
        relationData.targetPipeline = 'sip';
        break;
      case 'sip':
        relationData.relatedType = 'ip';
        relationData.relation = 'sipdip';
        relationData.targetPipeline = 'dip';
        break;
      case 'hpa':
        relationData.relatedType = 'user';
        relationData.relation = undefined;
        relationData.targetPipeline = 'user';
        break;
      case 'domain':
        relationData.relatedType = 'ip';
        relationData.relation = undefined;
        relationData.targetPipeline = 'sip';
        break;
      case 'sipdomain':
        relationData.relatedType = 'domain';
        relationData.relation = undefined;
        relationData.entityType = 'ip';
        relationData.entityName = entityName && entityName.split(' ')[0];
        relationData.targetPipeline = 'domain';
        break;
      default:
        relationData.relatedType = undefined;
        relationData.relation = undefined;
        relationData.entityType = undefined;
        relationData.entityName = undefined;
        relationData.targetPipeline = undefined;
    }
  }

  return relationData;
};
