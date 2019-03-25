import { updateIntl } from 'react-intl-redux';

import { enDashboard } from 'pages/dashboard/i18n';
import { enBehavior } from 'pages/behavior/i18n';
import { enPerformance } from 'pages/performance/i18n';
import { enNotification } from 'components/notification/i18n';
import { enAutocorrelation } from 'pages/autocorrelation/i18n';
import { enLabels } from 'pages/labels/i18n';
import { enPipeline } from 'pages/pipeline/i18n';
import { enModels } from 'pages/model/i18n';
import { enReports } from 'pages/reports/i18n';
import { enRules } from 'pages/rules/i18n';
import { enResources } from 'pages/resources/i18n';
import { enEVP } from 'pages/explodedview/i18n';
import { enHistoricalBehaviour } from 'pages/historical-behaviour-map/i18n';
import { enVulnerabilityReport } from 'pages/vulnerability-report-details/i18n';
import { enUploadFile } from 'pages/upload-file/i18n';
import { enLogin } from 'pages/login/i18n';
import { enLogout } from 'pages/logout/i18n';
import { enLogManager } from 'pages/log-manager/i18n';

export const enObj = {
  'locale': 'en',
  'messages': {
    ...enDashboard,
    ...enBehavior,
    ...enPerformance,
    ...enNotification,
    ...enLabels,
    ...enAutocorrelation,
    ...enPipeline,
    ...enModels,
    ...enReports,
    ...enRules,
    ...enResources,
    ...enEVP,
    ...enHistoricalBehaviour,
    ...enVulnerabilityReport,
    ...enUploadFile,
    ...enLogin,
    ...enLogout,
    ...enLogManager,
  },
};

const langs = { 'en': enObj };

export const defaultIntl = {
  'intl': {
    'defaultLocale': 'en-US',
    ...enObj,
  },
};

/**
 * Action dispatched when we change the language.
 * It's a wrapper for react-intl-redux action
 *
 * @param  {String} lang  New language
 * @return {Function}
 */
export const updateLangauge = lang => dispatch => dispatch(updateIntl(langs[lang]));
