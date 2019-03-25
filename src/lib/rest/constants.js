import axios from 'axios';
import { api } from '../../config';

export const ptrxREST = axios.create({
  'baseURL': `${api.base}/${api.version}`,
  'timeout': 50000,
  'withCredentials': api.withCredentials,
  'headers': {
    'Content-Type': 'application/json',
  },
});

export const ptrxRESTFormData = axios.create({
  'baseURL': `${api.base}/${api.version}`,
  'timeout': 50000,
  'withCredentials': api.withCredentials,
  'headers': {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export const ptrxZeppelin = axios.create({
  'baseURL': `${api.zeppelin}`,
  'timeout': 50000,
  'withCredentials': api.withCredentials,
  'headers': {
    'Content-Type': 'application/json',
  },
});

export const ptrxAmbari = axios.create({
  'baseURL': `${api.ambari}/${api.version}`,
  'timeout': 50000,
  'withCredentials': api.withCredentials,
  'headers': {
    'Content-Type': 'application/json',
  },
});

export const ptrxRESTlocal = axios.create({
  'baseURL': process.env.NODE_ENV === 'production' ? '/' : 'https://localhost:8443',
  'timeout': 50000,
  'withCredentials': api.withCredentials,
  'followAllRedirects': true,
  'headers': {
    'Content-Type': 'application/json',
  },
});
