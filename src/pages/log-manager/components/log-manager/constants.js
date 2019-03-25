import { getDeviceCategoriesOptions, getDeviceSubTypesOptions, getDeviceTypesOptions } from './utils';
import { timezones } from '../../timezones';

export const INPUT = 'input';
export const SELECT = 'select';
export const BUTTON = 'button';
export const INFO = 'information';
export const MULTI_STEP_SELECT = 'multiStepSelect';

const DEVICE_LABELS = {
  INDIVIDUAL_DEVICE: 'Individual Device',
  DEVICE_CATEGORY: 'Device Category',
  DEVICE_TYPE: 'Device Type',
  DEVICE_SUB_TYPE: 'Device Sub Type',
  DEVICE_NAME: 'Device Name',
  DEVICE_IP: 'Device IP',
  DEVICE_TIMEZONE: 'Device Timezone',
  SECURITY_GROUP: 'Security Group',
  GROUP_NAME: 'Group Name',
};
export const DEVICE_NAMES = {
  name: 'device',
  TEMPLATE: {
    name: 'device.tab',
  },
  INDIVIDUAL_DEVICE: {
    name: 'device.individualDevice',
    DEVICE_NAME: 'devicename',
    DEVICE_IP: 'deviceip',
    DEVICE_CATEGORY: 'devicecategory',
    DEVICE_TYPE: 'devicetype',
    DEVICE_SUB_TYPE: 'devicesubtype',
    DEVICE_TIMEZONE: 'timezone',
    SECURITY_GROUP: 'device.individualDevice.securityGroup',
  },
  DEVICE_TYPE: {
    name: 'device.deviceType',
    GROUP_NAME: 'device.deviceType.groupName',
    DEVICE_TYPE: 'device.deviceType.deviceType',
    SECURITY_GROUP: 'device.deviceType.securityGroup',
    DEVICE_IP: 'device.deviceType.deviceIP',
  },
};

const INPUT_LABELS = {
  TEMPLATE: 'Select Input Mechanism',
  SOURCE_IP: 'Source IP',
  NETWORK: 'Network',
  GENERAL_LISTENERS: 'General Listeners',
  SYSLOG: 'Syslog',
  KAFKA: 'Kafka',
  RAW: 'Raw',
  NETFLOW: 'Netflow',
  FILE: 'File',
  S3: 'S3',
  SCHEDULED_FILE: 'Scheduled File',
  GUI_UPLOAD: 'GUI Upload',
  PORT: 'Port',
  SELECT_FORMAT: 'Select Format',
  FORMAT: 'Format',
  VERSION: 'Version',
  UDP_PORT: 'UDP Port',
  PATH: 'Path',
  TYPE: 'Type',
  BUCKET_NAME: 'Bucket Name',
  FOLDER_NAME: 'Folder Name',
  ACCESS_KEY: 'Access Key',
  FILE_NAME: 'File Name',
  CHOOSE_FILE: 'Choose File',
  SELECT_LISTENER: 'Select Listener',
  LISTENER: 'Listener',
  NETWORK_SYSLOG_TCP: 'TCP/UDP/TLS',
  NETWORK_RAW_TCP: 'TCP/UDP',
  TOPIC: 'Topic',
};
const INPUT_TEMPLATES = {
  SOURCE_IP: INPUT_LABELS.SOURCE_IP,
  NETWORK_GENERAL_LISTENERS: `${INPUT_LABELS.NETWORK}_${INPUT_LABELS.GENERAL_LISTENERS}`,
  NETWORK_SYSLOG: `${INPUT_LABELS.NETWORK}_${INPUT_LABELS.SYSLOG}`,
  NETWORK_KAFKA: `${INPUT_LABELS.NETWORK}_${INPUT_LABELS.KAFKA}`,
  NETWORK_RAW: `${INPUT_LABELS.NETWORK}_${INPUT_LABELS.RAW}`,
  NETWORK_NETFLOW: `${INPUT_LABELS.NETWORK}_${INPUT_LABELS.NETFLOW}`,
  FILE_S3: `${INPUT_LABELS.FILE}_${INPUT_LABELS.S3}`,
  FILE_SCHEDULED_FILE: `${INPUT_LABELS.FILE}_${INPUT_LABELS.SCHEDULED_FILE}`,
  FILE_GUI_UPLOAD: `${INPUT_LABELS.FILE}_${INPUT_LABELS.GUI_UPLOAD}`,
};
export const INPUT_NAMES = {
  name: 'input',
  TEMPLATE: {
    name: 'input.template',
  },
  NETWORK_SYSLOG: {
    name: 'input.Network_Syslog',
    LISTENER_TYPE: 'inputtype',
    PORT: 'port',
  },
  NETWORK_KAFKA: {
    name: 'input.Network_Kafka',
    TOPIC: 'input.Network_Kafka.topic',
  },
  NETWORK_RAW: {
    name: 'input.Network_Syslog',
    LISTENER_TYPE: 'inputtype',
    PORT: 'port',
    FORMAT: 'input.Network_Raw.format',
  },
  NETWORK_NETFLOW: {
    name: 'input.Network_Netflow',
    VERSION: 'version',
    UDP: 'port',
  },
  FILE_S3: {
    name: 'input.File_S3',
    BUCKET_NAME: 'input.File_S3.bucketName',
    FOLDER_NAME: 'input.File_S3.folderName',
    ACCESS_KEY: 'input.File_S3.accessKey',
    FILE_NAME: 'input.File_S3.fileName',
  },
  FILE_SCHEDULED_FILE: {
    name: 'input.File_Scheduled File',
    FORMAT: 'input.File_Scheduled File.format',
    PATH: 'inputpath',
  },
  FILE_GUI_UPLOAD: {
    name: 'input.File_GUI Upload',
    TYPE: 'input.File_GUI Upload.type',
    FORMAT: 'input.File_GUI Upload.format',
    FILE: 'path',
  },
};

const OUTPUT_LABELS = {
  TEMPLATE: 'Select Output Mechanism',
  KAFKA: 'Kafka Output',
  JSON: 'JSON Output',
  RUBY_DEBUG: 'Ruby Debug',
  RAW_CSV_DEBUG: 'Raw CSV Debug',
  TARGET: 'Target',
  SELECT_TEMPLATE: 'Select Template',
  SELECT_TOPIC: 'Select Topic',
  PATH: 'Path',
};
const OUTPUT_TEMPLATES = {
  KAFKA: OUTPUT_LABELS.KAFKA,
  JSON: OUTPUT_LABELS.JSON,
  RUBY_DEBUG: OUTPUT_LABELS.RUBY_DEBUG,
  RAW_CSV_DEBUG: OUTPUT_LABELS.RAW_CSV_DEBUG,
};
export const OUTPUT_NAMES = {
  name: 'output',
  TEMPLATE: {
    name: 'output.template',
  },
  KAFKA: {
    name: 'output.Kafka',
    TARGET: 'output.Kafka.target',
    TEMPLATE: 'output.Kafka.template',
  },
  RUBY_DEBUG: {
    name: 'output.Ruby Debug',
    TOPIC: 'topic',
  },
  RAW_CSV_DEBUG: {
    name: 'output.Raw CSV Debug',
    TOPIC: 'topic',
  },
  JSON: {
    name: 'output.JSON',
    PATH: 'output.JSON.path',
  },
};

export const stepsOrder = [DEVICE_NAMES.name, INPUT_NAMES.name, OUTPUT_NAMES.name];

export const steps = (dataSourceConfig, fields) => ({
  [DEVICE_NAMES.name]: {
    templateName: DEVICE_NAMES.TEMPLATE.name,
    staticFields: [
      {
        type: INPUT,
        name: DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_NAME,
        placeholder: DEVICE_LABELS.DEVICE_NAME,
        placeholderId: 'logManager.addDataSource.device.deviceName',
        errorMessage: 'logManager.addDataSource.errorMessage.required',
      },
      {
        type: INPUT,
        name: DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_IP,
        placeholder: DEVICE_LABELS.DEVICE_IP,
        placeholderId: 'logManager.addDataSource.device.deviceIP',
        errorMessage: 'logManager.addDataSource.errorMessage.required',
      },
      {
        type: SELECT,
        name: DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_CATEGORY,
        placeholder: DEVICE_LABELS.DEVICE_CATEGORY,
        errorMessage: 'logManager.addDataSource.errorMessage.required',
        disabled: false,
        options: false,
        onUpdateClearFields: [
          DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_TYPE,
          DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_SUB_TYPE,
        ],
        getOptions() {
          const categories = getDeviceCategoriesOptions(dataSourceConfig);
          if (!categories) {
            this.disabled = true;
          }

          return [
            {
              label: DEVICE_LABELS.DEVICE_CATEGORY,
              disabled: true,
            }].concat(categories);
        },
      },
      {
        type: SELECT,
        name: DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_TYPE,
        placeholder: DEVICE_LABELS.DEVICE_TYPE,
        errorMessage: 'logManager.addDataSource.errorMessage.required',
        disabled: false,
        options: false,
        onUpdateClearFields: [
          DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_SUB_TYPE,
        ],
        getOptions() {
          const types = getDeviceTypesOptions(dataSourceConfig, fields);
          if (!types) {
            this.disabled = true;
          }

          return [
            {
              label: DEVICE_LABELS.DEVICE_TYPE,
              disabled: true,
            }].concat(types);
        },
      },
      {
        type: SELECT,
        name: DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_SUB_TYPE,
        placeholder: DEVICE_LABELS.DEVICE_SUB_TYPE,
        errorMessage: 'logManager.addDataSource.errorMessage.required',
        disabled: false,
        options: false,
        getOptions() {
          const subTypes = getDeviceSubTypesOptions(dataSourceConfig, fields);
          if (!subTypes) {
            this.disabled = true;
          }

          return [
            {
              label: DEVICE_LABELS.DEVICE_SUB_TYPE,
              disabled: true,
            }].concat(subTypes);
        },
      },
      {
        type: SELECT,
        name: DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_TIMEZONE,
        placeholder: DEVICE_LABELS.DEVICE_TIMEZONE,
        allowSearch: true,
        errorMessage: 'logManager.addDataSource.errorMessage.required',
        options: [
          {
            label: DEVICE_LABELS.DEVICE_TIMEZONE,
            disabled: true,
          },
          ...timezones,
        ],
      },
    ],
    // tabs: [
    //   {
    //     title: DEVICE_LABELS.INDIVIDUAL_DEVICE,
    //     id: DEVICE_NAMES.INDIVIDUAL_DEVICE.name,
    //   },
    //   {
    //     title: DEVICE_LABELS.DEVICE_TYPE,
    //     id: DEVICE_NAMES.DEVICE_TYPE.name,
    //   },
    // ],
    templates: {
      [DEVICE_NAMES.INDIVIDUAL_DEVICE.name]: [
        {
          type: INPUT,
          name: DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_NAME,
          placeholder: DEVICE_LABELS.DEVICE_NAME,
          placeholderId: 'logManager.addDataSource.device.deviceName',
          errorMessage: 'logManager.addDataSource.errorMessage.required',
        },
        {
          type: INPUT,
          name: DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_IP,
          placeholder: DEVICE_LABELS.DEVICE_IP,
          placeholderId: 'logManager.addDataSource.device.deviceIP',
          errorMessage: 'logManager.addDataSource.errorMessage.required',
        },
        {
          type: SELECT,
          name: DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_TYPE,
          placeholder: DEVICE_LABELS.DEVICE_TYPE,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          options: [
            {
              label: DEVICE_LABELS.DEVICE_TYPE,
              disabled: true,
            },
            {
              id: 'deviceType1',
              label: 'Device Type 1',
            },
            {
              id: 'deviceType2',
              label: 'Device Type 2',
            },
          ],
        },
        {
          type: SELECT,
          name: DEVICE_NAMES.INDIVIDUAL_DEVICE.DEVICE_TIMEZONE,
          placeholder: DEVICE_LABELS.DEVICE_TIMEZONE,
          allowSearch: true,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          options: [
            {
              label: DEVICE_LABELS.DEVICE_TIMEZONE,
              disabled: true,
            },
            ...timezones,
          ],
        },
        {
          type: SELECT,
          name: DEVICE_NAMES.INDIVIDUAL_DEVICE.SECURITY_GROUP,
          placeholder: DEVICE_LABELS.SECURITY_GROUP,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          options: [
            {
              label: DEVICE_LABELS.SECURITY_GROUP,
              disabled: true,
            },
            {
              label: 'Security Group 1',
            },
          ],
        },
      ],
      [DEVICE_NAMES.DEVICE_TYPE.name]: [
        {
          type: INFO,
          messageId: 'logManager.form.timezoneMessage',
          message: 'All devices have to be UTC or Reporting Timezone',
        },
        {
          type: INPUT,
          placeholder: DEVICE_LABELS.GROUP_NAME,
          name: DEVICE_NAMES.DEVICE_TYPE.GROUP_NAME,
          placeholderId: 'logManager.addDataSource.device.groupName',
          errorMessage: 'logManager.addDataSource.errorMessage.required',
        },
        {
          type: SELECT,
          name: DEVICE_NAMES.DEVICE_TYPE.DEVICE_TYPE,
          placeholder: DEVICE_LABELS.DEVICE_TYPE,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          options: [
            {
              label: DEVICE_LABELS.DEVICE_TYPE,
              disabled: true,
            },
            {
              id: 'deviceType1',
              label: 'Device Type 1',
            },
            {
              id: 'deviceType2',
              label: 'Device Type 2',
            },
          ],
        },
        {
          type: SELECT,
          name: DEVICE_NAMES.DEVICE_TYPE.SECURITY_GROUP,
          placeholder: DEVICE_LABELS.SECURITY_GROUP,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          options: [
            {
              label: DEVICE_LABELS.SECURITY_GROUP,
              disabled: true,
            },
            {
              label: 'Security Group 1',
            },
          ],
        },
        {
          type: INPUT,
          placeholder: DEVICE_LABELS.DEVICE_IP,
          name: DEVICE_NAMES.DEVICE_TYPE.DEVICE_IP,
          placeholderId: 'logManager.addDataSource.device.deviceIP',
          errorMessage: 'logManager.addDataSource.errorMessage.required',
        },
        {
          type: BUTTON,
          text: 'Add Another Device IP',
          addType: {
            type: INPUT,
            placeholder: 'Device IP',
          },
        },
      ],
    },
  },
  [INPUT_NAMES.name]: {
    templateName: INPUT_NAMES.TEMPLATE.name,
    staticFields: [
      {
        type: MULTI_STEP_SELECT,
        name: INPUT_NAMES.TEMPLATE.name,
        placeholder: INPUT_LABELS.TEMPLATE,
        errorMessage: 'logManager.addDataSource.errorMessage.required',
        defaultValue: {
          option: '',
          subOption: '',
        },
        options: [
          {
            label: INPUT_LABELS.SOURCE_IP,
            isEnabled: false,
          },
          {
            label: INPUT_LABELS.NETWORK,
            options: [
              {
                label: INPUT_LABELS.GENERAL_LISTENERS,
                isEnabled: false,
              },
              {
                label: INPUT_LABELS.SYSLOG,
                isEnabled: true,
              },
              {
                label: INPUT_LABELS.KAFKA,
                isEnabled: true,
              },
              {
                label: INPUT_LABELS.RAW,
                isEnabled: true,
              },
              {
                label: INPUT_LABELS.NETFLOW,
                isEnabled: true,
              },
            ],
          },
          {
            label: INPUT_LABELS.FILE,
            options: [
              {
                label: INPUT_LABELS.S3,
                isEnabled: false,
              },
              {
                label: INPUT_LABELS.SCHEDULED_FILE,
                isEnabled: true,
              },
              {
                label: INPUT_LABELS.GUI_UPLOAD,
                isEnabled: true,
              },
            ],
          },
        ],
      },
    ],
    templates: {
      [INPUT_TEMPLATES.SOURCE_IP]: [
        {
          type: INFO,
          message: 'Format Data Required from client/BE team',
          messageId: 'logManager.form.clientError',
        },
      ],
      [INPUT_TEMPLATES.NETWORK_GENERAL_LISTENERS]: [
        {
          type: INFO,
          message: 'Format Data Required from client/BE team',
          messageId: 'logManager.form.clientError',
        },
      ],
      [INPUT_TEMPLATES.NETWORK_SYSLOG]: [
        {
          type: SELECT,
          name: INPUT_NAMES.NETWORK_SYSLOG.LISTENER_TYPE,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.SELECT_LISTENER,
          options: [
            {
              label: INPUT_LABELS.SELECT_LISTENER,
              disabled: true,
            },
            {
              id: 'tcp',
              label: 'TCP',
            },
            {
              id: 'udp',
              label: 'UDP',
            },
            {
              id: 'tls',
              label: 'TLS',
            },
          ],
        },
        {
          type: INPUT,
          name: INPUT_NAMES.NETWORK_SYSLOG.PORT,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.PORT,
          placeholderId: 'logManager.addDataSource.input.port',
        },
      ],
      [INPUT_TEMPLATES.NETWORK_KAFKA]: [
        {
          type: INPUT,
          name: INPUT_NAMES.NETWORK_KAFKA.TOPIC,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.TOPIC,
          placeholderId: 'logManager.addDataSource.output.topic',
          defaultValue: 'Recommended_topic_name',
        },
      ],
      [INPUT_TEMPLATES.NETWORK_RAW]: [
        {
          type: SELECT,
          name: INPUT_NAMES.NETWORK_RAW.LISTENER_TYPE,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.SELECT_LISTENER,
          options: [
            {
              label: INPUT_LABELS.SELECT_LISTENER,
              disabled: true,
            },
            {
              id: 'tcp',
              label: 'TCP',
            },
            {
              id: 'udp',
              label: 'UDP',
            },
          ],
        },
        {
          type: INPUT,
          name: INPUT_NAMES.NETWORK_RAW.PORT,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.PORT,
          placeholderId: 'logManager.addDataSource.input.port',
        },
        {
          type: SELECT,
          name: INPUT_NAMES.NETWORK_RAW.FORMAT,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.SELECT_FORMAT,
          options: [
            {
              label: INPUT_LABELS.SELECT_FORMAT,
              disabled: true,
            },
            {
              id: 'json',
              label: 'JSON',
            },
          ],
        },
      ],
      [INPUT_TEMPLATES.NETWORK_NETFLOW]: [
        {
          type: INPUT,
          name: INPUT_NAMES.NETWORK_NETFLOW.VERSION,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.VERSION,
          placeholderId: 'logManager.addDataSource.input.version',
        },
        {
          type: INPUT,
          name: INPUT_NAMES.NETWORK_NETFLOW.UDP,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.UDP_PORT,
          placeholderId: 'logManager.addDataSource.input.udpPort',
        },
      ],
      [INPUT_TEMPLATES.FILE_S3]: [
        {
          type: INPUT,
          name: INPUT_NAMES.FILE_S3.BUCKET_NAME,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.BUCKET_NAME,
          placeholderId: 'logManager.addDataSource.input.bucketName',
        },
        {
          type: INPUT,
          name: INPUT_NAMES.FILE_S3.FOLDER_NAME,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.FOLDER_NAME,
          placeholderId: 'logManager.addDataSource.input.folderName',
        },
        {
          type: INPUT,
          name: INPUT_NAMES.FILE_S3.ACCESS_KEY,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.ACCESS_KEY,
          placeholderId: 'logManager.addDataSource.input.accessKey',
        },
        {
          type: INPUT,
          name: INPUT_NAMES.FILE_S3.FILE_NAME,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.FILE_NAME,
          placeholderId: 'logManager.addDataSource.input.fileName',
        },
      ],
      [INPUT_TEMPLATES.FILE_SCHEDULED_FILE]: [
        {
          type: INPUT,
          name: INPUT_NAMES.FILE_SCHEDULED_FILE.FORMAT,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.FORMAT,
          placeholderId: 'logManager.addDataSource.input.format',
        },
        {
          type: INPUT,
          name: INPUT_NAMES.FILE_SCHEDULED_FILE.PATH,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.PATH,
          placeholderId: 'logManager.addDataSource.input.path',
        },
      ],
      [INPUT_TEMPLATES.FILE_GUI_UPLOAD]: [
        {
          type: INPUT,
          name: INPUT_NAMES.FILE_GUI_UPLOAD.TYPE,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.TYPE,
          placeholderId: 'logManager.addDataSource.input.type',
        },
        {
          type: INPUT,
          name: INPUT_NAMES.FILE_GUI_UPLOAD.FORMAT,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.FORMAT,
          placeholderId: 'logManager.addDataSource.input.format',
        },
        {
          type: INPUT,
          name: INPUT_NAMES.FILE_GUI_UPLOAD.FILE,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: INPUT_LABELS.CHOOSE_FILE,
          placeholderId: 'logManager.addDataSource.input.file',
        },
      ],
    },
  },
  [OUTPUT_NAMES.name]: {
    templateName: OUTPUT_NAMES.TEMPLATE.name,
    staticFields: [
      {
        type: INFO,
        messageId: 'logManager.form.outputIngestMechanism',
        message: 'Output Ingest Mechanism',
      },
      {
        type: SELECT,
        name: OUTPUT_NAMES.TEMPLATE.name,
        placeholder: OUTPUT_LABELS.TEMPLATE,
        errorMessage: 'logManager.addDataSource.errorMessage.required',
        options: [
          {
            label: OUTPUT_LABELS.TEMPLATE,
            disabled: true,
          },
          {
            label: OUTPUT_LABELS.KAFKA,
          },
          {
            label: OUTPUT_LABELS.JSON,
          },
          // {
          //   label: OUTPUT_LABELS.RUBY_DEBUG,
          // },
          // {
          //   label: OUTPUT_LABELS.RAW_CSV_DEBUG,
          // },
        ],
      },
    ],
    templates: {
      [OUTPUT_TEMPLATES.KAFKA]: [
        {
          type: INPUT,
          name: OUTPUT_NAMES.KAFKA.TARGET,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: OUTPUT_LABELS.TARGET,
          placeholderId: 'logManager.addDataSource.output.target',
          defaultValue: 'Driver node:6667',
        },
        {
          type: SELECT,
          name: OUTPUT_NAMES.KAFKA.TEMPLATE,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: OUTPUT_LABELS.SELECT_TEMPLATE,
          options: [
            {
              label: OUTPUT_LABELS.SELECT_TEMPLATE,
              disabled: true,
            },
            {
              id: 'traffic',
              label: 'Traffic',
            },
            {
              id: 'threat',
              label: 'Threat',
            },
            {
              id: 'iam',
              label: 'IAM',
            },
            {
              id: 'cloud',
              label: 'Cloud',
            },
          ],
        },
      ],
      [OUTPUT_TEMPLATES.RUBY_DEBUG]: [
        {
          type: INPUT,
          name: OUTPUT_NAMES.RUBY_DEBUG.TOPIC,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: OUTPUT_LABELS.SELECT_TOPIC,
          placeholderId: 'logManager.addDataSource.output.topic',
          defaultValue: 'Recommended_topic_name',
        },
      ],
      [OUTPUT_TEMPLATES.RAW_CSV_DEBUG]: [
        {
          type: INPUT,
          name: OUTPUT_NAMES.RAW_CSV_DEBUG.TOPIC,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: OUTPUT_LABELS.SELECT_TOPIC,
          placeholderId: 'logManager.addDataSource.output.topic',
          defaultValue: 'Recommended_topic_name',
        },
      ],
      [OUTPUT_TEMPLATES.JSON]: [
        {
          type: INPUT,
          name: OUTPUT_NAMES.JSON.PATH,
          errorMessage: 'logManager.addDataSource.errorMessage.required',
          placeholder: OUTPUT_LABELS.PATH,
          notRequired: true,
          placeholderId: 'logManager.addDataSource.output.path',
        },
      ],
    },
  },
});

export const tableConfig = [
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'devicename',
    'hidden': false,
    'label': 'Device Name',
    'resizable': true,
    'alwaysVisible': true,
    'intl': 'logManager.table.deviceName',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'devicecategoryLabel',
    'hidden': false,
    'label': 'Data Source Category',
    'resizable': true,
    'intl': 'logManager.table.dataSourceCategory',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'devicetypeLabel',
    'hidden': false,
    'label': 'Type',
    'resizable': true,
    'intl': 'logManager.table.type',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'devicesubtypeLabel',
    'hidden': false,
    'label': 'SubType/Format',
    'resizable': true,
    'intl': 'logManager.table.subType/format',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'devicetimezoneLabel',
    'hidden': false,
    'label': 'Time Zone',
    'resizable': true,
    'intl': 'logManager.table.timeZone',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'dataSourceDebug',
    'hidden': false,
    'label': 'Debug',
    'resizable': true,
    'sort': false,
    'intl': 'logManager.table.debug',
  },
  {
    'className': 'table__headerColumn',
    'isKey': false,
    'field': 'dataSourceStatus',
    'hidden': false,
    'sort': true,
    'label': 'Status',
    'resizable': true,
    'intl': 'logManager.table.status',
  },
  {
    'className': 'table__headerColumn--actions',
    'isKey': false,
    'field': 'dataSourceActions',
    'hidden': false,
    'alwaysVisible': true,
    'label': 'Actions',
    'resizable': true,
    'sort': false,
    'width': 140,
    'intl': 'logManager.table.actions',
  },
];
