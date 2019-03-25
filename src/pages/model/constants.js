export const tabs = [{
  'id': 'success',
  'title': 'Success',
},
{
  'id': 'failed',
  'title': 'Failed',
},
];

export const sizePerPageTable = [{
  'text': '5 results',
  'value': 5,
}, {
  'text': '10 results',
  'value': 10,
}, {
  'text': '20 results',
  'value': 20,
}, {
  'text': '50 results',
  'value': 50,
}, {
  'text': '75 results',
  'value': 75,
}, {
  'text': '100 results',
  'value': 100,
}];

export const modelsListingColumns = [{
  'data': 'name',
  'title': 'Model name',
}, {
  'data': 'model_alias_formatted',
  'title': 'Model alias',
}, {
  'data': 'pipeline',
  'title': 'Entity type',
}, {
  'data': 'model_type_formatted',
  'title': 'Model type',
}, {
  'data': 'stats',
  'title': 'Stats',
  'format': 'formatStats',
}, {
  'data': 'mode',
  'title': 'Mode',
  'format': 'formatMode',
}, {
  'data': 'create_date_formatted',
  'title': 'Created on',
  'format': 'formatCreateDate',
}, {
  'data': 'dep_ts_formatted',
  'title': 'Deployed on',
  'format': 'formatDeployDate',
}, {
  'data': 'isDeployed',
  'title': 'Status',
  'format': 'formatStatus',
}, {
  'data': 'isDeployed',
  'title': 'Action',
  'format': 'formatAction',
  'width': '150',
}];


export const modelTypes = [{
  'id': 'classifier',
  'content': 'Classifier',
}, {
  'id': 'ranking',
  'content': 'Outlier',
}, {
  'id': 'recommendation',
  'content': 'Recommendation',
}];

export const allModelStates = [{
  'id': '',
  'content': 'All Models',
}];
export const modelStates = [{
  'id': 'deployed',
  'content': 'All Deployed Models',
}, {
  'id': 'main',
  'content': 'Primary Models',
}, {
  'id': 'secondary',
  'content': 'Secondary Models',
}, {
  'id': 'undeployed',
  'content': 'Not Deployed',
}];
