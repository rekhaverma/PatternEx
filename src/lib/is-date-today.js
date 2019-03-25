import moment from 'moment';

export default (date) => {
  const today = moment.utc();
  return today.isSame(date, 'day');
};
