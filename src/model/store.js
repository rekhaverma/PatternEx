// import { Iterable } from 'immutable';
import { addLocaleData } from 'react-intl';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { intlReducer } from 'react-intl-redux';

/* Redux Devtools */
import { composeWithDevTools } from 'redux-devtools-extension';

/* Redux middlewares */
import thunk from 'redux-thunk';

/* i18n locales */
import enLocaleData from 'react-intl/locale-data/en';

/* Reducers */
import filters from './reducers/filters.reducer';
import data from './reducers/data';
import timeline from './reducers/timeline.reducer';
import ui from './reducers/ui.reducer';
import raw from './reducers/raw.reducer';
import maliciousActivity from './reducers/malicious-activity.reducer';
import zeppelin from './reducers/zeppelin.reducer';
import location from './reducers/location.reducer';
import session from './reducers/session.reducer';
import logManager from './reducers/log-manager.reducer';

/* Actions */
import { defaultIntl } from './actions/i18n.actions';

addLocaleData([
  ...enLocaleData,
]);

/**
 * Transform Immutable state to JavaScript state
 */
// const stateTransformer = (state) => {
//   if (Iterable.isIterable(state)) return state.toJS();
//   return state;
// };

export default () => {
  const routingMiddleware = routerMiddleware(browserHistory);
  const middlewares = [thunk, routingMiddleware];

  const createMiddlewareStore =
    composeWithDevTools(applyMiddleware(...middlewares))(createStore);
  return createMiddlewareStore(
    combineReducers({
      'app': combineReducers({
        ui,
        filters,
        timeline,
        maliciousActivity,
        zeppelin,
      }),
      data,
      raw,
      'routing': routerReducer,
      'intl': intlReducer,
      location,
      session,
      logManager,
    }),
    defaultIntl,
  );
};
