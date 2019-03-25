import { ptrxZeppelin } from 'lib/rest';
import { arrayToObject } from 'lib/decorators';
import { zeppelinConfig } from 'config';

import { addNotification } from './ui.actions';
import { setEntityAutocorrelated } from './relations.actions';

import Zeppelin from '../classes/zeppelin.class';

export const GET_NOTEBOOK = '@@zeppelin/GET_NOTEBOOK';
export const GET_NOTEBOOK_COMPLETE = '@@zeppelin/GET_NOTEBOOK_COMPLETE';

export const UPDATE_STATUSES = '@@zeppelin/UPDATE_STATUSES';
export const START_AUTOCORRELATE = '@@zeppelin/START_AUTOCORRELATE';
export const FINISH_AUTOCORRELATE = '@@zeppelin/FINISH_AUTOCORRELATE';
export const DISABLE_ZEPPELIN = '@@zeppelin/DISABLE_ZEPPELIN';

export const fetchNotebookById = notebookId => async (dispatch) => {
  try {
    const notebook = await Zeppelin.getNotebookById(notebookId);
    const paragraphs = await Zeppelin.getParagraphsById(
      notebookId,
      notebook.paragraphs,
    );

    dispatch({
      'type': GET_NOTEBOOK_COMPLETE,
      'payload': {
        'id': notebook.id,
        'paragraphs': arrayToObject(paragraphs, 'id'),
      },
    });
  } catch (error) {
    dispatch({ 'type': DISABLE_ZEPPELIN });

    if (error.message.includes('JSON')) {
      dispatch(addNotification('error', `Output of ${zeppelinConfig.notebookName} is corrupt.\n Autocorrelate will be disabled.`));
      throw error;
    }

    dispatch(addNotification('error', `Fetching notebook ${zeppelinConfig.notebookName} failed.\n Autocorrelate will be disabled.`));
    throw error;
  }
};

export const getNotebooks = () => async (dispatch, getState) => {
  const notebookId = getState().app.zeppelin.get('notebookId');

  if (notebookId !== '') {
    return;
  }

  try {
    dispatch({ 'type': GET_NOTEBOOK });
    const notebooks = await ptrxZeppelin('/notebook');
    let graphAnalysisNotebookId = '';

    if (Object.keys(notebooks.data).includes('body')) {
      graphAnalysisNotebookId = Zeppelin.findGraphAnalysisNotebook(notebooks.data.body);
    }

    if (graphAnalysisNotebookId === '') {
      dispatch({ 'type': DISABLE_ZEPPELIN });
      dispatch(addNotification('error', `Notebook ${zeppelinConfig.notebookName} not found.\n Autocorrelate will be disabled`));
    } else {
      dispatch(fetchNotebookById(graphAnalysisNotebookId));
    }
  } catch (error) {
    dispatch({ 'type': DISABLE_ZEPPELIN });
    dispatch(addNotification('error', 'Fetching notebooks failed.\n Autocorrelate will be disabled.'));
    throw error;
  }
};

export const startAutocorrelate = (body, notebookdId = zeppelinConfig.readerGraphParagraph) =>
  async (dispatch, getState) => {
    const notebookId = getState().app.zeppelin.get('notebookId');
    const paragraph = getState().app.zeppelin.get('paragraphs').first();
    try {
      const urlId = notebookdId === '' ? paragraph.get('id') : notebookdId;
      const response = await ptrxZeppelin.post(`notebook/job/${notebookId}/${urlId}`, body);
      dispatch(addNotification('info', 'Autocorrelate started'));
      if (response.status === 200) {
        dispatch({ 'type': START_AUTOCORRELATE });
        Zeppelin.watchStatus(
          notebookId,
          () => {
            dispatch({ 'type': FINISH_AUTOCORRELATE });
            dispatch(fetchNotebookById(notebookId));
            dispatch(setEntityAutocorrelated(body.params.cluster, body.params.central));
            dispatch(addNotification('success', 'Autocorrelate finished'));
          },
          () => {
            dispatch({ 'type': FINISH_AUTOCORRELATE });
            dispatch(fetchNotebookById(notebookId));
            dispatch(addNotification('error', 'Autocorrelate failed'));
          },
          (data) => {
            dispatch({ 'type': UPDATE_STATUSES, 'payload': arrayToObject(data, 'id') });
          },
        );
      }
    } catch (error) {
      dispatch({ 'type': DISABLE_ZEPPELIN });
      dispatch(addNotification('error', 'Autocorrelate failed to start'));
      throw error;
    }
  };
