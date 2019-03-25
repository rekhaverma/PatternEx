import React from 'react';
import moment from 'moment';
import { capitalizeFirstLetter } from 'lib';

const formatStatus = (cell, row) => {
  let status;
  if (row) {
    if (row.isDeployed && !row.isFailed) {
      if (row.isPrimary) {
        status = (
          <span className="deployedPrimary" title="Deployed as primary">
            <b>Deployed as primary</b>
          </span>
        );
      } else {
        status = (
          <span className="deployedSecondary" title="Deployed as secondary">
            <b>Deployed as secondary</b>
          </span>
        );
      }
    } else if (row.training_status && row.training_status.toLowerCase() === 'training') {
      status = (<span className="inTraining" title="Training..."><b>Training...</b></span>);
    } else if (row.isFailed) {
      status = (<span className="trainingFailed" title="Failed"><b>Failed</b></span>);
    } else {
      status = (
        <span className="trainedNotDeployed" title="Trained but not deployed">
          <b>Trained but not deployed</b>
        </span>
      );
    }
  } else {
    status = '';
  }
  return status;
};

const formatStats = (cell, row) => {
  let formatedStat;
  if (row && row.model_type === 'Classifier' && row.stats && !row.isFailed) {
    const auc = row.stats.auc ? row.stats.auc : 'NA';
    const tpr = row.stats.tpr ? row.stats.tpr : 'NA';
    const pdr = row.stats.pdr ? row.stats.pdr : 'NA';
    formatedStat = `AUC: ${auc} , TPR: ${tpr} , PDR: ${pdr}`;
  } else {
    formatedStat = 'NA';
  }
  return formatedStat;
};

const trClassFormat = row => (row.isDeployed && !row.isFailed ? 'deployedRow' : '');

const getCaret = (direction) => {
  switch (direction) {
    case 'asc':
      return (<span className="icon-sort-asc" />);
    case 'desc':
      return (<span className="icon-sort-desc" />);
    default:
      return (<span className="icon-sort" />);
  }
};

const formatDate = (cell, row, type) => (row[type] ? moment.utc(row[type], 'X').format('ddd, DD MMM YYYY (hh:mm:ss z)') : '');

const formatMode = (cell, row) => {
  if (row.mode && typeof row.mode === 'string') {
    return capitalizeFirstLetter(row.mode);
  }
  return '';
};


export { formatStatus, formatStats, trClassFormat, getCaret, formatDate, formatMode };
