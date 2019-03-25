import 'babel-polyfill';
import 'react-hot-loader/patch';
import 'react-dates/initialize';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Provider, { store } from 'model';

import Root from 'containers/root';
import App from 'containers/app';
import Dashboard from 'pages/dashboard';
import Behavior from 'pages/behavior/';
import Labels from 'pages/labels/';
import Autocorrelation from 'pages/autocorrelation';
import Performance from 'pages/performance/';
import Model from 'pages/model';
import Pipeline from 'pages/pipeline';
import Reports from 'pages/reports';
import { ReportDetail } from 'pages/reports/containers/reportDetail';
import Rules from 'pages/rules';
import Resources from 'pages/resources';
import ExplodedView from 'pages/explodedview';
import HistoricalBehaviourMap from 'pages/historical-behaviour-map';
import VulnerabilityReportDetails from 'pages/vulnerability-report-details';
import Login from 'pages/login';
import Logout from 'pages/logout';
import { LogManagerPage } from 'pages/log-manager';

import './style.scss';

const appStore = store(process.env.NODE_ENV);
const history = syncHistoryWithStore(browserHistory, appStore);

ReactDOM.render(
  <Provider store={appStore} >
    <Router history={history}>
      <Route component={Root}>
        <Route component={App} path="/">
          <Route component={Dashboard} path="dashboard" />
          <Route component={Behavior} path="behavior/malicious" />
          <Route component={Behavior} path="behavior/suspicious" />
          <Route component={Labels} path="labels" />
          <Route component={Autocorrelation} path="autocorrelation" />
          <Route component={Performance} path="performance" />
          <Route component={ExplodedView} path="exploded-view" />
          <Route component={Model} path="models" />
          <Route component={Pipeline} path="pipeline" />
          <Route component={Reports} path="reports" />
          <Route component={LogManagerPage} path="log-manager" />
          <Route component={ReportDetail} path="reportDetail" />
          <Route component={Rules} path="rules" />
          <Route component={Resources} path="resources" />
          <Route component={HistoricalBehaviourMap} path="historical-behaviour-map" />
          <Route component={VulnerabilityReportDetails} path="vulnerability-report" />
        </Route>
        <Route component={Login} path="/login" />
        <Route component={Logout} path="/logout" />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
