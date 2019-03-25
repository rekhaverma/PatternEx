// import serverConfig from '../../server-config.json';VULNERABILITY_TABLE

export const ENVS = {
  'DEV': 'development',
  'PROD': 'production',
};

export const behaviours = {
  'MALICIOUS': 'malicious',
  'SUSPICIOUS': 'suspicious',
};

export const zeppelinConfig = {
  'notebookName': '', // serverConfig.notebookName || 'GraphAnalysis',
  'readerGraphParagraph': '', // serverConfig.readerGraphParagraph || '20180108-133707_238589805',
  'expandedGraphParagraph': '', // serverConfig.expandedGraphParagraph || '20180111-130541_326526500',
  'normalGraphParagraph': '', // serverConfig.normalGraphParagraph || '20180111-130541_326526500',
  'timeoutPolling': 60000 * 5, // 5 minutes (in ms)
  'intervalPolling': 500, // 500 ms
  'entityTypesGroups': [
    'srcip', // 0
    'dstip', // 1
    'domain', // 2
    'user', // 3
  ],
};

export const PREDICTION_ACTIONS = {
  'CONFIRM': 'confirm',
  'DENY': 'deny',
};

export const api = {
  'base': process.env.NODE_ENV === 'production' ? '/api' : 'https://localhost:8443/api',
  'zeppelin': process.env.NODE_ENV === 'production' ? '/zepplin/api' : 'https://54.69.30.250:8443/zepplin/api',
  'ambari': process.env.NODE_ENV === 'production' ? '/api' : 'https://54.69.30.250:8443/api',
  'version': 'v0.2',
  'withCredentials': true,
};

export const tagsMap = {
  'discovery': ['discovery'],
  'delivery': ['delivery'],
  'lateral movement': ['lateral movement', 'credential access'],
  'command and control': ['command and control'],
  'exfiltration': ['exfiltration', 'denial os service', 'cc fraud', 'tos abuse', 'hpa'],
};

export const sidebarMenuWidth = 94;

export const sidebarMenuItems = [
  {
    'id': 'dashboard',
    'label': 'Dashboard',
    'location': '/dashboard',
    'icon': 'icon-dashboard2',
    'type': 'link',
    'params': ['start_time', 'end_time'],
  },
  {
    'id': 'malicious',
    'label': 'Malicious',
    'location': '/behavior/malicious',
    'icon': 'icon-malicious',
    'type': 'link',
    'params': ['start_time', 'end_time'],
  },
  {
    'id': 'suspicious',
    'label': 'Suspicious',
    'location': '/behavior/suspicious',
    'icon': 'icon-suspicious',
    'type': 'link',
    'params': ['start_time', 'end_time'],
  },
  {
    'id': 'autocorrelateLink',
    'label': 'Autocorrelation',
    'location': '/autocorrelation',
    'icon': 'icon-atoms',
    'type': 'link',
    'params': ['start_time', 'end_time'],
  },
  // {
  //   'id': 'correlation',
  //   'label': 'Correlation',
  //   'location': '/correlation',
  //   'icon': 'icon-atoms',
  //   'type': 'link',
  //   'params': ['start_time', 'end_time'],
  // },
  {
    'id': 'reports',
    'label': 'Reports',
    'location': '/reports',
    'icon': 'icon-presentation',
    'type': 'dropdown',
    'items': [
      {
        'id': 'resultsDashboardLink',
        'label': 'Pipeline',
        'location': '/pipeline',
        'icon': 'icon-shield',
        'type': 'link',
      },
      {
        'id': 'customReportsDashboardLink',
        'label': 'Custom Reports',
        'icon': 'icon-line-chart',
        'type': 'link',
        'location': '/reports',
      },
      {
        'id': 'labelsDashboardLink',
        'label': 'Labels',
        'icon': 'icon-tag',
        'type': 'link',
        'location': '/labels',
      },
      {
        'id': 'performance',
        'label': 'Performance',
        'location': '/performance',
        'icon': 'icon-bar-chart',
        'type': 'link',
        'params': ['start_time', 'end_time'],
      },
    ],
  },
  {
    'id': 'logManager',
    'label': 'Log Manager',
    'location': '/log-manager',
    'icon': 'icon-log-manager',
    'type': 'link',
  },
  {
    'id': 'analyticsDashboardLink',
    'label': 'Analytics',
    'location': '/analytics',
    'icon': 'icon-pie-chart2',
    'type': '',
  },
  {
    'id': 'apidocSwagger',
    'label': 'API Doc',
    'location': '/apidoc',
    'icon': 'icon-folder',
    'type': '',
  },
  {
    'id': 'models',
    'label': 'Models',
    'location': '/models',
    'icon': 'icon-code',
    'type': 'link',
    'params': ['start_time', 'end_time'],
  },
  {
    'id': 'healthContainer',
    'label': 'System Health',
    'icon': 'icon-heartbeat',
    'type': '',
  },
];

export const dashboardTabs = [
  { 'id': 'malicious', 'title': 'Malicious' },
  { 'id': 'suspicious', 'title': 'Suspicious' },
  { 'id': 'correlations', 'title': 'Autocorrelations' },
];

export const timeConstants = {
  'CLOSE_TIME': 5000,
};

export const ambariServices = {
  'statuses': {
    'green': ['STARTED', 'OK'],
    'warning': ['WARNING'],
    'critical': ['CRITICAL'],
    'list': [],
  },
  'cluster': 'ptrx',
  'timeoutPolling': -1,
  'intervalPolling': 1000 * 30, // 30 seconds
  'services': {
    'disk_usage': {
      'name': 'DISK USAGE',
      'order': 1,
    },
    'log_ingestion': {
      'name': 'LOG INGESTION',
      'order': 2,
    },
    'hdfs': {
      'name': 'HDFS',
      'order': 3,
      'components': ['NAMENODE', 'DATANODE'],
    },
    'yarn': {
      'name': 'YARN',
      'order': 4,
      'components': ['NODEMANAGER', 'RESOURCEMANAGER'],
    },
    'kafka': {
      'name': 'KAFKA',
      'order': 5,
      'components': ['KAFKA_BROKER'],
    },
  },
};

export const pipelineTypes = [
  {
    'content': 'Predictions',
    'id': 'classifier',
  },
  {
    'content': 'Outliers',
    'id': 'ranking',
  },
  // {
  //   'content': 'Analytics',
  //   'id': 'analytics',
  // },
];

export const dataMode = [
  {
    'content': 'Batch',
    'id': 'batch',
  },
  {
    'content': 'Real time',
    'id': 'realtime',
  },
];

export const typeOfSuspicious = [
  { 'id': 'all', 'label': 'All Suspicious' },
  { 'id': 'ranking', 'label': 'Outlier' },
  { 'id': 'classifier', 'label': 'Low Confidence Predictions' },
  { 'id': 'threat-intel', 'label': 'Threat Intel' },
  { 'id': 'recommendation', 'label': 'Recommendations' },
];

export const dateFormats = {
  'longFormatWithOffset': 'ddd, DD MMM YYYY hh:mm:ss ZZ',
  'longFormatWithTimeZone': 'ddd, DD MMM YYYY hh:mm:ss z',
  'longFormatWithOffset2': 'YYYY-MM-DD HH:mm:ssZZ',
  'longFormatWithoutOffset': 'ddd, DD MMM YYYY hh:mm:ss',
  'longFormatWithTimeZoneAMPM': 'ddd, DD MMM YYYY hh:mm:ss A z',
  'displayFormat': 'MM/DD/YYYY hh:mm A',
  'apiSendFormat': 'YYYY-MM-DD',
  'mmddyyyySlash': 'MM/DD/YYYY',
  'ddmmyyDash': 'DD-MM-YY',
  'mmddyySlash': 'MM/DD/YY',
  'shortFormat': 'HH:mm',
  'YYYYMMDD': 'YYYYMMDD',
  'unix': 'X',
  'longFormatWithoutYear': 'MM/DD/YY HH:mm',
  'datePickerParserFormat': 'yy-mm-dd',
  'us': 'MM - DD - YYYY',
  'longFormatWithUTC': 'ddd, DD MMM YYYY (HH:mm:ss UTC)',
  'mmddyyDash': 'MM-DD-YYYY',
  'displayFormatUS': 'MM-DD-YYYY hh:mm A',
};

export const defaultRoute = '/dashboard';

export const DASHBOARD_MALICIOUS_TABLE = '@dashboard/malicious/table';
export const DASHBOARD_SUSPICIOUS_TABLE = '@dashboard/suspicious/table';
export const DASHBOARD_AUTOCORRELATION_TABLE = '@dashboard/autocorrelation/table';
export const MALICIOUS_TABLE = '@malicious/table';
export const SUSPICIOUS_TABLE = '@suspicious/table';
export const ANALYTICS_LOGS_TABLE = '@evp/analyticslogs/table';
export const ANALYTICS_LOGS_SECOND_TABLE = '@evp/analyticslogssecond/table';
export const DHCP_TABLE = '@evp/dhcp/table';
export const EXTERNAL_TABLE = '@evp/external/table';
export const GEOLOCATION_TABLE = '@evp/geolocation/table';
export const HBM_TABLE = '@evp/hbm/table';
export const VULNERABILITY_TABLE = '@vulnerability/table';
