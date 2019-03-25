import { ENVS } from 'config';

export default class {
  static tryCatch(cb = () => {}) {
    try {
      return cb();
    } catch (e) {
      if (process.env.NODE_ENV !== ENVS.PROD) {
        // eslint-disable-next-line no-console
        console.error(e);
        // eslint-disable-next-line no-console
        console.trace();
      }
    }
    return false;
  }
  static toFixed(number, decimals = 2) {
    const cb = this.tryCatch(() => number.toFixed(decimals));
    if (cb) {
      return cb;
    }
    return number;
  }
}
