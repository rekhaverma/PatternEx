export const SET_CLUSTER = '@@cluster/SET_CLUSTER';
export const SET_PIPELINES = '@@cluster/SET_PIPELINES';

export const setCluster = clusterId => ({
  'type': SET_CLUSTER,
  'payload': clusterId,
});

export const setPipelines = data => (dispatch, getState) => {
  const pipelines = getState().app.ui.get('pipelines').toJS();

  if (typeof data === 'string') {
    if (pipelines.includes(data)) {
      dispatch({
        'type': SET_PIPELINES,
        'payload': pipelines.filter(pipe => pipe !== data),
      });
    } else {
      dispatch({
        'type': SET_PIPELINES,
        'payload': pipelines.concat([data]),
      });
    }
  }
  if (Array.isArray(data)) {
    dispatch({
      'type': SET_PIPELINES,
      'payload': data,
    });
  }
};
