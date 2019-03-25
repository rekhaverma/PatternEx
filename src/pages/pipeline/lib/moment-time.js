import moment from 'moment';

/**
 *   Transform "date" value to a moment instance.
 *
 *   If "date" is already a Moment instance, directly return it.
 * If not, try to create a Moment instance, if neither this one is
 * not a valid Moment instance, return the defaultDate.
 *
 *  ------ DISCLAIMER ------
 *  Currently, this function transforms only Number dates
 *
 * @param {Number}  date          Value to be transformed
 * @param {Object}  defaultDate   Default moment() date
 * @return {Object}
 */
export default (date, defaultDate = moment.utc(), isUTC) => {
  if (date instanceof moment) {
    return date;
  }

  if (typeof date === 'number') {
    if (isUTC) {
      return moment.unix(date, 'X');
    }
    return moment.unix(date, 'X').utc();
  }

  const toMoment = moment.utc(parseInt(date, 10), 'X');

  return toMoment.isValid()
    ? toMoment
    : defaultDate;
};
