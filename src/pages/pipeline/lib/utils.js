/**
 *  It calculate difference between local and UTC time,
 * and return closest and smallest HCF of 24
 * @return {Integer}
 */
export const getMinDiffHours = () => {
  const currentDate = new Date();
  const timeZoneOffsetHour = Math.floor(Math.abs(currentDate.getTimezoneOffset()) / 60);
  /* Support for PST (-7H), AST (+3H) IST (+5.30) JST(+9H) */
  const minDiffernceHour = [12, 8, 4, 3, 2, 1].find(element => element < timeZoneOffsetHour);
  return minDiffernceHour;
};

/**
 *   it return true if Local time zone ahead of UTC
 *
 * @return {Boolean}
 */

export const isAheadUTC = () => {
  const date = new Date();
  return date.getTimezoneOffset() < 0;
};
