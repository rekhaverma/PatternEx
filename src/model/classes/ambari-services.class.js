import { ENVS, ambariServices } from 'config';
import ptrxREST, { ptrxAmbari, polling } from 'lib/rest';

const checkComponentState = (state) => {
  if (ambariServices.statuses.green.includes(state)) {
    return 'active';
  }

  if (ambariServices.statuses.warning.includes(state)) {
    return 'warning';
  }

  if (ambariServices.statuses.critical.includes(state)) {
    return 'critical';
  }

  return false;
};

/**
 * A service will be states as "running" only if all components
 * have state "STARTED".
 *
 * @param {Object} components   Service components
 */
const checkContainerState = (components = {}) => {
  let serviceStatus = false;

  Object.keys(components).forEach((key) => {
    serviceStatus = checkComponentState(components[key]);
  });

  return serviceStatus;
};

/**
 * Filter response by service key by ommiting the services that are not used.
 * The services that needs to be displayed are defined in ambariServices.
 *
 * @param {Object}  Response from API
 */
const filterStatuses = data => Object.keys(data).reduce(
  (acc, key) => {
    if (Object.keys(ambariServices.services).includes(key.toLowerCase())) {
      return {
        ...acc,
        [key]: {
          ...data[key],
          'running': checkContainerState(data[key].components) || checkComponentState(data[key].state),
        },
      };
    }
    return acc;
  },
  {},
);

/**
 *    Build URLs for each service and its components and fire all requests
 * using long polling. When all requests are done, call the callback function and
 * pass the response, after the states of services are grouped.
 *
 * @param {Function} cb Callback function
 */
const watchStatus = (cb) => {
  const fn = async () => {
    try {
      /**
       * WORKAROUND: Because for 54.69.30.250 (instance with Ambari)
       * we don't have access to :5000 (only :8443) we have to make the
       * request with other Axios config (ptrxAmbari)
       */
      const response = process.env.NODE_ENV === ENVS.PROD
        ? await ptrxREST('systeminfos/components')
        : await ptrxAmbari('systeminfos/components');

      cb(filterStatuses(response.data));
      return {
        'status': false,
        'payload': response.data,
      };
    } catch (error) {
      throw error;
    }
  };

  try {
    polling(
      fn,
      ambariServices.timeoutPolling,
      ambariServices.intervalPolling,
    );
  } catch (error) {
    throw error;
  }
};

export default {
  'watchStatus': watchStatus,
};
