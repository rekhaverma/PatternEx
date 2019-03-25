import { combineReducers } from 'redux';
import entities from './entities.reducer';
import models from './models.reducer';
import settings from './settings.reducer';
import performancedetails from './performancedetails.reducer';
import labels from './labels.reducer';
import reports from './reports.reducer';
import rules from './rules.reducer';
import resources from './resources.reducer';
import users from './users.reducer';
import pipelines from './pipelines.reducer';

export default combineReducers({
  entities,
  models,
  performancedetails,
  labels,
  reports,
  rules,
  settings,
  resources,
  users,
  pipelines,
});
