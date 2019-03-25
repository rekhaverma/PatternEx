/**
 * Long polling implementation
 *
 * @param {Function} fn       Function that will be called
 * @param {Number} timeout    The timeout time
 * @param {Number} interval   The interval time for polling
 */
export default async (fn, timeout = 2000, interval = 500) => {
  const endTime = Number(new Date()) + timeout;

  const checkCondition = async (resolve, reject) => {
    const result = await fn();
    // If the condition is met, we're done!
    if (result.status) {
      resolve(result);
      // If the condition isn't met but the timeout hasn't elapsed, go again
    } else if (Number(new Date()) < endTime || timeout === -1) {
      setTimeout(checkCondition, interval, resolve, reject);
    } else {
      // Didn't match and too much time, reject!
      reject(new Error(`Polling timed out for ${fn} : arguments,`));
    }
  };

  return new Promise(checkCondition);
};
